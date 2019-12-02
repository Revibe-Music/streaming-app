import React, { Component } from "react";
import { Icon } from "native-base";
import { Text, View } from "react-native";
import styles from "./styles";

class LoginOffline extends Component{

  constructor(props) {
      super(props);
  }

  render() {
      return (
        <>
        <View style={styles.form}>
          <Text style={styles.label}>
            Please check your connection, as the login process requires internet.
          </Text>
        </View>
        <Icon type="MaterialCommunityIcons" name={"wifi-off"} style={styles.noConnectionIcon} />
        </>
      );
  }
}

export default LoginOffline
