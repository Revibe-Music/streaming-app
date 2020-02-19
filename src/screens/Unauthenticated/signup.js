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
import { connect } from 'react-redux';
import LoginOffline from "./../../components/offlineNotice/loginOffline";
import RevibeAPI from './../../api/Revibe'
import { initializePlatforms } from './../../redux/platform/actions';

import styles from "./styles";


class Signup extends Component {

  // need to go to link other accounts page after this one

  constructor(props) {
    super(props);
    this.state = {
      firstName: "Riley",
      lastName: "Stephens",
      username: "rstephens28",
      email: "riley.stephens28@gmail.com",
      password1: "Reed1rile2",
      password2: "Reed1rile2",
      error: {},
    };

    this.revibe = new RevibeAPI()
  }

  async _registerButtonPressed() {
    // need to check that passwords match before doing anything
    if(this.state.password1 === this.state.password2) {
      try {
        var response = await this.revibe.register(this.state.firstName, this.state.lastName, this.state.username, this.state.email, this.state.password1)
        if(response.access_token) {
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
                <Label style={styles.label}>Username</Label>
                <Input value={this.state.username} autoCapitalize="none" onChangeText={(text) => this.setState({ username: text })} style={styles.formInputField}/>
              </Item>
              {Object.keys(this.state.error).filter(x => x === "username").length>0 ? <Text style={styles.authenticationError}> {this.state.error.username} </Text>: null}
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
