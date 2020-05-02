# Distortion Effect Carousel

HTML carousel with distortion effect for React and Vanilla.
Inspired by [hover-effect](https://github.com/robin-dela/hover-effect).

[**DEMO**](https://shasaf1986.github.io/distortion-effect-carousel)

![](https://github.com/shasaf1986/distortion-effect-carousel/workflows/Build%20CI/badge.svg)

### Install

```
yarn add @shasaf1986/distortion-effect-carousel
```

Or with NPM.

```
npm install @shasaf1986/distortion-effect-carousel
```

## Basic usage

```jsx
import React from 'react';
import { useDistortionEffectCarousel } from '@shasaf1986/distortion-effect-carousel';

interface MyCarouselProps {
  images: string[];
  displacmentImage: string;
}

const MyCarousel: React.FC<MyCarouselProps> = ({
  displacmentImage,
  images,
}) => {
  const { ref, next, prev } = useDistortionEffectCarousel({
    images,
    displacmentImage,
  });

  // ... do something with next() and prev()
  return (
    <div
      style={{
        height: '350px',
      }}
      ref={ref}
    />
  );
};
```

## Hook

### Parameters

| Name                         | Type                                                       | Default            | Description                                                                                        |
| ---------------------------- | ---------------------------------------------------------- | ------------------ | -------------------------------------------------------------------------------------------------- |
| `images`                     | `string[]`                                                 |                    | Array of image sources                                                                             |
| `displacementImage`          | `string`                                                   |                    | The source of `displacementImage` used to do the transition between two images.                    |
| `ref?`                       | `MutableRefObject<T extends HTMLElement = HTMLDivElement>` |                    | The ref of the parent DOM element                                                                  |
| `intensity?`                 | `number`                                                   | `1`                | Used to determine the intensity of the distortion effect. 0 is no effect and 1 is full distortion. |
| `commonAngle?`               | `number`                                                   | `Math.PI / 4`      | Angle of the distortion effect in Radians. Defaults to Pi / 4 (45 degrees).                        |
| `angle1?`                    | `number`                                                   | `commonAngle`      | Overrides the distortion angle for the first image.                                                |
| `angle2?`                    | `number`                                                   | `-commonAngle * 3` | Overrides the distortion angle for the second image.                                               |
| `speed?`                     | `number`                                                   | `1.6`              | Speed of the animation (in seconds).                                                               |
| `easing?`                    | `Easing`                                                   | `easeOut`          | `'easeIn' | 'easeOut' | 'easeInOut'`                                                               |
| `backgroundSize?`            | `BackgroundSize`                                           | `'cover'`          | The background size of images, `'contain' | 'cover' | 'repeat' | 'stretch'`                        |
| `displacmentBackgroundSize?` | `BackgroundSize`                                           | `'cover'`          | The background size of displacement image, `'contain' | 'cover' | 'repeat' | 'stretch'`            |
| `initialIndex?`              | `number`                                                   | `0`                | The index of first image to display                                                                |
| `resizeDebounce?`            | `number`                                                   | `250`              | Resize debounce in ms                                                                              |

### Return value

| Name           | Type                                                       | Description                                                  |
| -------------- | ---------------------------------------------------------- | ------------------------------------------------------------ |
| `next`         | `() => void`                                               | Transition to next image.                                    |
| `prev`         | `() => void`                                               | Transition to previous image.                                |
| `jump`         | `(index: number) => void`                                  | Transition to previous image.                                |
| `currentIndex` | `number`                                                   | The current index of carousel                                |
| `ref`          | `MutableRefObject<T extends HTMLElement = HTMLDivElement>` | The ref of the parent DOM element                            |
| `loadedImages` | `Partial<Record<number, boolean>>`                         | An object that represents the loaded images by their indexes |
