/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

 import 'react-native-gesture-handler'   // need to this to fix crash on screen swipe back

import React from 'react'
import { AppRegistry } from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { Provider } from 'react-redux'
import store from './src/redux/rootReducer';


const RevibeApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerComponent(appName, () => RevibeApp);
