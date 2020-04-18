import { configure, addDecorator } from '@storybook/react';
import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import App from '../src/app';

addDecorator(storyFn => <App>{storyFn()}</App>);
addDecorator(withKnobs);

configure(require.context('../src', true, /\.stories\.tsx$/), module);
