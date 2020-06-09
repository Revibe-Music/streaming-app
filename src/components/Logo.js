import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View, Text, Image} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import logoImg from '../../assets/RevibeLogo.png';

export default class Logo extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Image source={logoImg} style={styles.image} />
        {/*<Text style={styles.text}>Your Music. Your Way.</Text>*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: hp("5")
  },
  image: {
    width: wp("70"),
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    marginTop: 20,
  },
});
