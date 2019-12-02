import React from "react";
import { View } from "react-native";
import { StyleProvider } from "native-base";
import SplashScreen from "react-native-splash-screen";
import { Provider, connect } from 'react-redux';
import MusicControl from 'react-native-music-control';
import BackgroundTimer from 'react-native-background-timer';
import NetInfo from "@react-native-community/netinfo";

import { AppContainer } from './src/router';
import variables from "./src/theme/variables/commonColor";
import { initializePlatforms, checkRevibeAccount, checkPlatformAuthentication } from './src/redux/platform/actions';
import { connection } from './src/redux/connection/actions';
import { continuousTimeUpdate,resumeSong,pauseSong,nextSong,prevSong,seek,setScrubbing } from './src/redux/audio/actions';



class App extends React.Component {

  constructor(props) {
   super(props);
   this.state = {showSpotifyLoginPrompt: false}
 };


 async componentDidUpdate(prevProps) {
   if(!prevProps.platformsInitialized && this.props.platformsInitialized) {
     this.props.checkRevibeAccount();
     this.props.checkPlatformAuthentication();
   }
 }

  async componentDidMount() {

    await this.props.initializePlatforms();

    NetInfo.addEventListener( state => this.props.connection(state.isConnected && state.isInternetReachable) )

    BackgroundTimer.runBackgroundTimer(this.props.continuousTimeUpdate, 250)

    MusicControl.enableBackgroundMode(true);
    // on iOS, pause playback during audio interruptions (incoming calls) and resume afterwards.
    // As of {{ INSERT NEXT VERSION HERE}} works for android aswell.
    MusicControl.handleAudioInterruptions(true);

    MusicControl.enableControl('play', true)
    MusicControl.enableControl('pause', true)
    MusicControl.enableControl('stop', false)
    MusicControl.enableControl('nextTrack', true)
    MusicControl.enableControl('previousTrack', true)
    MusicControl.enableControl('changePlaybackPosition', true)   // Changing track position on lockscreen

    MusicControl.on('play', () => {
      console.log("PLAY");
      this.props.resumeSong();
    })
    MusicControl.on('pause', ()=> {
      console.log("PAUSE");
      this.props.pauseSong();
    })
    MusicControl.on('nextTrack', ()=> {
      this.props.nextSong();
    })
    MusicControl.on('previousTrack', ()=> {
      this.props.prevSong();
    })
    MusicControl.on('changePlaybackPosition', (position) => {
      position = parseFloat(position);
      this.props.setScrubbing(true)
      this.props.seek(position);
      this.props.setScrubbing(false)
   })
    SplashScreen.hide();
  }

  render() {
      if (!this.props.checkedLogin) {
         return null;
      }
      else {
        const Layout = AppContainer(this.props.hasLoggedIn);
        return (
          <View style={{width: "100%", height:"100%"}}>
              <Layout />
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
  }
};

const mapDispatchToProps = dispatch => ({
    connection: (bool) => dispatch(connection(bool)),
    initializePlatforms: () => dispatch(initializePlatforms()),
    checkRevibeAccount: () => dispatch(checkRevibeAccount()),
    checkPlatformAuthentication: () => dispatch(checkPlatformAuthentication()),
    continuousTimeUpdate: () => dispatch(continuousTimeUpdate()),
    resumeSong: () => dispatch(resumeSong()),
    pauseSong: () => dispatch(pauseSong()),
    nextSong: () => dispatch(nextSong()),
    prevSong: () => dispatch(prevSong()),
    seek: (time) => dispatch(seek(time)),
    setScrubbing: () => dispatch(setScrubbing()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App)
