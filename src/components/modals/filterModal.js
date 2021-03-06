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


class FilterModal extends Component {

  constructor(props) {
     super(props);

     this.state = {
       platforms: Object.keys(this.props.platforms),
       displayKeys: {"dateSaved": "Date Saved", "alphabetically": "A-Z", "dateCreated": "Date Created"},
       sortBy: this.props.sortOptions[0]
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
    var height = 20
    if(this.props.displayPlatforms) {
      height += 30
    }
    if(this.props.allowSort) {
      height += 15
    }

    height = height + "%"
    return (
      <Modal
        isVisible={this.props.isVisible}
        hasBackdrop={false}
        deviceWidth={wp("100")}
        style={{justifyContent: 'flex-end',margin: 0, padding: 0}}
        >
        <View style={{backgroundColor: '#202020', height: height, width: "100%", borderRadius: 25}}>
          <View style={{flexDirection: "column", marginLeft: wp("3%")}}>
          {this.props.displayPlatforms ?
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
            :
              null
            }
            {this.props.allowSort ?
              <View style={{width: wp("40%"), marginTop: hp("4%")}}>
                <Text style={styles.filterHeaderText}>Sort By</Text>
                {this.props.sortOptions.map(option => (
                  <View style={[styles.filterListItem, {marginTop: hp("2%")}]}>
                    <TouchableOpacity onPress={() => this.selectSortBy(option)}>
                      <View style={{flexDirection: "row"}}>
                        <CheckBox
                          checked={this.state.sortBy===option}
                          onPress={() => this.selectSortBy(option)}
                          checkedIcon='dot-circle-o'
                          uncheckedIcon='circle-o'
                          checkedColor="#7248BD"
                          style={styles.filterCheckbox}
                        />
                        <View style={styles.textContainer}>
                         <View>
                           <Text style={styles.filterOptionText}>{this.state.displayKeys[option]}</Text>
                         </View>
                       </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                ))}
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


FilterModal.propTypes = {
  isVisible: PropTypes.bool,
  allowSort: PropTypes.bool,
  displayPlatforms: PropTypes.bool,
  onClose: PropTypes.func,
  sortOptions: PropTypes.array,
  onSortByChange: PropTypes.func,
  onPlatformChange: PropTypes.func,
};

FilterModal.defaultProps = {
  isVisible: false,
  allowSort: true,
  displayPlatforms: true,
  sortOptions: ["dateSaved", "alphabetically"],
  onClose: () => console.log("Must pass function to onClose props."),
  onSortByChange: () => console.log("Must pass function to onSortByChange props."),
  onPlatformChange: () => console.log("Must pass function to onPlatformChange props."),
};

function mapStateToProps(state) {
  return {
    platforms: state.platformState.platforms,
  }
};

export default connect(mapStateToProps)(FilterModal)
