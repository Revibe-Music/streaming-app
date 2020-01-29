import React from "react";
import { View } from "react-native";
import { connect } from 'react-redux';
import SplashScreen from "react-native-splash-screen";
import MusicControl from 'react-native-music-control';
import NetInfo from "@react-native-community/netinfo";

import { AppContainer } from './src/router';
import { connection } from './src/redux/connection/actions';
import { resumeSong,pauseSong,nextSong,prevSong,seek,setScrubbing } from './src/redux/audio/actions';
import { initializePlatforms, checkRevibeAccount, checkPlatformAuthentication } from './src/redux/platform/actions';


class App extends React.Component {

    constructor(props) {
     super(props);
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

    MusicControl.enableBackgroundMode(true);
    MusicControl.handleAudioInterruptions(true);    // on iOS, pause playback during audio interruptions (incoming calls) and resume afterwards.
    MusicControl.enableControl('play', true)
    MusicControl.enableControl('pause', true)
    MusicControl.enableControl('stop', false)
    MusicControl.enableControl('nextTrack', true)
    MusicControl.enableControl('previousTrack', true)
    MusicControl.enableControl('changePlaybackPosition', true)   // Changing track position on lockscreen

    MusicControl.on('play', () => {
      this.props.resumeSong();
    })
    MusicControl.on('pause', ()=> {
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
    resumeSong: () => dispatch(resumeSong()),
    pauseSong: () => dispatch(pauseSong()),
    nextSong: () => dispatch(nextSong()),
    prevSong: () => dispatch(prevSong()),
    seek: (time) => dispatch(seek(time)),
    setScrubbing: () => dispatch(setScrubbing()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App)
