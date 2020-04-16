import React from "react";
import { View, AppState } from "react-native";
import { connect } from 'react-redux';
import SplashScreen from "react-native-splash-screen";
import MusicControl from 'react-native-music-control';
import NetInfo from "@react-native-community/netinfo";
import BackgroundTimer from 'react-native-background-timer';
import DefaultPreference from 'react-native-default-preference';

import { RootNavigator } from './src/navigation/rootNavigation';

import RevibeAPI from './src/api/revibe';
import { logEvent, setUserData } from './src/amplitude/amplitude';
import { connection } from './src/redux/connection/actions';
import { setTopLevelNavigator } from './src/redux/navigation/actions';
import { resumeSong,pauseSong,nextSong,prevSong,seek,setScrubbing,continuousTimeUpdate } from './src/redux/audio/actions';
import { initializePlatforms, checkRevibeAccount, checkPlatformAuthentication } from './src/redux/platform/actions';



class App extends React.Component {

  constructor(props) {
     super(props);
     this.state = {
       appState: AppState.currentState
     }
  };

  _handleAppStateChange = nextAppState => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === "active") {
      logEvent("App", "Enter Foreground")
    }
    else if (this.state.appState === "active" && nextAppState.match(/inactive|background/)) {
      logEvent("App", "Enter Background")
    }
    this.setState({ appState: nextAppState });
  };


  async componentDidMount() {
    await this.props.initializePlatforms();
    var revibe = new RevibeAPI()
    if(revibe.hasLoggedIn()) {
      revibe.fetchEnvVariables()
    }
    NetInfo.addEventListener( state => this.props.connection(state.isConnected && state.isInternetReachable))

    MusicControl.enableBackgroundMode(true);
    MusicControl.handleAudioInterruptions(true);    // on iOS, pause playback during audio interruptions (incoming calls) and resume afterwards.
    MusicControl.enableControl('play', true)
    MusicControl.enableControl('pause', true)
    MusicControl.enableControl('stop', false)
    MusicControl.enableControl('nextTrack', true)
    MusicControl.enableControl('previousTrack', true)
    MusicControl.enableControl('changePlaybackPosition', true)   // Changing track position on lockscreen
    MusicControl.on('play', this.props.resumeSong)
    MusicControl.on('pause', this.props.pauseSong)
    MusicControl.on('nextTrack', this.props.nextSong)
    MusicControl.on('previousTrack', this.props.prevSong)
    MusicControl.on('changePlaybackPosition', (position) => {
      position = parseFloat(position);
      this.props.setScrubbing(true)
      this.props.seek(position);
      this.props.setScrubbing(false)
    })
    SplashScreen.hide();
    DefaultPreference.get('user_id')
      .then(id => setUserData(id));
    logEvent("App", "Launched")
    AppState.addEventListener("change", this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.isPlaying !== this.props.isPlaying) {
      if(nextProps.isPlaying) {
        BackgroundTimer.runBackgroundTimer(this.props.continuousTimeUpdate, 250)
      }
      else {
        BackgroundTimer.stopBackgroundTimer()
      }
      return false
    }
    if(nextState.appState !== this.state.appState) {
      return false
    }
    return true
  }

  componentDidUpdate(prevProps) {
    if(!prevProps.platformsInitialized && this.props.platformsInitialized) {
      this.props.checkRevibeAccount();
      this.props.checkPlatformAuthentication();
    }
  }


  render() {
      if (!this.props.checkedLogin) {
         return null;
      }
      else {
        const Layout = RootNavigator(this.props.hasLoggedIn);
        return (
          <View style={{width: "100%", height:"100%"}}>
              <Layout ref={navigatorRef => setTopLevelNavigator(navigatorRef)}/>
          </View>
        );
      }
  }
}

function mapStateToProps(state) {
  return {
    checkedLogin: state.platformState.checkedLogin,
    hasLoggedIn: state.platformState.hasLoggedIn,
    platformsInitialized: state.platformState.platformsInitialized,
    isPlaying: state.audioState.isPlaying,
  }
};

const mapDispatchToProps = dispatch => ({
    connection: (bool) => dispatch(connection(bool)),
    initializePlatforms: () => dispatch(initializePlatforms()),
    checkRevibeAccount: () => dispatch(checkRevibeAccount()),
    checkPlatformAuthentication: () => dispatch(checkPlatformAuthentication()),
    resumeSong: () => dispatch(resumeSong()),
    pauseSong: () => dispatch(pauseSong()),
    nextSong: () => dispatch(nextSong()),
    prevSong: () => dispatch(prevSong()),
    seek: (time) => dispatch(seek(time)),
    setScrubbing: () => dispatch(setScrubbing()),
    continuousTimeUpdate: () => dispatch(continuousTimeUpdate()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App)
