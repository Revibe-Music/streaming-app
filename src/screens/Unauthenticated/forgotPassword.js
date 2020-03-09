import React, {Component} from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Button, Text, Icon } from "native-base";
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import Modal from "react-native-modal";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { connect } from 'react-redux';

import Logo from './../../components/Logo';
import Wallpaper from './../../components/Wallpaper';
import ButtonSubmit from './../../components/ButtonSubmit';
import UserInput from './../../components/UserInput';
import LoginOffline from "./../../components/offlineNotice/loginOffline";
import RevibeAPI from './../../api/Revibe'





class ForgotPassword extends Component {

    constructor(props) {
      super(props);
      this.state = {
        username: "",
        email: "",
        loading: false,
        success: false,
        error: false
      };
      this.revibe = new RevibeAPI()
      this.submitButtonPressed = this.submitButtonPressed.bind(this);
    }

    async submitButtonPressed() {
      try {
        this.setState({loading: true})
        var response = await this.revibe.resetPassword(this.state.username);
        this.setState({loading: false})
        if(response.status === 200) {
          this.setState({success: true, error: false})
        }
        else {
          this.setState({error: true})
        }
      }
      catch(error) {
        console.log(error);
      }

    }


  render() {
    return (
      <Wallpaper>
      <Button style={styles.closeButton} transparent onPress={() => this.props.onClose()}>
        <Icon transparent={false} name="md-close" style={styles.closeButtonIcon}/>
      </Button>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={[styles.text, {paddingTop: hp("3")}]}>Enter your username and we will email you instructions on how to reset your password.</Text>

        </View>
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
          {this.state.error ?
            <Text style={styles.authenticationError}>
              Account not found
            </Text>
          :
            null
          }

          <View style={{flex: 1, alignItems: "flex-end", justifyContent: "center", paddingTop: hp("6"), paddingBottom: hp("4")}} >
          <UserInput
            icon="user"
            placeholder="Username"
            autoCapitalize={'none'}
            returnKeyType={'done'}
            autoCorrect={false}
            width={wp("75%")}
            onChange={(text) => this.setState({username: text})}
          />
          </View>

        </KeyboardAvoidingView>
        {this.state.success ?
          <View style={{alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
            <Text style={{color: "green", textAlign: "center", fontSize: hp("2.5%"), marginTop: hp("3%"),fontWeight: 'bold',}}>Email Successfully Sent</Text>
            <Icon type="FontAwesome" name={"check"} style={{color: "green", textAlign: "center", fontSize: hp("3%"), marginTop: hp("3%"),fontWeight: 'bold'}} />
          </View>

        :
          <ButtonSubmit
            text="SUBMIT"
            onPress={this.submitButtonPressed}
            loading={this.state.loading}
          />
        }
      </Wallpaper>
    );
  }
}

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
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
    marginTop: hp("1%"),
    fontWeight: "bold",
    textAlign: "center",
    color:"red",
    fontSize: hp("2%"),
  },
  accountSyncContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeButton: {
    marginTop: hp("6%"),
    marginLeft: wp("3%"),
    fontSize: hp("3")
  },
  closeButtonIcon: {
    color: "white",
    fontSize: hp("3%")
  },
});

function mapStateToProps(state) {
  return {
    connected: state.connectionState.connected,
  }
};

export default connect(mapStateToProps)(ForgotPassword)
