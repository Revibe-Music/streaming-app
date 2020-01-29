import React, { Component } from "react";
import { Container, Content, Text, View, Button } from "native-base";
import Modal from "react-native-modal";
import { connect } from 'react-redux';
import AccountSync from "./../../components/accountSync/index";
import SpotifyLogin from "./accounts/spotify";
import LoginOffline from "./../../components/offlineNotice/loginOffline";
import styles from "./styles";

class LinkAccounts extends Component {

  // need to go to link other accounts page after this one

  constructor(props) {
    super(props);
    this.state = {syncing: false}
    this.syncAccounts = this.syncAccounts.bind(this)
  }

  async syncAccounts() {
    // need to pull all data from accounts that were signed into here

    // this.setState({syncing:true})
    var platformsFetching = []
    var platformNames = Object.keys(this.props.platforms)

    for(var x=0; x<platformNames.length; x++) {
      platformsFetching.push(this.props.platforms[platformNames[x]].fetchLibrarySongs())
    }
    await Promise.all(platformsFetching)
    this.setState({syncing:false})
    this.props.navigation.navigate("Authenticated")
  }

    render() {
      return (
        <Container style={[styles.container]}>
          <Content contentContainerStyle={styles.content} scrollEnabled={false}>
          {!this.props.connected ?
            <LoginOffline />
          :
            <SpotifyLogin />
          }
          </Content>
          <View style={styles.footer}>
            {Object.keys(this.props.platforms).length > 2 ?
              <Button
              style={styles.continueBtn}
              onPress={() => {
                this.setState({syncing:true})
                setTimeout(this.syncAccounts, 5000)
              }}>
                <Text style={styles.continueBtnText} >Continue</Text>
              </Button>
              :
              <Text
              style={styles.skipText}
              onPress={() => {
                this.setState({syncing:true})
                setTimeout(this.syncAccounts, 5000)
              }}
              >
                Skip for now.
              </Text>
            }
          </View>

          <Modal
          isVisible={this.state.syncing}
          animationIn="fadeIn"
          backdropOpacity={1}
          >
          <View style={styles.accountSyncContainer} >
            <AccountSync
            welcomeText={"Welcome " + this.props.navigation.state.params.name}
            syncText="Setting up your Revibe account. This will only take a second..."
            />
          </View>

          </Modal>

        </Container>
      );
    }
  }


function mapStateToProps(state) {
  return {
    connected: state.connectionState.connected,
    platforms: state.platformState.platforms,
  }
};

export default connect(mapStateToProps)(LinkAccounts)
