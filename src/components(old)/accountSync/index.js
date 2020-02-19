import React, { Component } from "react";
import { Container, Content, Text, View } from "native-base";
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';

import styles from "./styles";


class AccountSync extends Component {

  render() {
    return (
      <>
        <Animatable.Text
        ref={ref => (this.welcomeBack = ref)}
        style={styles.welcomeText}
        iterationCount={2}
        direction="alternate"
        animation="fadeInUp"
        iterationDelay={1000}
        >
          {this.props.welcomeText}
        </Animatable.Text>

        <Animatable.View
        ref={ref => (this.welcomeBack = ref)}
        style={styles.animatedView}
        animation="fadeInDown"
        delay={3500}
        >
        <View>
        <Text style={styles.syncingText}> {this.props.syncText} </Text>
        </View>
        <LottieView
        style={styles.loading}
        source={require('./../../../assets/syncing.json')}
        autoPlay
        loop />
        </Animatable.View>
      </>
    );
  }
}

export default AccountSync;
