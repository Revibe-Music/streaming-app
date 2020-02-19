import React, { Component } from 'react';
import { View, Modal, Text } from 'react-native';
import LottieView from 'lottie-react-native';

import styles from "./styles";

const Save = props => {
  const {
    saving,
    ...attributes
  } = props;

  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={saving}
    >
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <LottieView
          source={require('./../../../assets/save.json')}
          autoPlay
          loop={false}
          speed={1.5}
          />
          <Text style={styles.loadingText}> Saving... </Text>
        </View>
      </View>
    </Modal>
  )
}


export default Save;
