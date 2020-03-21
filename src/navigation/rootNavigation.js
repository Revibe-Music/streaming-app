import 'react-native-gesture-handler'   // need to this to fix crash on screen swipe back
import React from "react";
import { createSwitchNavigator, createAppContainer, } from 'react-navigation';

import { AuthenticationStack} from "./stacks";AuthenticatedTabs
import { AuthenticatedTabs } from "./tabs";


const AuthenticationNavigator = (signedIn = false) => {
  return createSwitchNavigator(
    {
      Authenticated: AuthenticatedTabs,
      NotAuthenticated: AuthenticationStack,
    },
    {
      initialRouteName: signedIn ? "Authenticated" : "NotAuthenticated",
    }
  );
};

export const RootNavigator = (signedIn = false) => {
  var nav = AuthenticationNavigator(signedIn);
  return createAppContainer(nav);
};
