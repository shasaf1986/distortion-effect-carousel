import React, { FC } from 'react';
import styled from 'styled-components';
import { Indicator } from './indicator';

const Root = styled.div({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  position: 'absolute',
  width: '100%',
  transform: 'translateY(-100%)',
  padding: '0 10px 7.5px 10px',
  top: '100%',
});

export interface IndicatorsProps {
  images: string[];
  onClick: (index: number) => void;
  currentIndex: number;
}
export const Indicators: FC<IndicatorsProps> = ({
  images,
  onClick,
  currentIndex,
}) => (
  <Root>
    {images.map((image, index) => (
      <Indicator
        isActive={currentIndex === index}
        key={image}
        onClick={() => {
          onClick(index);
        }}
      >
        {index + 1}
      </Indicator>
    ))}
  </Root>
);
