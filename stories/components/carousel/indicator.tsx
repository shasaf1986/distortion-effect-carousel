import React, { FC } from 'react';
import styled from 'styled-components';

const Root = styled.div({
  padding: '2.5px',
});

interface CircleProps {
  isActive: boolean;
}
const Circle = styled.div<CircleProps>(({ isActive }) => ({
  border: '2px solid gray',
  backgroundColor: '#fff',
  borderRadius: '100%',
  transition: 'opacity 200ms ease-in-out',
  opacity: isActive ? '1' : '0.7',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  width: '30px',
  height: '30px',
  color: '#333',
  '&:hover': {
    opacity: '1',
  },
}));

export interface IndicatorProps {
  onClick: () => void;
  isActive: boolean;
}

export const Indicator: FC<{ onClick: () => void; isActive: boolean }> = ({
  children,
  onClick,
  isActive,
}) => (
  <Root>
    <Circle onClick={onClick} isActive={isActive}>
      <span>{children}</span>
    </Circle>
  </Root>
);
