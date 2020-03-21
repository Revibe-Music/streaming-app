import { createStackNavigator } from 'react-navigation-stack';

// Authentication Pages
import LoginScreen from "./../screens/Unauthenticated/LoginScreen";
import LinkAccounts from "./../screens/Unauthenticated/linkAccounts";
import Tutorial from "./../screens/Unauthenticated/tutorial";

// Authenticated Pages
import Library from "./../screens/Authenticated/library";
import LibraryContent from "./../screens/Authenticated/Library/LibraryContent";
import PlaylistContent from "./../screens/Authenticated/Library/PlaylistContent";
import Search from "./../screens/Authenticated/search";
import Settings from "./../screens/Authenticated/settings";
import Artist from "./../screens/Authenticated/artist/index";
import Album from "./../screens/Authenticated/album/index";
import Playlist from "./../screens/Authenticated/playlist/index";
import ViewAll from "./../screens/Authenticated/viewAll/index";

import {Drawer} from "./drawers";


const BrowsePages = {
  Browse: {screen: Drawer},
  Artist: {screen: Artist},
  Album: {screen: Album},
  Playlist: {screen: Playlist},
  Settings: {screen: Settings},
  ViewAll: {screen: ViewAll},
}

const LibraryPages = {
  Library: {screen: Library},
  LibraryContent: {screen: LibraryContent},
  PlaylistContent: {screen: PlaylistContent},
  Artist: {screen: Artist},
  Album: {screen: Album},
  Playlist: {screen: Playlist},
  Settings: {screen: Settings},
  ViewAll: {screen: ViewAll},
}

const SearchPages = {
  Search: {screen: Search},
  Artist: {screen: Artist},
  Album: {screen: Album},
  ViewAll: {screen: ViewAll},
}

AuthenticationPages = {
  Login: {screen: LoginScreen},
  LinkAccounts: {screen: LinkAccounts},
  Tutorial: {screen: Tutorial},
}


export const AuthenticationStack= createStackNavigator(AuthenticationPages, {initialRouteName: "Login",headerMode: 'none'});
export const BrowseStack= createStackNavigator(BrowsePages, {initialRouteName: "Browse",headerMode: 'none'});
export const LibraryStack = createStackNavigator(LibraryPages, {initialRouteName: "Library",headerMode: 'none'});
export const SearchStack = createStackNavigator(SearchPages, {initialRouteName: "Search",headerMode: 'none'});
