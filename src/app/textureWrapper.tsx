import { Texture, LinearFilter } from 'three';

export interface TextureWrapperOptions {
  index?: number;
  isDisplacement: boolean;
}

export class TextureWrapper {
  readonly texture: Texture;

  readonly isDisplacement: boolean;

  index: number;

  constructor({ isDisplacement, index = -1 }: TextureWrapperOptions) {
    this.isDisplacement = isDisplacement;
    this.index = index;
    this.texture = new Texture();
    this.texture.minFilter = LinearFilter;
    this.texture.magFilter = LinearFilter;
  }
}
