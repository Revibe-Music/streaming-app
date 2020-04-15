/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

 import 'react-native-gesture-handler'   // need to this to fix crash on screen swipe back

import React from 'react'
import { AppRegistry } from 'react-native';
import amplitude from 'amplitude-js'
import App from './App';
import {name as appName} from './app.json';
import { Provider } from 'react-redux'

import store from './src/redux/rootReducer';

var testAmplitudeKey = "09f00d58305976a02830711d6fab3b72"
var prodAmplitudeKey = "ac5bc02f3725f6d6a531b2751e78e1a8"
var amplitudeConfig = {
    saveEvents: true,
    includeReferrer: true,
    sessionTimeout: 15*60*1000, // 30 min
}

amplitude.getInstance().init(testAmplitudeKey, null, amplitudeConfig);

const RevibeApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

console.disableYellowBox = true;
AppRegistry.registerComponent(appName, () => RevibeApp);
