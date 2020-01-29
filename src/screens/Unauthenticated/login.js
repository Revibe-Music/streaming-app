import React, { Component } from "react";
import {
  Container,
  Content,
  Header,
  Left,
  Body,
  Button,
  Form,
  Item,
  Label,
  Input,
  Icon,
  Text,
} from "native-base";
import { View, Image } from "react-native";
import Modal from "react-native-modal";
import ForgotPassword from "./forgotPassword";
import AccountSync from "./../../components/accountSync/index";
import LoginOffline from "./../../components/offlineNotice/loginOffline";
import RevibeAPI from './../../api/Revibe'
import styles from "./styles";
import { connect } from 'react-redux';
import { updatePlatformData, checkPlatformAuthentication } from './../../redux/platform/actions'



class Login extends Component {

  // Dont need to go to link other accounts page after this one, just go to authenticated part

  constructor(props) {
    super(props);
    this.state = {
      forgotPasswordModal: false,
      email: "riley.stephens22@gmail.com",
      password: "Reed1rile2",
      first_name: "Riley",
      syncing: false,
      error: {},
    };
    this.revibe = new RevibeAPI()
    this.toggleForgotPasswordModal = this.toggleForgotPasswordModal.bind(this);
    this.fetchConnectedAccounts = this.fetchConnectedAccounts.bind(this);
    this.syncAccounts = this.syncAccounts.bind(this);
  }

  async fetchConnectedAccounts(token) {
    var connectedPlatforms = await this.revibe.getConnectedPlatforms(token)
    connectedPlatforms = connectedPlatforms.platforms
    for(var x=0; x<connectedPlatforms.length; x++) {
      let platform = new Platform(connectedPlatforms[x].name)
      platform.saveCredentials({accessToken: connectedPlatforms[x].access_token, refreshToken: connectedPlatforms[x].refresh_token})
      await platform.silentLogin({accessToken: connectedPlatforms[x].access_token, refreshToken: connectedPlatforms[x].refresh_token})
      this.props.updatePlatformData(platform)
    }
    this.setState({ syncing: true})
  }

  async syncAccounts() {
    // need to pull all data from accounts that were signed into
    var platformsFetching = []
    var platformNames = Object.keys(this.props.platforms)
    for(var x=0; x<platformNames.length; x++) {
      platformsFetching.push(this.props.platforms[platformNames[x]].fetchLibrarySongs())
    }
    await Promise.all(platformsFetching)
    this.setState({syncing:false})
    this.props.navigation.navigate("Authenticated")
  }

  async _loginButtonPressed () {
    try {
      var token = await this.revibe.login({email: this.state.email, password: this.state.password});
      if(Object.keys(token).filter(x => x==="accessToken").length>0) {
        let youtube = getPlatform("YouTube")
        var user = await this.revibe.getUser(token.accessToken)
        this.setState({ firstName: user.first_name })
        await this.fetchConnectedAccounts(token.accessToken)
        setTimeout(this.syncAccounts, 5000)
      }
      else {
        this.setState({error: token})
      }
    }
    catch(error) {
      console.log(error);
    }

  }


  toggleForgotPasswordModal() {
    this.setState({ forgotPasswordModal: !this.state.forgotPasswordModal });
  }

  // <Divider borderColor="#7248BD" color="#7248BD" orientation="center"borderBottomWidth={5}>OR</Divider>

  render() {
    return (

      <Container style={styles.container}>
        <Content contentContainerStyle={styles.content} scrollEnabled={false}>
          {!this.props.connected ?
          <LoginOffline />
          :
          <>
            <Form style={styles.loginForm}>
            {Object.keys(this.state.error).filter(x => x === "non_field_errors").length>0 ? <Text style={styles.authenticationError}> {this.state.error.non_field_errors} </Text>: null}

              <Item stackedLabel style={{ marginRight: 15}}>
                <Label style={styles.label}>Email</Label>
                <Input autoCapitalize="none" onChangeText={(text) => this.setState({ email:text.toLowerCase() })} style={styles.formInputField}/>
              </Item>
              {Object.keys(this.state.error).filter(x => x === "email").length>0 ? <Text style={styles.authenticationError}> {this.state.error.email} </Text>: null}

              <Item stackedLabel style={{ marginRight: 15}}>
                <Label style={styles.label}>Password</Label>
                <Input secureTextEntry onChangeText={(text) => this.setState({ password: text })} style={styles.formInputField} />
              </Item>
              {Object.keys(this.state.error).filter(x => x === "password").length>0 ? <Text style={styles.authenticationError}> {this.state.error.password} </Text>: null}

            </Form>
            <Button style={styles.signInButton}
            block
            onPress={() => this._loginButtonPressed() }
            >
              <Text style={styles.signInText}>Sign In</Text>
            </Button>

            <Text
            style={styles.label}
            onPress={() => this.props.navigation.navigate("Signup")}
              >
              Not regsitered? Signup here.
            </Text>



            <Modal
            isVisible={this.state.syncing}
            animationIn="fadeIn"
            backdropOpacity={1}
            >
              <View style={styles.accountSyncContainer} >
                <AccountSync
                welcomeText={"Welcome Back " + this.state.firstName}
                syncText="Syncing with your accounts... "
                />
              </View>
            </Modal>

            </>
            }
        </Content>
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

const mapDispatchToProps = dispatch => ({
    updatePlatformData: (platform) => dispatch(updatePlatformData(platform)),
    checkPlatformAuthentication: () => dispatch(checkPlatformAuthentication()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login)
