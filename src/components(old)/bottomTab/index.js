import React, { Component } from "react";
import { View, Animated } from "react-native";
import { BottomTabBar } from 'react-navigation-tabs';
import Player from "./../player/index";
import OfflineNotice from './../offlineNotice/index';
import styles from "./styles";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';



export default class BottomTab extends Component {

  constructor(props){
      super(props);
      this.state = {
        offset: new Animated.Value(0), // refers to bottom tab bar visible
        visible: true
      };
  }

  componentWillReceiveProps(props) {
    const newProps = props.navigation.state;

    if(!!newProps.params) {
      this.setState({ visible: newProps.params.visible})
      if (!newProps.params.visible) {
        Animated.timing(this.state.offset, { toValue: -hp("12%"), duration: 200 }).start();
      }
      else if (newProps.params.visible) {
        Animated.timing(this.state.offset, { toValue: 0, duration: 200 }).start();
      }
    }
  }

  render() {
      return (
        <View style={this.state.visible ? {backgroundColor:"#121212"} : {backgroundColor:"#0E0E0E"}}>
          <Player navigation={this.props.navigation}/>
          <BottomTabBar  {...this.props} style={[styles.bottomBar, { bottom: this.state.offset}]}/>
          { this.state.visible ? <OfflineNotice /> : null }
        </View>
      );
  }
};
