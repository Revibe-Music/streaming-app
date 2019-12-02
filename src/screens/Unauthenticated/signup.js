import React, { Component } from "react";
import {
  Container,
  Content,
  Button,
  Form,
  Item,
  Label,
  Input,
  Text,
  View
} from "native-base";
import { GoogleSigninButton } from '@react-native-community/google-signin';
import { connect } from 'react-redux';
import LoginOffline from "./../../components/offlineNotice/loginOffline";
import Platform from './../../api/platform'
import { initializePlatforms } from './../../redux/platform/actions';

import styles from "./styles";


class Signup extends Component {

  // need to go to link other accounts page after this one

  constructor(props) {
    super(props);
    this.state = {firstName: "",
                  lastName: "",
                  email: "",
                  password1: "",
                  password2: "",
                  error: {},
                };
    this.revibe = new Platform("Revibe")

  }

  async _registerButtonPressed() {
    // need to check that passwords match before doing anything
    if(this.state.password1 === this.state.password2) {

      let signupParams = {first_name: this.state.firstName,
                          last_name: this.state.lastName,
                          email: this.state.email,
                          password1: this.state.password1,
                          password2: this.state.password2
                          }
      try {
        var token = await this.revibe.api.signup(signupParams)
        if(token.accessToken) {
          this.revibe.updateCredentials(token.accessToken)
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
          this.setState({error: token})
        }
      }
      catch(error) {
        console.log(error);
      }
    }
    else {
      this.setState({error: {password2: "Password does not match."}})
    }

  }

  async _googleSignInPressed() {

    var token = await this.revibe.api.signupWithGoogle();
    var user = await this.revibe.getUser(token.accessToken)
    this.props.navigation.navigate(
      {
        key: "LinkAccounts",
        routeName: "LinkAccounts",
        params:{name: user.first_name}
      }
    )
  }

    render() {
      return (
        <Container style={styles.container}>
          <Content contentContainerStyle={styles.content} scrollEnabled={false}>
          {!this.props.connected ?
          <LoginOffline />
          :
          <>
            <Form style={styles.signupForm}>
              <View style={{flexDirection: "row"}}>
                <Item stackedLabel style={{ marginRight: 15, flex: .5, marginLeft:10}}>
                  <Label style={styles.label}>First Name</Label>
                  <Input value={this.state.firstName} onChangeText={(text) => this.setState({ firstName:text })} style={styles.formInputField}/>
                </Item>
                <Item stackedLabel style={{ marginRight: 15, flex: .5}}>
                  <Label style={styles.label}>Last Name</Label>
                  <Input value={this.state.lastName} onChangeText={(text) => this.setState({ lastName:text })} style={styles.formInputField}/>
                </Item>
              </View>
              <Item stackedLabel style={{ marginRight: 15, lineHeight: 50}}>
                <Label style={styles.label}>Email</Label>
                <Input value={this.state.email} autoCapitalize="none" onChangeText={(text) => this.setState({ email: text.toLowerCase() })} style={styles.formInputField}/>
              </Item>
              {Object.keys(this.state.error).filter(x => x === "email").length>0 ? <Text style={styles.authenticationError}> {this.state.error.email} </Text>: null}
              <Item stackedLabel style={{ marginRight: 15}}>
                <Label style={styles.label}>Password</Label>
                <Input value={this.state.password1} secureTextEntry onChangeText={(text) => this.setState({ password1: text })} style={styles.formInputField}/>
              </Item>
              {Object.keys(this.state.error).filter(x => x === "password1").length>0 ? <Text style={styles.authenticationError}> {this.state.error.password1} </Text>: null}

              <Item stackedLabel style={{ marginRight: 15}}>
                <Label style={styles.label}>Confirm Password</Label>
                <Input value={this.state.password2} secureTextEntry onChangeText={(text) => this.setState({ password2: text })} style={styles.formInputField}/>
              </Item>
              {Object.keys(this.state.error).filter(x => x === "password2").length>0 ? <Text style={styles.authenticationError}> {this.state.error.password2} </Text>: null}

            </Form>

            <Button style={styles.signInButton}
            block
            onPress={() => this._registerButtonPressed()}
            >
              <Text>Register</Text>
            </Button>

            <Text
            style={{textAlign:"center", fontWeight: "bold", color: "white", marginBottom: 10, marginTop: 20}}
            onPress={() => this.props.navigation.navigate("Login")}
            >
              Already a user? Login here.
            </Text>

            </>
          }
          </Content>
        </Container>
      );
    }
  }


function mapStateToProps(state) {
  return {
    connected: state.connectionState.connected
  }
};

const mapDispatchToProps = dispatch => ({
    initializePlatforms: () => dispatch(initializePlatforms()),
});

export default connect(mapStateToProps,mapDispatchToProps)(Signup)

// GOOGLE LOGIN SNIPPET REMOVED FOR LAUNCH

// <View style={styles.dividerContainer}>
//     <View style={styles.divider} />
//     <Text style={styles.dividerText}>OR</Text>
//     <View style={styles.divider}/>
// </View>
//
// <GoogleSigninButton
//   style={styles.googleSignInButton}
//   size={GoogleSigninButton.Size.Wide}
//   color={GoogleSigninButton.Color.Light}
//   onPress={() => this._googleSignInPressed()}
// />
