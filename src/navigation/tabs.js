import React from "react";
import { Text, Icon, Header, Body } from "native-base";
import { createBottomTabNavigator } from 'react-navigation-tabs';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import { BrowseStack, LibraryStack, SearchStack } from "./stacks";
import BottomTab from './../components/bottomTab/index';

const activeTintLabelColor = "#7248BD";
const inactiveTintLabelColor = "#8E8E93";

export const AuthenticatedTabs = createBottomTabNavigator(
    {
      Browse : {
        screen: BrowseStack,
        navigationOptions: {
          header: null,
          headerTransparent: true,
          tabBarLabel: ({ focused }) => <Text style={{ fontSize: hp("1.4%"), color: focused ? activeTintLabelColor : inactiveTintLabelColor }}>Browse</Text>,
          tabBarIcon: ({ focused }) => <Icon type="Ionicons" name="ios-musical-notes" style={{fontSize: hp("4%"), paddingTop: hp(".25%"), color: focused ? activeTintLabelColor : inactiveTintLabelColor}} />
        }
      },
      Library : {
        screen: LibraryStack,
        navigationOptions: {
          header: null,
          headerTransparent: true,
          tabBarLabel: ({ focused }) => <Text style={{ fontSize: hp("1.4%"), color: focused ? activeTintLabelColor : inactiveTintLabelColor }}>Library</Text>,
          tabBarIcon: ({ focused }) => <Icon type="Ionicons" name="ios-albums" style={{fontSize: hp("4%"), paddingTop: hp(".25%"), color: focused ? activeTintLabelColor : inactiveTintLabelColor}} />
        }
      },
      Search : {
        screen: SearchStack,
        navigationOptions: {
          tabBarLabel: ({ focused }) => <Text style={{ fontSize: hp("1.4%"), color: focused ? activeTintLabelColor : inactiveTintLabelColor }}> Search </Text>,
          tabBarIcon: ({ focused }) => <Icon type="Ionicons" name="ios-search" style={{fontSize: hp("4%"), paddingTop: hp(".25%"), color: focused ? activeTintLabelColor : inactiveTintLabelColor}} />,
        }
      },
    },
    {
      initialRouteName: "Browse",
      order: ["Browse", "Search", "Library"],
      swipeEnabled: false,
      lazy: false,
      navigatorStyle : {
        statusBarTextColorScheme: "light",
        statusBarColor: "black"
      },

      navigationOptions: ({navigation}) => ({
        header: <Header style={{backgroundColor: "#121212",height:1, position: "absolute", borderBottomWidth: 0, marginBottom:0, paddingBottom:0, top:-50}} androidStatusBarColor="#222325" iosBarStyle="light-content" />,
      }),

      tabBarOptions: {
        tabStyle: {
          flexDirection: "column",
        },
        activeTintColor: activeTintLabelColor,
        inactiveTintColor: inactiveTintLabelColor,
        showIcon: true,
        showLabel: true,
      },
      tabBarComponent: props => <BottomTab {...props}/>,
      tabBarPosition: "bottom",
    }
);

var  tabConfig = {
  initialRouteName: "Library",
  // order: ["Browse", "Search", "Library"],
  swipeEnabled: false,
  lazy: false,
  navigatorStyle : {
    statusBarTextColorScheme: "light",
    statusBarColor: "black"
  },

  navigationOptions: ({navigation}) => ({
    header: <Header style={{backgroundColor: "#121212",height:1, position: "absolute", borderBottomWidth: 0, marginBottom:0, paddingBottom:0, top:-50}} androidStatusBarColor="#222325" iosBarStyle="light-content" />,
  }),

  tabBarOptions: {
    tabStyle: {
      flexDirection: "column",
    },
    activeTintColor: activeTintLabelColor,
    inactiveTintColor: inactiveTintLabelColor,
    showIcon: true,
    showLabel: true,
  },
  tabBarComponent: props => <BottomTab {...props}/>,
  tabBarPosition: "bottom",
}
