import React, { Component } from "react";
import { View, Image, Alert} from "react-native";
import { Button, Text, Icon } from "native-base";
import { connect } from 'react-redux';

import styles from "./../styles";
import SpotifyAPI from './../../../api/Spotify';
import { updatePlatformData } from './../../../redux/platform/actions'


class SpotifyLogin extends Component {

  constructor(props) {
    super(props);
    this.state = {Loadinging: false};
    this.spotify = new SpotifyAPI();
    this.spotifyLoginButtonWasPressed = this.spotifyLoginButtonWasPressed.bind(this)
  }

  async spotifyLoginButtonWasPressed() {
      await this.spotify.login();
      var profile = await this.spotify.getProfile()
      if(profile.product === "premium") {
        this.props.updatePlatformData(this.spotify)
      }
      else {
        this.spotify.logout()
        //Need to show alert or modal saying that a premium account is required and maybe giving link to sign up for one
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
    if(!!this.spotify) {
      if(this.spotify.hasLoggedIn()) {
        return (
            <View style={styles.logoRow}>
              <Icon type="FontAwesome" name={"spotify"} style={styles.logo} />
              <Icon type="FontAwesome" name={"check"} style={styles.check} />
            </View>
        )
      }
    }
    return (
      <View>
        <Button
          style={styles.spotifyLoginButton}
          onPress={this.spotifyLoginButtonWasPressed}
        >
          <Icon type="FontAwesome" name={"spotify"} style={styles.linkAccountButtonLogo} />
          <Text style={styles.linkAccountButtonText} >Spotify</Text>
        </Button>
      </View>
    )
  }
}


const mapDispatchToProps = dispatch => ({
    updatePlatformData: (platform) => dispatch(updatePlatformData(platform)),
});

export default connect(null,mapDispatchToProps)(SpotifyLogin)
