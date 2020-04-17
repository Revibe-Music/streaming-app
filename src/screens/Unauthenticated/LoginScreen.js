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
import UserInput from './../../components/UserInput';
import ForgotPassword from "./forgotPassword";
import AccountSync from "./../../components/accountSync/index";
import LoginOffline from "./../../components/offlineNotice/loginOffline";
import RevibeAPI from './../../api/revibe'
import YouTubeAPI from './../../api/youtube'
import Tutorial from './tutorial'

import { getPlatform } from './../../api/utils';
import { logEvent, setRegistration, setUserData } from './../../amplitude/amplitude';
import { initializePlatforms } from './../../redux/platform/actions'
import eyeImg from './../../../assets/eye_black.png';


class LoginScreen extends Component {

    constructor(props) {
      super(props);

      this.state = {
        press: false,
        registering: true,
        resettingPassword: false,
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        newPassword1: "",
        newPassword2: "",
        syncing: false,
        loading: false,
        success: false,
        showForgotPasswordModal: false,
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
      this.displayError = this.displayError.bind(this);
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
      platformsFetching.push(this.revibe.fetchAllPlaylistsSongs())
      await Promise.all(platformsFetching)
      this.setState({syncing:false})
      this.props.navigation.navigate("Authenticated")
    }

    async submitButtonPressed() {
      if(this.state.registering) {
        logEvent("Registration", "Submitted")
        await this._register()
      }
      else {
        logEvent("Login", "Submitted")
        await this._login()
      }
    }

    async _login() {
      try {
        this.setState({loading: true})
        var response = await this.revibe.login(this.state.username, this.state.password);
        if(this.state.resettingPassword) {
          if(this.state.newPassword1 !== this.state.newPassword2) {
            this.setState({error: {passwords: "Passwords do not match"}, loading: false})
          }
          else {
            var changePasswordResponse = await this.revibe.changePassword(this.state.password,this.state.newPassword1,this.state.newPassword2);
            // this.setState({ firstName: changePasswordResponse.first_name, success: true })
            this.setState({success: true })
            await this.youtube.login()
            await this.fetchConnectedAccounts()
            await this.props.initializePlatforms()
            this.setState({syncing: true})
            setTimeout(this.syncAccounts, 5000)
            logEvent("Login", "Success")
            setUserData()
          }
        }
        else if(response.force_change_password) {
          this.setState({resettingPassword: true, loading: false})
        }
        else if(response.hasOwnProperty("first_name")) {
          this.setState({ firstName: response.first_name, success: true })
          await this.youtube.login()
          await this.fetchConnectedAccounts()
          await this.props.initializePlatforms()
          this.setState({syncing: true})
          setTimeout(this.syncAccounts, 5000)
          logEvent("Login", "Success")
          setUserData()
        }
        else {
          this.setState({error: response})
          this.setState({loading: false})
          logEvent("Login", "Failed")
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
            logEvent("Registration", "Success")
            setRegistration()
            this.props.navigation.navigate(
              {
                key: "Tutorial",
                routeName: "Tutorial",
              }
            )
          }
          else {
            this.setState({error: response})
            this.setState({loading: false})
            logEvent("Registration", "Failed")
          }
        }
        catch(error) {
          console.log(error);
        }
    }

    toggleForgotPasswordModal() {
      this.setState({ forgotPasswordModal: !this.state.forgotPasswordModal });
    }

    displayFields() {
      if(this.state.resettingPassword) {
        return (
          <>
          <UserInput
            icon="lock"
            secureTextEntry={true}
            placeholder="Password"
            returnKeyType={'done'}
            autoCapitalize={'none'}
            autoCorrect={false}
            width={wp("85%")}
            onChange={(text) => this.setState({newPassword1: text})}
          />
          <UserInput
            icon="lock"
            secureTextEntry={true}
            placeholder="Confirm Password"
            returnKeyType={'done'}
            autoCapitalize={'none'}
            autoCorrect={false}
            width={wp("85%")}
            onChange={(text) => this.setState({newPassword2: text})}
          />
          </>
        )
      }
      else if(this.state.registering) {
        return (
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
        )
      }
      return null
    }

    displayError() {
      var errorKey = Object.keys(this.state.error)[0]
      var error = this.state.error[errorKey]

      // if(errorKey === "profile") {
      //   var errorKey2 = Object.keys(error[errorKey])[0]
      //   error = error[errorKey2]
      // }
      if(Array.isArray(error)) {
        error = error[0]
      }
      if(error.includes("This field")) {
        error = error.replace("This field",errorKey.replace("_", " "))
      }
      if(error.substr(error.length - 1) === "'") {
        error = error.slice(0, -1)
      }
      // console.log(error);
      return error.charAt(0).toUpperCase() + error.slice(1)
    }



  render() {
    return (
      <>
      <Wallpaper>
        <Logo />
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
          {Object.keys(this.state.error).length > 0 ?
            <Text style={styles.authenticationError}>
              {this.displayError()}
            </Text>
          :
            null
          }
          {this.state.resettingPassword ?
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Reset Password</Text>
            </View>
          :
            null
          }
          <View style={{flex: 1, alignItems: "flex-end", justifyContent: "center"}} >
          {this.displayFields()}
          {!this.state.resettingPassword ?
            <>
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
            </>
          :
            null
          }
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
          <TouchableOpacity
            onPress={() => this.setState({showForgotPasswordModal: !this.state.showForgotPasswordModal})}
          >
            <Text style={styles.text}>Forgot Password?</Text>
          </TouchableOpacity>
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

      <Modal
      isVisible={this.state.showForgotPasswordModal}
      backdropOpacity={1}
      style={{ margin: 0 }}
      >
        <ForgotPassword onClose={() => this.setState({showForgotPasswordModal: !this.state.showForgotPasswordModal})}/>
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
  titleContainer: {
    flex: .2,
    marginTop: hp("1%"),
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    fontSize: hp("4%"),
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
