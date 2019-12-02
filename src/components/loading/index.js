import React, { Component } from 'react';
import { View, Modal } from 'react-native';
import { BarIndicator } from 'react-native-indicators';
import styles from "./styles";

const Loading = props => {
  const {
    loading,
    ...attributes
  } = props;

  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={loading}
      onRequestClose={() => {console.log('close modal')}}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <BarIndicator
          animationDuration={700}
          color='#7248bd'
          count={5}
           />
        </View>
      </View>
    </Modal>
  )
}


export default Loading;
