import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, ImageBackground, Dimensions, StatusBar} from 'react-native';

import bgSrc from '../../assets/wallpaper.png';

export default class Wallpaper extends Component {
  render() {
    return (
      <>
      <StatusBar barStyle="light-content" />
      <ImageBackground style={styles.picture} source={bgSrc}>
        {this.props.children}
      </ImageBackground>
      </>
    );
  }
}

const styles = StyleSheet.create({
  picture: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
    opacity: .9
  },
});
