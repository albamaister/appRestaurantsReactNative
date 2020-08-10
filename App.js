import React from 'react';
import { YellowBox } from 'react-native';
import Navigation from './app/navigations/Navigation';
import { firebaseApp } from './app/utils/firebase';
import {decode, encode} from 'base-64';

// YellowBox.ignoreWarnings(['Setting a timer']);
YellowBox.ignoreWarnings(['Setting a timer']);
// const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    // _console.warn(message);
  }
};
if (!global.btoa) global.btoa = encode;
if (!global.atob) global.atob = decode;

export default function App() {
  return <Navigation/>
}
