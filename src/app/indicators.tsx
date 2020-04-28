import React, { FC } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/core';
import { Indicator } from './indicator';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    transform: 'translateY(-100%)',
    padding: '0 10px 7.5px 10px',
    top: '100%',
  },
});

export const Indicators: FC<{
  images: string[];
  onClick: (index: number) => void;
  currentIndex: number;
}> = ({ images, onClick, currentIndex }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
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
    </div>
  );
};
