import { storiesOf } from '@storybook/react';
import { select, number } from '@storybook/addon-knobs';
import React from 'react';
import { Carousel, CarouselProps } from './components';

storiesOf('useDistortionEffectCarousel', module).add('default', () => (
  <Carousel
    easing={select(
      'easing',
      {
        easeOut: 'easeOut',
        easeInOut: 'easeInOut',
        easeIn: 'easeIn',
      },
      'easeOut'
    )}
    commonAngle={number('commonAngle', Math.PI / 4)}
    angle1={number('angle1', Math.PI / 4)}
    angle2={number('angle2', -3 * (Math.PI / 4))}
    resizeDebounce={number('resizeDebounce', 250)}
    intensity={number('intensity', 1)}
    speed={number('speed', 1.6)}
    displacment={select(
      'displacment',
      Array.from({ length: 16 }, () => null).reduce(
        (acc, _, index) => ({
          ...acc,
          [index + 1]: index + 1,
        }),
        {}
      ),
      5
    )}
    backgroundSize={select<Required<CarouselProps>['backgroundSize']>(
      'backgroundSize',
      {
        contain: 'contain',
        cover: 'cover',
        repeat: 'repeat',
        stretch: 'stretch',
      },
      'cover'
    )}
    displacmentBackgroundSize={select<
      Required<CarouselProps>['displacmentBackgroundSize']
    >(
      'displacmentBackgroundSize',
      {
        contain: 'contain',
        cover: 'cover',
        repeat: 'repeat',
        stretch: 'stretch',
      },
      'cover'
    )}
  />
));
