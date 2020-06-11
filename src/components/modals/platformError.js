/*
* All accounts that require authentication will be tested to ensure
* the user has signed in before rendering the account tabs and all
* public platform tabs (YouTube) will automatically render
*/
import React, { Component } from "react";
import { TouchableOpacity, View, Text, Linking } from 'react-native'
import { Container, Tabs, Tab, Icon, Header, Left, Body, Right, Button, ListItem } from "native-base";
import PropTypes from 'prop-types';
import { CheckBox } from 'react-native-elements'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Modal from "react-native-modal";
import { connect } from 'react-redux';

import styles from "./styles";
import { setError } from './../../redux/platform/actions'
import { goToManageAccount } from './../../redux/navigation/actions'


class PlatformError extends Component {

  constructor(props) {
     super(props);
     this.close = this.close.bind(this)
  }

  close() {
    this.props.setError(null)
  }

  goToManageAccount() {
    this.props.setError(null)
    this.props.goToManageAccount()
  }

  render() {
    return (
      <Modal
        isVisible={this.props.errorMessage !== null}
        hasBackdrop={true}
        deviceWidth={wp("100")}
        swipeDirection={["down", "up"]}
        onSwipeComplete={() => this.close()}
        style={{justifyContent: 'flex-end',margin: 0, padding: 0}}
      >

        <View style={{backgroundColor: 'transparent', height: "100%", width: "100%", alignItems: "center", justifyContent: "center"}}>
          <View style={{backgroundColor: '#202020', height: "45%", width: "70%"}}>
            <View style={{height: "25%", backgroundColor: "red", alignItems: "center", justifyContent: "center", opacity: .8, marginBottom: hp(2)}} >
              <Icon transparent={false} type="AntDesign" name="exclamationcircleo" style={{color: "white", fontSize: hp(5)}}/>
            </View>

            <Text style={{fontSize: hp(3), color: "white", textAlign: "center",fontWeight: "bold", marginBottom: hp(2)}}>Uh Oh</Text>
            <View style={{width: "80%", marginLeft: "10%", alignItems: "center", justifyContent: "center", marginBottom: hp(3)}} >
              <Text style={{fontSize: hp(3), color: "white", textAlign: "center"}}>{this.props.errorMessage}</Text>
            </View>

            <View style={{width: "70%", marginLeft: "15%", flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: hp(3)}} >
              <Button style={{backgroundColor: "red", width: "40%", borderRadius: 20, alignSelf: "center", alignItems: "center", justifyContent: "center"}} transparent onPress={() => this.close()}>
                <Text style={{fontSize: hp(2), color: "white", textAlign: "center", fontWeight: "bold"}}>Close</Text>
              </Button>
              <Button style={{backgroundColor: "green", width: "40%", borderRadius: 20, alignSelf: "center", alignItems: "center", justifyContent: "center"}} transparent onPress={() => this.goToManageAccount()}>
                <Text style={{fontSize: hp(2), color: "white", textAlign: "center", fontWeight: "bold"}}>Login</Text>
              </Button>
            </View>

          </View>
        </View>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {
    errorMessage: state.platformState.error,
  }
};

const mapDispatchToProps = dispatch => ({
    setError: (message) => dispatch(setError(message)),
    goToManageAccount: () => dispatch(goToManageAccount()),
});

export default connect(mapStateToProps, mapDispatchToProps)(PlatformError)
