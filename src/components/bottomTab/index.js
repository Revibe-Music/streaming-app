import React, { Component } from "react";
import { View, Animated } from "react-native";
import { BottomTabBar } from 'react-navigation-tabs';
import Player from "./../player/index";
import OfflineNotice from './../offlineNotice/index';
import styles from "./styles";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import { setPage } from './../../redux/navigation/actions'


class BottomTab extends Component {

  constructor(props){
      super(props);
      this.state = {
        offset: new Animated.Value(0), // refers to bottom tab bar visible
        visible: true
      };
  }

  getNavigationTab(nav){
    if(Array.isArray(nav.routes) && nav.routes.length>0){
      if(nav.routeName === "Browse" || nav.routeName === "Search" || nav.routeName === "Library" ) {
        return nav.routeName
      }
      return this.getNavigationTab(nav.routes[nav.index])
    }
  }

  componentDidUpdate(prevProps) {
    if(this.getNavigationTab(prevProps.navigation.state) !== this.getNavigationTab(this.props.navigation.state)) {
      this.props.setPage()
    }
    if(prevProps.navigation.state.params) {
      if(this.props.navigation.state.params) {
        if(prevProps.navigation.state.params.visible !== this.props.navigation.state.params.visible) {
          this.setState({ visible: this.props.navigation.state.params.visible})
          if (!this.props.navigation.state.params.visible) {
            Animated.timing(this.state.offset, { toValue: -hp("12%"), duration: 200 }).start();
          }
          else if (this.props.navigation.state.params.visible) {
            Animated.timing(this.state.offset, { toValue: 0, duration: 200 }).start();
          }
        }
      }
    }
    else {
      if(this.props.navigation.state.params) {
        this.setState({ visible: this.props.navigation.state.params.visible})
        if (!this.props.navigation.state.params.visible) {
          Animated.timing(this.state.offset, { toValue: -hp("12%"), duration: 200 }).start();
        }
        else if (this.props.navigation.state.params.visible) {
          Animated.timing(this.state.offset, { toValue: 0, duration: 200 }).start();
        }
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


function mapStateToProps(state) {
  return {
    currentTab: state.navigationState.currentTab,
  }
};

const mapDispatchToProps = dispatch => ({
    setPage: () => dispatch(setPage()),
});

export default connect(mapStateToProps, mapDispatchToProps)(BottomTab)
