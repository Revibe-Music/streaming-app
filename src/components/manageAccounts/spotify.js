import React, { Component } from "react";
import { View, Image, Alert } from "react-native";
import { Button, Text, Icon } from "native-base";
import { BarIndicator } from 'react-native-indicators';
import { connect } from 'react-redux';
import CookieManager from 'react-native-cookies';

import AnimatedPopover from './../animatedPopover/index';
import SpotifyAPI from './../../api/spotify';
import { updatePlatformData, removePlatformData,initializePlatforms } from './../../redux/platform/actions'
import { logEvent } from './../../amplitude/amplitude';
import styles from "./styles";



class SpotifyAccount extends Component {

  constructor(props) {
    super(props);
    this.state = {loading: false};
    this.spotify = new SpotifyAPI();
    this.connectSpotify = this.connectSpotify.bind(this)
    this.disconnectSpotify = this.disconnectSpotify.bind(this)
  }

  async connectSpotify() {
      logEvent("External Account", "Clicked", {"Action": "Connect", "Platform": "Spotify"})
      await this.spotify.login();
      var profile = await this.spotify.getProfile()
      if(profile.product === "premium") {
        this.setState({loading: true})
        var songs = await this.spotify.fetchLibrarySongs()
        this.props.initializePlatforms()
        this.setState({loading: false})
        logEvent("External Account", "Success", {"Action": "Connect", "Platform": "Spotify"})
      }
      else {
        await this.spotify.logout()
        logEvent("External Account", "Failed", {"Action": "Connect", "Platform": "Spotify"})
        Alert.alert(
          'Sorry, you must have a premium Spotify account.',
          '',
          [
            {text: 'OK', onPress: () => console.log("Need premium account")},
          ],
          {cancelable: false},
        );
      }
  }

  disconnectSpotify() {
      logEvent("External Account", "Clicked", {"Action": "Disconnect", "Platform": "Spotify"})
      Alert.alert(
        'Are you sure you want to disconnect Spotify?',
        'This will remove all Spotify content from Revibe.',
        [
          {text: "I'm sure", onPress: async () => {
            this.setState({loading: true})
            await this.spotify.logout();
            this.props.initializePlatforms()
            await CookieManager.clearAll(true)
            this.setState({loading: false})
            logEvent("External Account", "Success", {"Action": "Disconnect", "Platform": "Spotify"})
          }},
          {
            text: 'Cancel',
            onPress: () => logEvent("External Account", "Canceled", {"Action": "Disconnect", "Platform": "Spotify"}),
            style: 'cancel',
          },
        ],
        {cancelable: true},
      );
  }

  render() {
        return (
          <>
          <AnimatedPopover type="Loading" show={this.state.loading} />
          <View style={styles.logoRow}>
            <Icon type="FontAwesome" name={"spotify"} style={styles.logo} />
            <Button
            style={this.spotify.hasLoggedIn() ? styles.disconnectBtn : styles.connectBtn}
            onPress={() => {
              this.spotify.hasLoggedIn() ? this.disconnectSpotify() : this.connectSpotify()
            }}
            >
              <Text style={styles.accountBtnText}> {this.spotify.hasLoggedIn() ? "Disconnect" : "Connect"} </Text>
            </Button>
          </View>
          </>
        )
  }
}

function mapStateToProps(state) {
  return {
    platforms: state.platformState.platforms,
  }
};

const mapDispatchToProps = dispatch => ({
    initializePlatforms: () => dispatch(initializePlatforms()),
    updatePlatformData: (platform) => dispatch(updatePlatformData(platform)),
    removePlatformData: (platform) => dispatch(removePlatformData(platform)),
});

export default connect(mapStateToProps,mapDispatchToProps)(SpotifyAccount)
