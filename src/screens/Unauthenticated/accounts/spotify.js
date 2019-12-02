import React, { Component } from "react";
import { View, Image, } from "react-native";
import Loading from "./../../../components/loading";
import { Button, Text, Icon } from "native-base";
import { connect } from 'react-redux';

import styles from "./../styles";
import Platform from './../../../api/platform';
import { updatePlatformData } from './../../../redux/platform/actions'


class SpotifyLogin extends Component {

  constructor(props) {
    super(props);
    this.state = {Loadinging: false};
    this.spotify = new Platform("Spotify");
    this.spotifyLoginButtonWasPressed = this.spotifyLoginButtonWasPressed.bind(this)
  }

  async spotifyLoginButtonWasPressed() {
      var session = await this.spotify.login();
      if(this.spotify.api.hasPremiumAccount()) {
        if (!!session) {
          this.props.updatePlatformData(this.spotify)
        }
      }
      else {
        this.spotify.logout()
        //Need to show alert or modal saying that a premium account is required and maybe giving link to sign up for one
        console.log("Must have a premium spotify account dawgg");
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
