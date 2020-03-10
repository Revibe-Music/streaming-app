import 'react-native-gesture-handler'   // need to this to fix crash on screen swipe back

import React from "react";
import { Text, Icon, Header, Body } from "native-base";
import { Image } from "react-native";

import Login from "./screens/Unauthenticated/login";
import LoginScreen from "./screens/Unauthenticated/LoginScreen";
import RegisterScreen from "./screens/Unauthenticated/RegisterScreen";
import Signup from "./screens/Unauthenticated/signup";
import LinkAccounts from "./screens/Unauthenticated/linkAccounts";
import Tutorial from "./screens/Unauthenticated/tutorial";

import Search from "./screens/Authenticated/search";
import Library from "./screens/Authenticated/library";
import Browse from "./screens/Authenticated/browse";
import Settings from "./screens/Authenticated/settings";
import Artist from "./screens/Authenticated/artist/index";
import Album from "./screens/Authenticated/album/index";
import ViewAll from "./screens/Authenticated/viewAll/index";

import Logo from "./components/Logo";
import Menu from "./components/Drawer/Menu";
import DrawerItem from "./components/Drawer/DrawerItem";

import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createSwitchNavigator, createAppContainer, } from 'react-navigation';
import BottomTab from './components/bottomTab/index';
import { HeaderBackButton } from 'react-navigation';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


const DrawerNav = createDrawerNavigator(
  {
    Home: {
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

const BrowseNav = createStackNavigator(
  {
    Artist: {screen: Artist},
    Album: {screen: Album},
    Settings: {screen: Settings},
    ViewAll: {screen: ViewAll},
    Browse: {screen: DrawerNav},

  },
  {
    initialRouteName: "Browse",
    headerMode: 'none'
  }
);

const LibraryNav = createStackNavigator(
  {
    Artist: {screen: Artist},
    Album: {screen: Album},
    ViewAll: {screen: ViewAll},
    Library: {screen: Library},
  },
  {
    initialRouteName: "Library",
    headerMode: 'none'
  }
);

const SearchNav = createStackNavigator(
  {
    Artist: {screen: Artist},
    Album: {screen: Album},
    Search: {screen: Search},
    ViewAll: {screen: ViewAll},
  },
  {
    initialRouteName: "Search",
  }
);


const activeTintLabelColor = "#7248BD";
const inactiveTintLabelColor = "#8E8E93";

const AppStack = createBottomTabNavigator(
    {

      Browse : {
        screen: BrowseNav,
        navigationOptions: {
          header: null,
          headerTransparent: true,
          tabBarLabel: ({ focused }) => <Text style={{ fontSize: hp("1.4%"), color: focused ? activeTintLabelColor : inactiveTintLabelColor }}>Browse</Text>,
          tabBarIcon: ({ focused }) => <Icon type="Ionicons" name="ios-musical-notes" style={{fontSize: hp("4%"), paddingTop: hp(".25%"), color: focused ? activeTintLabelColor : inactiveTintLabelColor}} />
        }
      },
      Library : {
        screen: LibraryNav,
        navigationOptions: {
          header: null,
          headerTransparent: true,
          tabBarLabel: ({ focused }) => <Text style={{ fontSize: hp("1.4%"), color: focused ? activeTintLabelColor : inactiveTintLabelColor }}>Library</Text>,
          tabBarIcon: ({ focused }) => <Icon type="Ionicons" name="ios-albums" style={{fontSize: hp("4%"), paddingTop: hp(".25%"), color: focused ? activeTintLabelColor : inactiveTintLabelColor}} />
        }
      },
      Search : {
        screen: SearchNav,
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
          // backgroundColor: "#121212"
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


const AuthStack = createStackNavigator(
  {
    Signup: {
      screen: RegisterScreen,
      navigationOptions: ({navigation}) => ({
        header: null,
        headerTransparent: true,
      }),
    },
    Login: {
      screen: LoginScreen,
      navigationOptions: ({navigation}) => ({
        header: null,
        headerTransparent: true,
      }),
    },
    LinkAccounts: {
      screen: LinkAccounts,
      navigationOptions: ({navigation}) => ({
        header: <Header style={{backgroundColor: "#121212", borderBottomWidth: 0, marginBottom:0, paddingBottom:0, paddingTop: hp('10%'),}} androidStatusBarColor="#222325" iosBarStyle="light-content" >
                    <Image source={require("./../assets/RevibeLogo.png")} style={{width:wp('50%'), height:hp('6%'),}}/>
                </Header>
      }),
    },
    Tutorial: {
      screen: Tutorial,
      navigationOptions: ({navigation}) => ({
        header: null,
        headerTransparent: true,
      }),
    },
    Tutorial: {
      screen: Tutorial,
      navigationOptions: ({navigation}) => ({
        header: null,
        headerTransparent: true,
      }),
    },
  },
  {
    initialRouteName: "Login",
  }
);



const AppNavigator = (signedIn = false) => {
  return createSwitchNavigator(
    {
      Authenticated: AppStack,
      NotAuthenticated: AuthStack,
    },
    {
      initialRouteName: signedIn ? "Authenticated" : "NotAuthenticated",
    }
  );
};

export const AppContainer = (signedIn = false) => {
  var nav = AppNavigator(signedIn);
  return createAppContainer(nav);
};
