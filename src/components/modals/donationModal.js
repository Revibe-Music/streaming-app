/*
* All accounts that require authentication will be tested to ensure
* the user has signed in before rendering the account tabs and all
* public platform tabs (YouTube) will automatically render
*/
import React, { Component } from "react";
import { TouchableOpacity, View, Text } from 'react-native'
import { Container, Tabs, Tab, Icon, Header, Left, Body, Right, Button, ListItem } from "native-base";
import PropTypes from 'prop-types';
import { CheckBox } from 'react-native-elements'
import { connect } from 'react-redux';
import styles from "./styles";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Modal from "react-native-modal";


class DonationModal extends Component {

  constructor(props) {
     super(props);

     var venmoUrl = `venmo://paycharge?txn=pay&recipients=${artist.venmo_username}&amount=${amount}&note="Supporting local artists through Revibe"`
     var cashAppUrl = ` cash.me/$${artist.cashApp_username}/${amount}`
     this.state = {
       // platforms: ["Revibe", "YouTube", "Spotify"],
       platforms: Object.keys(this.props.platforms),
       sortBy: "dateSaved"
     }

     this.selectPlatform = this.selectPlatform.bind(this)
     this.selectSortBy = this.selectSortBy.bind(this)
  }

  selectPlatform(platform) {
    if(this.state.platforms.filter(x => x===platform).length > 0) {
      var updatedPlatforms = this.state.platforms.filter(x => x!==platform)
    }
    else {
      var updatedPlatforms = [...this.state.platforms, platform]
    }
    this.setState({platforms: updatedPlatforms})
    this.props.onPlatformChange(updatedPlatforms)
  }

  selectSortBy(method) {
    this.setState({sortBy: method})
    this.props.onSortByChange(method)
  }


  render() {
    return (
      <Modal
        isVisible={this.props.isVisible}
        hasBackdrop={false}
        deviceWidth={wp("100")}
        style={{justifyContent: 'flex-end',margin: 0, padding: 0}}
        >
        <View style={{backgroundColor: '#202020', height: "65%", width: "100%", borderRadius: 25}}>
          <View style={{flexDirection: "column", marginLeft: wp("3%")}}>
          <View style={{width: wp("40%"), marginTop: hp("3%")}}>
            <Text style={styles.filterHeaderText}>Platforms</Text>
            {Object.keys(this.props.platforms).map(platform => (
              <View style={[styles.filterListItem, {marginTop: hp("2%")}]}>
                <TouchableOpacity onPress={() => this.selectPlatform(platform)}>
                  <View style={{flexDirection: "row"}}>
                    <CheckBox
                      checked={this.state.platforms.filter(x => x===platform).length > 0}
                      onPress={() => this.selectPlatform(platform)}
                      checkedIcon='dot-circle-o'
                      uncheckedIcon='circle-o'
                      checkedColor="#7248BD"
                      style={styles.filterCheckbox}
                    />
                    <View style={styles.textContainer}>
                     <View>
                       <Text style={styles.filterOptionText}>{platform}</Text>
                     </View>
                   </View>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
            </View>
            {this.props.allowSort ?
              <View style={{width: wp("40%"), marginTop: hp("4%")}}>
                <Text style={styles.filterHeaderText}>Sort By</Text>
                <View style={[styles.filterListItem, {marginTop: hp("2%")}]}>
                  <TouchableOpacity onPress={() => this.selectSortBy("dateSaved")}>
                    <View style={{flexDirection: "row"}}>
                      <CheckBox
                        checked={this.state.sortBy==="dateSaved"}
                        onPress={() => this.selectSortBy("dateSaved")}
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        checkedColor="#7248BD"
                        style={styles.filterCheckbox}
                      />
                      <View style={styles.textContainer}>
                       <View>
                         <Text style={styles.filterOptionText}>Date Saved</Text>
                       </View>
                     </View>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={[styles.filterListItem, {marginTop: hp("2%")}]}>
                  <TouchableOpacity onPress={() => this.selectSortBy("alphabetically")}>
                    <View style={{flexDirection: "row"}}>
                      <CheckBox
                        checked={this.state.sortBy==="alphabetically"}
                        onPress={() => this.selectSortBy("alphabetically")}
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        checkedColor="#7248BD"
                        style={styles.filterCheckbox}
                      />
                      <View style={styles.textContainer}>
                       <View>
                         <Text style={styles.filterOptionText}>A-Z</Text>
                       </View>
                     </View>
                    </View>
                  </TouchableOpacity>
                </View>
                </View>
            :
              null
            }
          </View>
          <Button style={styles.filterCancelButton}
          block
          onPress={() => this.props.onClose() }
          >
            <Text style={styles.filterCancelText}>Close</Text>
          </Button>
        </View>
      </Modal>
    );
  }
}


DonationModal.propTypes = {
  isVisible: PropTypes.bool,
  allowSort: PropTypes.bool,
  onClose: PropTypes.func,
  onSortByChange: PropTypes.func,
  onPlatformChange: PropTypes.func,
};

DonationModal.defaultProps = {
  isVisible: false,
  allowSort: true,
  onClose: () => console.log("Must pass function to onClose props."),
  onSortByChange: () => console.log("Must pass function to onSortByChange props."),
  onPlatformChange: () => console.log("Must pass function to onPlatformChange props."),
};

function mapStateToProps(state) {
  return {
    platforms: state.platformState.platforms,
  }
};

export default connect(mapStateToProps)(DonationModal)
