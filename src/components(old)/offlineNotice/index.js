import React, { Component } from "react";
import { connect } from 'react-redux';
import { Text, View } from "react-native";
import styles from "./styles";

class OfflineNotice extends Component{

  constructor(props) {
      super(props);
  }

  render() {
    if(!this.props.connected) {
      return (
        <View style={styles.bottomTabContainer}>
          <Text style={styles.bottomTabText}>Connecting...</Text>
        </View>
      );
    }
    return null;
  }
}

function mapStateToProps(state) {
  return {
    connected: state.connectionState.connected
  }
};

export default connect(mapStateToProps)(OfflineNotice)
