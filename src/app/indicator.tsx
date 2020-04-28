import React, { FC } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles, Theme } from '@material-ui/core';

interface StylesProps {
  isActive: boolean;
}

const useStyles = makeStyles<Theme, StylesProps>({
  root: {
    padding: '2.5px',
  },
  circle: {
    border: '2px solid gray',
    backgroundColor: '#fff',
    borderRadius: '100%',
    transition: 'opacity 200ms ease-in-out',
    opacity: ({ isActive }) => (isActive ? '1' : '0.7'),
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
  },
});

export const Indicator: FC<{ onClick: () => void; isActive: boolean }> = ({
  children,
  onClick,
  isActive,
}) => {
  const classes = useStyles({ isActive });

  return (
    <div onClick={onClick} className={classes.root}>
      <div className={classes.circle} onClick={onClick}>
        <span>{children}</span>
      </div>
    </div>
  );
};
