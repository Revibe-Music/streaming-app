import React, { Component } from 'react';
import { View, Modal, Text } from 'react-native';
import LottieView from 'lottie-react-native';

import styles from "./styles";

const Delete = props => {
  const {
    deleting,
    ...attributes
  } = props;

  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={deleting}
    >
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <LottieView
          source={require('./../../../assets/delete.json')}
          autoPlay
          loop={false}
          speed={1.5}
          />
          <Text style={styles.loadingText}> Removing... </Text>
        </View>


      </View>
    </Modal>
  )
}


export default Delete;
