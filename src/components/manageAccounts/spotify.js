import React, { Component } from "react";
import { View, Image, Alert } from "react-native";
import { Button, Text, Icon } from "native-base";
import { BarIndicator } from 'react-native-indicators';
import { connect } from 'react-redux';

import AnimatedPopover from './../animatedPopover/index';
import SpotifyAPI from './../../api/Spotify';
import { updatePlatformData, removePlatformData } from './../../redux/platform/actions'
import styles from ".//styles";



class SpotifyAccount extends Component {

  constructor(props) {
    super(props);
    this.state = {loading: false};
    this.spotify = new SpotifyAPI();
    this.connectSpotify = this.connectSpotify.bind(this)
    this.disconnectSpotify = this.disconnectSpotify.bind(this)
  }

  async connectSpotify() {
      await this.spotify.login();
      var profile = await this.spotify.getProfile()
      if(profile.product === "premium") {
        this.setState({loading: true})
        var songs = await this.spotify.fetchLibrarySongs()
        for(var x=0; x< songs.length; x++) {
          this.spotify.saveToLibrary(songs[x])
        }
        this.props.updatePlatformData(this.spotify)
        this.setState({loading: false})
      }
      else {
        await this.spotify.logout()
        Alert.alert('Must have a premium Spotify account.')
        //Need to show alert or modal saying that a premium account is required and maybe giving link to sign up for one
      }
  }

  disconnectSpotify() {
      Alert.alert(
        'Are you sure you want to disconnect Spotify?',
        'This will remove all Spotify content from Revibe.',
        [
          {text: "I'm sure", onPress: async () => {
            await this.spotify.logout();
            this.props.removePlatformData("Spotify")
          }},
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
        ],
        {cancelable: true},
      );

  }

  render() {
        return (
          <View style={styles.logoRow}>
            <Icon type="FontAwesome" name={"spotify"} style={styles.logo} />
            {this.state.loading  ?
              <AnimatedPopover type="Loading" show={this.state.loading} />
              :
              <Button
              style={this.spotify.hasLoggedIn() ? styles.disconnectBtn : styles.connectBtn}
              onPress={() => {
                this.spotify.hasLoggedIn() ? this.disconnectSpotify() : this.connectSpotify()
              }}
              >
                 <Text style={styles.accountBtnText}> {this.spotify.hasLoggedIn() ? "Disconnect" : "Connect"} </Text>
             </Button>
            }
          </View>

        )
  }
}

function mapStateToProps(state) {
  return {
    platforms: state.platformState.platforms,
  }
};

const mapDispatchToProps = dispatch => ({
    updatePlatformData: (platform) => dispatch(updatePlatformData(platform)),
    removePlatformData: (platform) => dispatch(removePlatformData(platform)),
});

export default connect(mapStateToProps,mapDispatchToProps)(SpotifyAccount)
