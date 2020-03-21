import React from "react";
import { createDrawerNavigator } from 'react-navigation-drawer';

import Browse from "./../screens/Authenticated/browse";
import Settings from "./../screens/Authenticated/settings";
import Menu from "./../components/Drawer/Menu";
import DrawerItem from "./../components/Drawer/DrawerItem";


export const Drawer = createDrawerNavigator(
  {
    Browse: {
      screen: Browse,
      navigationOptions: navOpt => ({
        drawerLabel: ({ focused }) => (
          <DrawerItem focused={focused} title="Home" />
        ),
      })
    },
    Accounts: {
      screen: Settings,
      navigationOptions: navOpt => ({
        drawerLabel: ({ focused }) => (
          <DrawerItem focused={focused} screen="Settings" title="Manage Accounts" />
        )
      })
    },
  },
  Menu
);
