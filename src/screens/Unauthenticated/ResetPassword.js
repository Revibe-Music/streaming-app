import React, {Component} from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  View,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Linking
} from 'react-native';
import { Text, CheckBox, Icon } from "native-base";
import PropTypes from 'prop-types';
import Modal from "react-native-modal";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { connect } from 'react-redux';

import Logo from './../../components/Logo';
import ButtonSubmit from './../../components/ButtonSubmit';
import UserInput from './../../components/UserInput';
import ForgotPassword from "./forgotPassword";
import AccountSync from "./../../components/accountSync/index";
import LoginOffline from "./../../components/offlineNotice/loginOffline";
import RevibeAPI from './../../api/revibe'
import YouTubeAPI from './../../api/youtube'

import { getPlatform } from './../../api/utils';
import { logEvent, setRegistration, setUserData } from './../../amplitude/amplitude';
import { initializePlatforms } from './../../redux/platform/actions'


class ResetPassword extends Component {

    constructor(props) {
      super(props);
      this.state = {
        firstName: "",
        newPassword1: "",
        newPassword2: "",
        syncing: false,
        loading: false,
        success: false,
        error: {},
      };

      this.revibe = new RevibeAPI()
      this.youtube = new YouTubeAPI()
      this.changePassword = this.changePassword.bind(this);
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
      logEvent("Reset Password", "Submitted")
      await this.changePassword()
    }

    async changePassword() {
      try {
        if(this.state.newPassword1 !== this.state.newPassword2) {
          this.setState({error: {passwords: "Passwords do not match"}, loading: false})
          logEvent("Reset Password", "Failure")
        }
        else {
          this.setState({loading: true})
          var changePasswordResponse = await this.revibe.changePassword(this.props.navigation.state.params.password,this.state.newPassword1,this.state.newPassword2);
          this.setState({success: true })
          await this.youtube.login()
          await this.fetchConnectedAccounts()
          await this.props.initializePlatforms()
          this.setState({syncing: true})
          setTimeout(this.syncAccounts, 5000)
          logEvent("Reset Password", "Success")
          setUserData()
        }
      }
      catch(error) {
        console.log(error);
      }
    }

    displayError() {
      var errorKey = Object.keys(this.state.error)[0]
      var error = this.state.error[errorKey]
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
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{flex: 1, backgroundColor:'#0E0E0E', alignItems: "center", justifyContent: "center"}}>
        <Logo />
        <Text style={[styles.title, {marginTop: hp(7), marginBottom: hp(2), marginLeft: wp(8), alignSelf: "flex-start"}]}>Reset Password</Text>
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
          {Object.keys(this.state.error).length > 0 ?
            (<Text style={styles.authenticationError}>
              {this.displayError()}
            </Text>) : null }

            <View style={styles.titleContainer}>
              <Text style={styles.title}>Reset Password</Text>
            </View>

          <View style={{marginBottom: hp(10), alignItems: "center"}}>
            <UserInput
              icon="lock"
              secureTextEntry={true}
              placeholder="Password"
              returnKeyType={'done'}
              autoCapitalize={'none'}
              autoCorrect={false}
              width={wp("85%")}
              height={hp(7)}
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
              height={hp(7)}
              onChange={(text) => this.setState({newPassword2: text})}
            />
        </View>
        <View style={{alignItems: "center", justifyContent: "space-between", height: hp(30)}}>
          <ButtonSubmit
            text="Reset & Sign In"
            width={wp(75)}
            height={hp(5)}
            onPress={this.submitButtonPressed}
            loading={this.state.loading}
            success={this.state.success}
          />

          <View style={styles.bottomTextContainer}>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
            >
              <Text style={[styles.text, {fontWeight: 'bold'}]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
        </KeyboardAvoidingView>
      </SafeAreaView>

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

  bottomTextContainer: {
    // flex: 1,
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
    fontSize: hp("3.5%"),
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

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword)
