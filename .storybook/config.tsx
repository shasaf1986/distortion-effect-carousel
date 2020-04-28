import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import {
  MuiThemeProvider,
  createMuiTheme,
  CssBaseline,
} from '@material-ui/core';

const theme = createMuiTheme({
  palette: {
    background: {
      default: '#fff',
    },
  },
});
addDecorator(withKnobs);
addDecorator((storybookFn) => (
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    {storybookFn()}
  </MuiThemeProvider>
));
configure(require.context('../src', true, /\.stories\.tsx$/), module);
