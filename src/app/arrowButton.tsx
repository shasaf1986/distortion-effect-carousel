import React, { FC } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles, Theme } from '@material-ui/core';

interface StylesProps {
  isLeft: boolean;
}
const useStyles = makeStyles<Theme, StylesProps>({
  root: {
    width: '64px',
    height: '64px',
    top: '50%',
    left: ({ isLeft }) => (isLeft ? 0 : '100%'),
    transform: ({ isLeft }) =>
      `translate(${isLeft ? 10 : -10}px,-50%) rotate(${isLeft ? 180 : 0}deg)`,
    marginLeft: ({ isLeft }) => (isLeft ? 0 : '-64px'),
    border: '3px solid gray',
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: '100%',
    opacity: '0.7',
    cursor: 'pointer',
    transition: 'opacity 200ms ease-in-out',
    '&:hover': {
      opacity: '1',
    },
  },
  arrow: {
    top: '50%',
    left: '50%',
    position: 'absolute',
    transform: 'translate(-25%,-50%)',
    width: 0,
    height: 0,
    borderTop: '10px solid transparent',
    borderLeft: '20px solid #333',
    borderBottom: '10px solid transparent',
  },
});

export const ArrowButton: FC<{ isLeft: boolean; onClick: () => void }> = ({
  isLeft,
  onClick,
}) => {
  const classes = useStyles({ isLeft });

  return (
    <div onClick={onClick} className={classes.root}>
      <div className={classes.arrow} />
    </div>
  );
};
