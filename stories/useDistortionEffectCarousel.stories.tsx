import { storiesOf } from '@storybook/react';
import { select } from '@storybook/addon-knobs';
import React from 'react';
import { Carousel, CarouselProps } from './components';

storiesOf('useDistortionEffectCarousel', module).add('default', () => (
  <Carousel
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
