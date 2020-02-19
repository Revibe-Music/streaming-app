import 'react-native-gesture-handler'   // need to this to fix crash on screen swipe back

import React from "react";
import { Text, Icon, Header, Body } from "native-base";
import { Image } from "react-native";

import Login from "./screens/Unauthenticated/login";
import Signup from "./screens/Unauthenticated/signup";
import LinkAccounts from "./screens/Unauthenticated/linkAccounts";
import Search from "./screens/Authenticated/search";
import Library from "./screens/Authenticated/library";
import Queue from "./screens/Authenticated/queue";
import Settings from "./screens/Authenticated/settings";
import Artist from "./screens/Authenticated/artist/index";
import Album from "./screens/Authenticated/album/index";
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import BottomTab from './components/bottomTab/index';
import { HeaderBackButton } from 'react-navigation';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


const LibraryNav = createStackNavigator(
  {
    Artist: {screen: Artist},
    Album: {screen: Album},
    Settings: {screen: Settings},
    Library: {screen: Library}
  },
  {
    initialRouteName: "Library",
  }
);

const SearchNav = createStackNavigator(
  {
    Artist: {screen: Artist},
    Album: {screen: Album},
    Search: {screen: Search},
    // ViewAllSongs: {screen: ViewAllSongs},
    // ViewAllArtists: {screen: ViewAllArtists},
  },
  {
    initialRouteName: "Search",
  }
);

const QueueNav = createStackNavigator(
  {
    Artist: {screen: Artist},
    Album: {screen: Album},
    Queue: {screen: Queue}
  },
  {
    initialRouteName: "Queue",
  }
);

const activeTintLabelColor = "#7248BD";
const inactiveTintLabelColor = "#8E8E93";

const AppStack = createBottomTabNavigator(
    {

      Library : {
        screen: LibraryNav,
        navigationOptions: {
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
      Queue : {
        screen: QueueNav,
        navigationOptions: {
          tabBarLabel: ({ focused }) => <Text style={{ fontSize: hp("1.4%"), color: focused ? activeTintLabelColor : inactiveTintLabelColor }}>Queue</Text>,
          tabBarIcon: ({ focused }) => <Icon type="MaterialIcons" name="queue-music" style={{fontSize: hp("4%"), paddingTop: hp(".25%"), color: focused ? activeTintLabelColor : inactiveTintLabelColor}} />
        }
      },

    },
    {
      initialRouteName: "Library",
      order: ["Library", "Search", "Queue"],
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
      screen: Signup,
      navigationOptions: ({navigation}) => ({
        header: <Header style={{backgroundColor: "#121212", borderBottomWidth: 0, marginBottom:0, paddingBottom:0, paddingTop: hp('10%'),}} androidStatusBarColor="#222325" iosBarStyle="light-content" >
                    <Image source={require("./../assets/RevibeLogo.png")} style={{width:wp('50%'), height:hp('6%'),}}/>
                </Header>
      }),
    },
    Login: {
      screen: Login,
      navigationOptions: ({navigation}) => ({
        header: <Header style={{backgroundColor: "#121212", borderBottomWidth: 0, marginBottom:0, paddingBottom:0, paddingTop: hp('10%'),}} androidStatusBarColor="#222325" iosBarStyle="light-content" >
                    <Image source={require("./../assets/RevibeLogo.png")} style={{width:wp('50%'), height:hp('6%'),}}/>
                </Header>
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
  },
  {
    initialRouteName: "Signup",
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
