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
// import ForgotPassword from "./forgotPassword";
import AccountSync from "./../../components/accountSync/index";
import LoginOffline from "./../../components/offlineNotice/loginOffline";
import RevibeAPI from './../../api/Revibe'
import YouTubeAPI from './../../api/Youtube'

import { getPlatform } from './../../api/utils';

import { initializePlatforms } from './../../redux/platform/actions'

import eyeImg from './../../../assets/eye_black.png';


class LoginScreen extends Component {

    constructor(props) {
      super(props);
      this.state = {

        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password1: "",
        password2: "",
        error: {},
        showPass: true,
        press: false,
        syncing: false,
        loading: false,
        loginSuccess: false,
        error: {},

      };
      this.revibe = new RevibeAPI()
      this.youtube = new YouTubeAPI()
      this.toggleForgotPasswordModal = this.toggleForgotPasswordModal.bind(this);
      this._loginButtonPressed = this._loginButtonPressed.bind(this);
      this.fetchConnectedAccounts = this.fetchConnectedAccounts.bind(this);
      this.syncAccounts = this.syncAccounts.bind(this);
      this.showPass = this.showPass.bind(this);
    }

    showPass() {
      this.state.press === false
        ? this.setState({showPass: false, press: true})
        : this.setState({showPass: true, press: false});
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

    async _loginButtonPressed () {
      try {
        this.setState({loading: true})
        var response = await this.revibe.login(this.state.username, this.state.password);
        if(response.hasOwnProperty("first_name")) {
          this.setState({ firstName: response.first_name, loginSuccess: true })
          await this.youtube.login()
          await this.fetchConnectedAccounts()
          await this.props.initializePlatforms()
          this.setState({syncing: true,})
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
          <UserInput
            icon="user"
            placeholder="Username"
            autoCapitalize={'none'}
            returnKeyType={'done'}
            autoCorrect={false}
            onChange={(text) => this.setState({username: text})}
          />
          <UserInput
            icon="lock"
            secureTextEntry={this.state.showPass}
            placeholder="Password"
            returnKeyType={'done'}
            autoCapitalize={'none'}
            autoCorrect={false}
            onChange={(text) => this.setState({password: text})}
          />
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.btnEye}
            onPress={this.showPass}>
            <Image source={eyeImg} style={styles.iconEye} />
          </TouchableOpacity>
        </KeyboardAvoidingView>

        <ButtonSubmit onPress={this._loginButtonPressed} loading={this.state.loading} success={this.state.loginSuccess}/>
        <View style={styles.bottomTextContainer}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Signup")}
          >
            <Text style={styles.text}>Create Account</Text>
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
    flex: 1,
    alignItems: 'center',
  },
  btnEye: {
    position: 'absolute',
    top: 73,
    right: 28,
  },
  iconEye: {
    width: 25,
    height: 25,
    tintColor: 'rgba(0,0,0,0.6)',
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
    bottom: hp("25%"),
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
