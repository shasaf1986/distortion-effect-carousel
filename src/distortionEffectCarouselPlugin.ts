import { TweenMax, Expo } from 'gsap';
import debounce from 'lodash/debounce';
import find from 'lodash/find';
import {
  ShaderMaterial,
  PlaneBufferGeometry,
  Mesh,
  Scene,
  OrthographicCamera,
  WebGLRenderer,
  Vector4,
  ImageBitmapLoader,
} from 'three';
import ResizeObserver from 'resize-observer-polyfill';
import { fragment, vertex } from './shaders';
import { TextureWrapper } from './textureWrapper';
import { cover, contain } from 'intrinsic-scale';
import './createImageBitmapPolyfill';
import { ImageWrapper } from './imageWrapper';

export type BackgroundSize = 'cover' | 'contain' | 'repeat' | 'stretch';

export type Easing = keyof typeof Expo;

export type onImageLoaded = (index: number) => void;

export interface DistortionEffectCarouselPluginOptions {
  intensity?: number;
  commonAngle?: number;
  angle1?: number;
  angle2?: number;
  speed?: number;
  easing?: Easing;
  parent: HTMLElement;
  initialIndex?: number;
  backgroundSize?: BackgroundSize;
  displacmentBackgroundSize?: BackgroundSize;
  images: string[];
  displacmentImage: string;
  resizeDebounce?: number;
  onImageLoaded?: onImageLoaded;
  dpr?: number;
}

export class DistortionEffectCarouselPlugin {
  private readonly backgroundSize: BackgroundSize;

  private readonly displacmentBackgroundSize: BackgroundSize;

  private readonly images: ImageWrapper[];

  private displacmentImage: ImageWrapper;

  private readonly loader: ImageBitmapLoader;

  private readonly speed: number;

  private readonly easing: gsap.EaseFunction;

  private readonly parent: HTMLElement;

  private readonly scene: Scene;

  private readonly camera: OrthographicCamera;

  private readonly renderer: WebGLRenderer;

  private readonly mat: ShaderMaterial;

  private readonly geometry: PlaneBufferGeometry;

  private readonly texture1: TextureWrapper;

  private readonly texture2: TextureWrapper;

  private readonly disp: TextureWrapper;

  private readonly textures: TextureWrapper[];

  private readonly resizeObserver: ResizeObserver;

  private readonly angle1: number;

  private readonly angle2: number;

  private readonly dpr: number;

  private readonly onImageLoaded?: onImageLoaded;

  private isDisposed: boolean = false;

  private showFirstImage: boolean = true;

  private currentIndex: number = 0;

  private tween?: gsap.core.Tween;

  private width: number;

  private height: number;

  constructor({
    intensity = 1,
    commonAngle = Math.PI / 4,
    angle1,
    angle2,
    speed = 1.6,
    easing = 'easeOut',
    parent,
    initialIndex = 0,
    images,
    displacmentImage,
    backgroundSize = 'cover',
    displacmentBackgroundSize = 'cover',
    resizeDebounce = 250,
    onImageLoaded,
    dpr = (typeof window !== 'undefined' && window.devicePixelRatio) || 1,
  }: DistortionEffectCarouselPluginOptions) {
    this.dpr = dpr;
    this.onImageLoaded = onImageLoaded;
    this.backgroundSize = backgroundSize;
    this.displacmentBackgroundSize = displacmentBackgroundSize;
    this.loader = new ImageBitmapLoader();
    this.displacmentImage = new ImageWrapper({
      isDisplacement: true,
    });
    this.images = images.map(
      (_, index) => new ImageWrapper({ isDisplacement: false, index })
    );
    this.loader.crossOrigin = '';
    this.angle1 = typeof angle1 === 'number' ? angle1 : commonAngle;
    this.angle2 = typeof angle2 === 'number' ? angle2 : -commonAngle * 3;
    this.speed = speed;
    this.easing = Expo[easing];
    this.parent = parent;
    this.width = parent.offsetWidth;
    this.height = parent.offsetHeight;
    this.currentIndex = initialIndex;

    if (!this.checkIfIndexValid(this.currentIndex)) {
      console.warn('initial index out of boundaries');
      this.currentIndex = 0;
    }

    this.texture1 = new TextureWrapper({
      isDisplacement: false,
      index: this.currentIndex,
    });
    this.texture2 = new TextureWrapper({
      isDisplacement: false,
    });
    this.disp = new TextureWrapper({
      isDisplacement: true,
    });
    this.textures = [this.texture1, this.texture2, this.disp];

    this.mat = new ShaderMaterial({
      uniforms: {
        intensity: {
          type: 'f',
          value: intensity,
        },
        dispFactor: {
          type: 'f',
          value: 0.0,
        },
        angle1: {
          type: 'f',
        },
        angle2: {
          type: 'f',
        },
        texture1: {
          type: 't',
          value: this.texture1.texture,
        },
        texture2: {
          type: 't',
          value: this.texture2.texture,
        },
        disp: {
          type: 't',
          value: this.disp.texture,
        },
        res: {
          type: 'vec4',
          value: this.createVector(),
        },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      opacity: 1,
    });

    this.geometry = new PlaneBufferGeometry(this.width, this.height, 1);

    const mesh = new Mesh(this.geometry, this.mat);

    this.scene = new Scene();
    this.scene.add(mesh);

    this.camera = new OrthographicCamera(
      this.width / -2,
      this.width / 2,
      this.height / 2,
      this.height / -2,
      1,
      1000
    );
    this.camera.position.z = 1;

    this.renderer = new WebGLRenderer({
      alpha: true,
    });
    this.renderer.setPixelRatio(this.dpr);
    this.renderer.setClearColor(0xffffff, 0.0);
    this.renderer.setSize(this.width, this.height);
    this.renderer.compile(this.scene, this.camera);

    this.parent.appendChild(this.renderer.domElement);
    this.onResize = debounce(this.onResize, resizeDebounce);
    this.resizeObserver = new ResizeObserver(this.onResize);
    this.resizeObserver.observe(this.parent);
    this.loadImage(displacmentImage, this.displacmentImage);
    images.forEach((src, index) => {
      this.loadImage(src, this.images[index]);
    });
  }

  private loadImage(src: string, imageWrapper: ImageWrapper) {
    const { isDisplacement, index } = imageWrapper;
    this.loader.load(
      src,
      (image) => {
        // async callback, check if disposed
        if (this.isDisposed) {
          return;
        }
        imageWrapper.image = image;
        this.drawImage(imageWrapper);
        const textureWrapper = find(this.textures, { isDisplacement, index });
        if (textureWrapper) {
          this.attachImage(textureWrapper);
          if (!isDisplacement && index === this.currentIndex) {
            // render only if this is the current image
            this.render();
          }
        }
        if (!isDisplacement && this.onImageLoaded) {
          this.onImageLoaded(index);
        }
      },
      () => undefined,
      () => {
        console.warn('faild to load image');
        // TODO: handle error
        if (!isDisplacement && this.onImageLoaded) {
          this.onImageLoaded(index);
        }
      }
    );
  }

  private render = () => {
    this.renderer.render(this.scene, this.camera);
  };

  private createVector() {
    return new Vector4(
      this.width * (this.dpr / 2),
      this.height * (this.dpr / 2),
      1,
      1
    );
  }

  private drawImage({ canvas, image, isDisplacement }: ImageWrapper) {
    if (!image) {
      // image not loaded yet
      return;
    }

    canvas.width = this.width * this.dpr;
    canvas.height = this.height * this.dpr;
    const context = canvas.getContext('2d');
    if (!context) {
      console.warn('canvas context is not defined');
      return;
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
    const backgroundSize = isDisplacement
      ? this.displacmentBackgroundSize
      : this.backgroundSize;
    switch (backgroundSize) {
      case 'repeat': {
        const pattern = context.createPattern(image, 'repeat');
        context.fillStyle = pattern!;
        context.fillRect(0, 0, canvas.width, canvas.height);
        break;
      }
      case 'stretch': {
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        break;
      }
      default: {
        const scaleFunction = backgroundSize === 'cover' ? cover : contain;
        const { height, width, x, y } = scaleFunction(
          this.width,
          this.height,
          image.width,
          image.height
        );
        context.drawImage(
          image,
          x * this.dpr,
          y * this.dpr,
          width * this.dpr,
          height * this.dpr
        );
      }
    }
  }

  private attachImage(textureWrapper: TextureWrapper) {
    const { texture, index, isDisplacement } = textureWrapper;
    const { canvas } = isDisplacement
      ? this.displacmentImage
      : this.images[index];
    texture.image = canvas;
    texture.needsUpdate = true;
  }

  private checkIfIndexValid(index: number) {
    return index >= 0 && index <= this.images.length - 1;
  }

  private calculatePrevIndex(index: number) {
    let newIndex = index - 1;
    if (!this.checkIfIndexValid(newIndex)) {
      newIndex = this.images.length - 1;
    }

    return newIndex;
  }

  private calculateNextIndex(index: number) {
    let newIndex = index + 1;
    if (!this.checkIfIndexValid(newIndex)) {
      newIndex = 0;
    }

    return newIndex;
  }

  private onResize = () => {
    // onResize is an async callback, check if disposed
    if (this.isDisposed) {
      return;
    }
    const newWidth = this.parent.offsetWidth;
    const newHeight = this.parent.offsetHeight;
    if (this.width === newWidth && this.height === newHeight) {
      return;
    }

    this.width = newWidth;
    this.height = newHeight;
    const { uniforms } = this.mat;
    // draw all images with new size
    this.drawImage(this.displacmentImage);
    this.images.forEach((image) => {
      this.drawImage(image);
    });
    this.textures.forEach(({ texture }) => {
      if (texture.image) {
        texture.needsUpdate = true;
      }
    });
    uniforms.res.value = this.createVector();

    this.renderer.setSize(this.width, this.height);
    this.render();
  };

  private slide(index: number, isNext: boolean) {
    this.currentIndex = index;
    const { uniforms } = this.mat;
    this.showFirstImage = !this.showFirstImage;
    const newTextureWrapper = this.showFirstImage
      ? this.texture1
      : this.texture2;
    newTextureWrapper.index = this.currentIndex;
    if ((this.showFirstImage && isNext) || (!this.showFirstImage && !isNext)) {
      uniforms.angle1.value = this.angle1;
      uniforms.angle2.value = this.angle2;
    } else {
      uniforms.angle1.value = this.angle2;
      uniforms.angle2.value = this.angle1;
    }

    this.attachImage(newTextureWrapper);
    this.tween?.kill();
    this.tween = TweenMax.to(uniforms.dispFactor, this.speed, {
      value: this.showFirstImage ? 0 : 1,
      ease: this.easing,
      onUpdate: this.render,
      onComplete: this.render,
    });
  }

  next() {
    const newIndex = this.calculateNextIndex(this.currentIndex);
    this.slide(newIndex, true);
  }

  prev() {
    const newIndex = this.calculatePrevIndex(this.currentIndex);
    this.slide(newIndex, false);
  }

  jump(index: number) {
    if (!this.checkIfIndexValid(index)) {
      console.warn('index out of boundaries');
      return;
    }
    if (index === this.currentIndex) {
      return;
    }

    const isNext = index > this.currentIndex;
    this.slide(index, isNext);
  }

  getCurrentIndex() {
    return this.currentIndex;
  }

  dispose() {
    this.tween?.kill();
    this.textures.forEach(({ texture }) => {
      texture.dispose();
    });
    this.parent.removeChild(this.renderer.domElement);
    this.renderer.dispose();
    this.scene.dispose();
    this.geometry.dispose();
    this.resizeObserver.disconnect();
    this.isDisposed = true;
  }
}
