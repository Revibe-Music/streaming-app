import React, { Component } from 'react';
import { View, Modal, Text } from 'react-native';
import LottieView from 'lottie-react-native';

import styles from "./styles";

const AddToQueue = props => {
  const {
    addingToQueue,
    ...attributes
  } = props;

  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={addingToQueue}
    >
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <LottieView
          style={{height:'75%',width:'75%',display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', marginRight:"7.5%"}}
          source={require('./../../../assets/add.json')}
          autoPlay
          loop={false}
          speed={1.5}
          />
          <Text style={styles.loadingText}> Added To Queue... </Text>
        </View>
      </View>
    </Modal>
  )
}

export default AddToQueue;
