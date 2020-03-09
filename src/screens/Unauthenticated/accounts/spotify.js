import React, { Component } from "react";
import { View, Image, Alert} from "react-native";
import { Button, Text, Icon } from "native-base";
import { connect } from 'react-redux';

import styles from "./../styles";
import AnimatedPopover from './../../../components/animatedPopover/index';
import SpotifyAPI from './../../../api/Spotify';
import { updatePlatformData,initializePlatforms } from './../../../redux/platform/actions'


class SpotifyLogin extends Component {

  constructor(props) {
    super(props);
    this.spotify = new SpotifyAPI();

    this.state = {
      hasLoggedIn: this.spotify.hasLoggedIn()
    }
    this.connectSpotify = this.connectSpotify.bind(this)
  }

  async connectSpotify() {
      await this.spotify.login();
      var profile = await this.spotify.getProfile()
      if(profile.product === "premium") {
        this.setState({hasLoggedIn: true})
        this.props.updatePlatformData(this.spotify)
      }
      else {
        await this.spotify.logout()
        Alert.alert(
          'Sorry, you must have a premium Spotify account.',
          '',
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          {cancelable: false},
        );
      }
  }

  render() {
    return (
      <>
      <View style={styles.logoRow}>
        <Icon type="FontAwesome" name={"spotify"} style={styles.logo} />
        {this.state.hasLoggedIn ?
          <Icon type="FontAwesome" name={"check"} style={styles.check} />
        :
          <Button
          style={styles.connectBtn}
          onPress={this.connectSpotify}
          >
          <Text style={styles.accountBtnText}> Connect</Text>
        </Button>
        }
      </View>
      </>
    )
  }
}

// <View>
//   <Button
//     style={styles.spotifyLoginButton}
//     onPress={this.spotifyLoginButtonWasPressed}
//   >
//     <Icon type="FontAwesome" name={"spotify"} style={styles.linkAccountButtonLogo} />
//     <Text style={styles.linkAccountButtonText} >Spotify</Text>
//   </Button>
// </View>


const mapDispatchToProps = dispatch => ({
    initializePlatforms: () => dispatch(initializePlatforms()),
    updatePlatformData: (platform) => dispatch(updatePlatformData(platform)),
});

export default connect(null,mapDispatchToProps)(SpotifyLogin)
