/*
* All accounts that require authentication will be tested to ensure
* the user has signed in before rendering the account tabs and all
* public platform tabs (YouTube) will automatically render
*/
import React, { Component } from "react";
import { TouchableOpacity, View, Text, Alert } from 'react-native'
import { Container, Tabs, Tab, Icon, Header, Left, Body, Right, Button } from "native-base";
import { connect } from 'react-redux';

import { logEvent } from './../../amplitude/amplitude';
import SpotifyAccount from "./../../components/manageAccounts/spotify";

import styles from "./styles";


class Settings extends Component {

  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
  }

 render() {
   return (
     <>
     <Header style={styles.libraryHeader} androidStatusBarColor="#222325" iosBarStyle="light-content">
       <Left>
       <Button
         transparent
         onPress={() => this.props.navigation.goBack()}>
         <Icon name="ios-arrow-back" style={{color:"white"}}/>
       </Button>
       </Left>
       <Body>
       <Text style={styles.pageTitle}> Settings </Text>
       </Body>
       <Right></Right>
     </Header>
     <Container style={styles.container}>
     <View>
      <Text style={styles.settingsTitle}> Manage Accounts </Text>
     </View>
     <SpotifyAccount />
     </Container>
     </>

   );
 }

}

function mapStateToProps(state) {
  return {
    platforms: state.platformState.platforms,
  }
};

export default connect(mapStateToProps)(Settings)
