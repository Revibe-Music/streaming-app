import React, {Component} from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Text } from "native-base";
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import Modal from "react-native-modal";

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import { connect } from 'react-redux';

import Logo from './../../components/Logo';
import Wallpaper from './../../components/Wallpaper';
import ButtonSubmit from './../../components/ButtonSubmit';
import SignupSection from './../../components/SignupSection';
import UserInput from './../../components/UserInput';
import ForgotPassword from "./forgotPassword";
import AccountSync from "./../../components/accountSync/index";
import LoginOffline from "./../../components/offlineNotice/loginOffline";
import RevibeAPI from './../../api/Revibe'
import YouTubeAPI from './../../api/Youtube'

import Tutorial from './tutorial'

import { getPlatform } from './../../api/utils';

import { initializePlatforms } from './../../redux/platform/actions'

import eyeImg from './../../../assets/eye_black.png';


class LoginScreen extends Component {

    constructor(props) {
      super(props);
      this.state = {
        press: false,
        registering: true,
        firstName: "Riley",
        lastName: "Stephens",
        username: "rstephens2712",
        email: "riley.stephens2712",
        password: "Reed1rile2",
        syncing: false,
        loading: false,
        success: false,
        error: {},
      };
      this.revibe = new RevibeAPI()
      this.youtube = new YouTubeAPI()
      this.toggleForgotPasswordModal = this.toggleForgotPasswordModal.bind(this);
      this._login = this._login.bind(this);
      this._register = this._register.bind(this);
      this.submitButtonPressed = this.submitButtonPressed.bind(this);
      this.fetchConnectedAccounts = this.fetchConnectedAccounts.bind(this);
      this.syncAccounts = this.syncAccounts.bind(this);
    }

    async fetchConnectedAccounts() {
      var connectedPlatforms = await this.revibe.fetchConnectedPlatforms()
      for(var x=0; x<connectedPlatforms.length; x++) {
        let platform = getPlatform(connectedPlatforms[x].platform)
        platform.saveToken(connectedPlatforms[x])
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

    async submitButtonPressed() {
      if(this.state.registering) {
        await this._register()
      }
      else {
        await this._login()
      }
    }

    async _login() {
      try {
        this.setState({loading: true})
        var response = await this.revibe.login(this.state.username, this.state.password);
        if(response.hasOwnProperty("first_name")) {
          this.setState({ firstName: response.first_name, success: true })
          await this.youtube.login()
          await this.fetchConnectedAccounts()
          await this.props.initializePlatforms()
          this.setState({syncing: true})
          setTimeout(this.syncAccounts, 5000)
        }
        else {
          console.log(response);
          this.setState({error: response})
          this.setState({loading: false})
        }
      }
      catch(error) {
        console.log(error);
      }
    }

    async _register() {
        try {
          this.setState({loading: true})
          var response = await this.revibe.register(this.state.firstName, this.state.lastName, this.state.username, this.state.email, this.state.password)
          if(response.access_token) {
            this.setState({ success: true })
            await this.youtube.login()
            this.props.initializePlatforms()
            this.props.navigation.navigate(
              {
                key: "LinkAccounts",
                routeName: "LinkAccounts",
                params:{name: this.state.firstName}
              }
            )
          }
          else {
            this.setState({error: response})
            this.setState({loading: false})
          }
        }
        catch(error) {
          console.log(error);
        }
    }

    toggleForgotPasswordModal() {
      this.setState({ forgotPasswordModal: !this.state.forgotPasswordModal });
    }

  render() {
    return (
      <>
      <Wallpaper>
        <Logo />
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
          {Object.keys(this.state.error).length > 0 ?
            <Text style={styles.authenticationError}>
              {Object.keys(this.state.error)[0] === "non_field_errors" ? "" : Object.keys(this.state.error)[0] + ": "}{this.state.error[Object.keys(this.state.error)[0]]}
            </Text>
          :
            null
          }
          <View style={{flex: 1, alignItems: "flex-end", justifyContent: "center"}} >
          {this.state.registering ?
            <>
            <View style={{flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",width: wp("91%")}} >
              <UserInput
                placeholder="First Name"
                autoCapitalize={'none'}
                returnKeyType={'done'}
                autoCorrect={false}
                width={wp("40%")}
                onChange={(text) => this.setState({firstName: text})}
              />
              <UserInput
                placeholder="Last Name"
                autoCapitalize={'none'}
                returnKeyType={'done'}
                autoCorrect={false}
                width={wp("40%")}
                onChange={(text) => this.setState({lastName: text})}
              />
            </View>
            <UserInput
              icon="mail"
              placeholder="Email"
              autoCapitalize={'none'}
              returnKeyType={'done'}
              autoCorrect={false}
              width={wp("85%")}
              onChange={(text) => this.setState({email: text})}
            />
            </>
          :
            null
          }
          <UserInput
            icon="user"
            placeholder="Username"
            autoCapitalize={'none'}
            returnKeyType={'done'}
            autoCorrect={false}
            width={wp("85%")}
            onChange={(text) => this.setState({username: text})}
          />
          <UserInput
            icon="lock"
            secureTextEntry={true}
            placeholder="Password"
            returnKeyType={'done'}
            autoCapitalize={'none'}
            autoCorrect={false}
            width={wp("85%")}
            onChange={(text) => this.setState({password: text})}
          />
          </View>

        </KeyboardAvoidingView>

        <ButtonSubmit
          text={this.state.registering ? "SIGNUP" : "LOGIN"}
          onPress={this.submitButtonPressed}
          loading={this.state.loading}
          success={this.state.success}
        />
        <View style={styles.bottomTextContainer}>
          <TouchableOpacity
            onPress={() => this.setState({registering: !this.state.registering})}
          >
            <Text style={styles.text}>{this.state.registering ? "Login To Account" : "Create Account"}</Text>
          </TouchableOpacity>
          <Text style={styles.text}>Forgot Password?</Text>
        </View>

      </Wallpaper>

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
    );
  }
}

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 2,
    alignItems: 'center',
  },

  bottomTextContainer: {
    flex: 1,
    width: DEVICE_WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  text: {
    color: 'white',
    backgroundColor: 'transparent',
  },
  authenticationError: {
    position:"absolute",
    bottom: hp("35%"),
    fontWeight: "bold",
    textAlign: "center",
    color:"red",
    fontSize: hp("2%"),
  },
  accountSyncContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

function mapStateToProps(state) {
  return {
    connected: state.connectionState.connected,
    platforms: state.platformState.platforms,
  }
};

const mapDispatchToProps = dispatch => ({
    initializePlatforms: () => dispatch(initializePlatforms()),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)
