import { storiesOf } from '@storybook/react';
import { select } from '@storybook/addon-knobs';
import React from 'react';
import { Carousel, CarouselProps } from './components';

storiesOf('useDistortionEffectCarousel', module).add('default', () => (
  <Carousel
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
