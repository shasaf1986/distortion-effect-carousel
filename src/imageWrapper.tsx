export interface ImageWrapperOptions {
  index?: number;
  isDisplacement: boolean;
}

export class ImageWrapper {
  image?: ImageBitmap;

  readonly canvas: HTMLCanvasElement;

  readonly isDisplacement: boolean;

  readonly index: number;

  constructor({ isDisplacement, index = -1 }: ImageWrapperOptions) {
    this.isDisplacement = isDisplacement;
    this.index = index;
    this.canvas = document.createElement('canvas');
  }
}
