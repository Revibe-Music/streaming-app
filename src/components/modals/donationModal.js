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
import { connect } from 'react-redux';
import styles from "./styles";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Modal from "react-native-modal";
import Venmo from './../../../assets/venmo_logo_blue.svg'
import CashApp from './../../../assets/cash_app_logo.svg'


class DonationModal extends Component {

  constructor(props) {
     super(props);

     // var venmoUrl = `venmo://paycharge?txn=pay&recipients=${artist.venmo_username}&amount=${amount}&note="Supporting local artists through Revibe"`
     this.venmoUrl = `venmo://paycharge?txn=pay&recipients=Riley_Stephens&amount=${5}&note="Supporting local artists through Revibe"`
     // var cashAppUrl = `cash.me/$${artist.cashApp_username}/${amount}`

     this.state = {
       displayPaymentMethods: false,
       paymentMethod: null,
       amount: "5",
     }

     this.availablelaymentMethods = ["Venmo", "Cash App"]

     this.selectPaymentMethod = this.selectPaymentMethod.bind(this)
     this.selectAmount = this.selectAmount.bind(this)
     this.close = this.close.bind(this)
  }

  close() {
    this.setState({paymentMethod: null,amount: "5", displayPaymentMethods:false})
    this.props.onClose()
  }


  selectPaymentMethod(paymentMethod) {
    this.setState({paymentMethod: paymentMethod})
  }

  selectAmount(amount) {
    this.setState({amount: amount})
  }


  render() {
    return (
      <Modal
        isVisible={this.props.isVisible}
        hasBackdrop={false}
        deviceWidth={wp("100")}
        swipeDirection={["down", "up"]}
        onSwipeComplete={() => this.close()}
        style={{justifyContent: 'flex-end',margin: 0, padding: 0}}
      >

        <View style={{backgroundColor: 'transparent', height: "100%", width: "100%", alignItems: "center", justifyContent: "center"}}>
          <View style={{backgroundColor: '#202020', height: "40%", width: "70%", borderRadius: 25}}>
            <View style={styles.closeButtonContainer} >
              <Button style={styles.closeButton} transparent onPress={() => this.close()}>
                <Icon transparent={false} name="md-close" style={styles.closeButtonIcon}/>
              </Button>
            </View>
            {!this.state.displayPaymentMethods ?
              <>
              <Text style={styles.filterHeaderText}>Amount</Text>
              <View style={{height: "30%", width: "30%", marginLeft: "5%", marginTop: hp("3")}}>
                <View style={{flexDirection: "column", justifyContent: "center"}}>
                  <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <Button style={[styles.donationAmountButton, this.state.amount == 5 ? {backgroundColor:"#7248BD"} : {}]} onPress={() => this.selectAmount(5)}>
                      <Text style={{color: "white"}}> $5 </Text>
                    </Button>
                    <Button style={[styles.donationAmountButton, this.state.amount == 10 ? {backgroundColor:"#7248BD"} : {}]} onPress={() => this.selectAmount(10)}>
                      <Text style={{color: "white"}}> $10 </Text>
                    </Button>
                    <Button style={[styles.donationAmountButton, this.state.amount == 15 ? {backgroundColor:"#7248BD"} : {}]} onPress={() => this.selectAmount(15)}>
                      <Text style={{color: "white"}}> $15 </Text>
                    </Button>
                  </View>
                </View>
                <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                  <Button style={[styles.donationAmountButton, this.state.amount ==  20? {backgroundColor:"#7248BD"} : {}]} onPress={() => this.selectAmount(20)}>
                    <Text style={{color: "white"}}> $20 </Text>
                  </Button>
                  <Button style={[styles.donationAmountButton, this.state.amount == 25 ? {backgroundColor:"#7248BD"} : {}]} onPress={() => this.selectAmount(25)}>
                    <Text style={{color: "white"}}> $25 </Text>
                  </Button>
                  <Button style={[styles.donationAmountButton, this.state.amount == 30 ? {backgroundColor:"#7248BD"} : {}]} onPress={() => this.selectAmount(30)}>
                    <Text style={{color: "white"}}> $30 </Text>
                  </Button>
                  </View>
                </View>
                <View style={{marginTop: hp("10"),justifyContent: "center", alignItems: "center"}}>
                  <Button
                    style={styles.nextButton}
                    onPress={() => this.setState({displayPaymentMethods:true})}
                  >
                    <Text style={{color: "#7248BD", fontSize: 20}}> Next </Text>
                  </Button>
                </View>
                </>
            :
            <>
            <Text style={styles.filterHeaderText}>Method</Text>
              <View style={{marginTop: hp("4"), alignItems: "center", justifyContent: "center"}}>
                <Button style={styles.paymentButton} onPress={() => Linking.openURL(`venmo://paycharge?txn=pay&recipients=Riley_Stephens&amount=${this.state.amount}&note=Supporting local artists through Revibe`)}>
                  <Venmo width={wp("30")}/>
                </Button>
                </View>
                <View style={{marginTop: hp("4"), alignItems: "center", justifyContent: "center"}}>

                <Button style={styles.paymentButton} onPress={() => Linking.openURL(`https://cash.app/$RileyStephens28/${this.state.amount}/Yeee`)}>
                  <CashApp width={wp("50")} height={100}/>
                </Button>
              </View>
            <View style={{marginTop: hp("5"),justifyContent: "center", alignItems: "center"}}>
              <Button
                style={styles.nextButton}
                onPress={() => this.setState({displayPaymentMethods:false})}
              >
                <Text style={{color: "#7248BD", fontSize: 20}}> Back </Text>
              </Button>
            </View>
              </>
            }
          </View>
        </View>
      </Modal>
    );
  }
}


DonationModal.propTypes = {
  isVisible: PropTypes.bool,
  allowSort: PropTypes.bool,
  onClose: PropTypes.func,
};

DonationModal.defaultProps = {
  isVisible: false,
  allowSort: true,
  onClose: () => console.log("Must pass function to onClose props."),
};

function mapStateToProps(state) {
  return {
    platforms: state.platformState.platforms,
  }
};

export default connect(mapStateToProps)(DonationModal)
