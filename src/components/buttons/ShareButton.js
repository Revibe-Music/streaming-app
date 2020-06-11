import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity} from 'react-native';
import { Text, View, Button, Icon} from "native-base";
import { BlurView } from "@react-native-community/blur";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { showShareSheet } from './../../navigation/branch'


export class ShareButton extends Component {

  constructor(props) {
     super(props);
  }

  componentDidMount() {
  }

  onPress = async () => {
    await showShareSheet(this.props.branchUniversalObject)
  }

  render() {
    return (

      <TouchableOpacity
        style={styles.container}
        onPress={this.onPress}
      >
      {this.props.showBackgrouond ?
        <BlurView
          style={styles.button}
          blurType="light"
          blurAmount={20}
        >
        <Icon type="Ionicons" name="md-paper-plane" style={[styles.icon, {position: "absolute"}]}/>
        </BlurView>
      :
        <Icon type="Ionicons" name="md-paper-plane" style={styles.icon}/>
      }
      </TouchableOpacity>
    );
  }
}

ShareButton.propTypes = {
  branchUniversalObject: PropTypes.object,
  showBackgrouond: PropTypes.bool
};

ShareButton.defaultProps = {
  showBackgrouond: false
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
   button: {
     padding: hp(2.8),
     justifyContent: 'center',
     alignItems: 'center',
     borderRadius: hp(2.8)
  },
  icon: {
    color:"white",
    fontSize: hp(3.5),
    textAlign: "left",
  },
});

export default ShareButton
