import React, { Component } from 'react';
import { View, Modal, Text } from 'react-native';
import PropTypes from 'prop-types';
import LottieView from 'lottie-react-native';
import { BarIndicator } from 'react-native-indicators';
import styles from "./styles";


class AnimatedPopover extends Component {

  constructor(props) {
    super(props);
  }

  _renderAnimation() {
    if(this.props.type==="Save") {
      return (
        <View style={styles.animationWrapper}>
        <LottieView
        source={require('./../../../assets/save.json')}
        autoPlay
        loop={false}
        speed={1.5}
        />
        </View>

      )
    }
    else if(this.props.type==="Delete") {
      return (
        <View style={styles.animationWrapper}>
        <LottieView
          source={require('./../../../assets/delete.json')}
          autoPlay
          loop={false}
          speed={.8}
        />
        </View>
      )
    }
    else if(this.props.type==="Queue") {
      return (
        <View style={styles.animationWrapper}>
        <View style={{height: "50%", width: "50%", justifyContent: 'center'}}>
        <LottieView
          source={require('./../../../assets/add.json')}
          autoPlay
          loop={false}
          speed={1.5}
        />
        </View>
        </View>
      )
    }
    else {
      return (
        <BarIndicator
          animationDuration={700}
          color='#7248bd'
          count={5}
        />
      )
    }
  }

  render() {
    if(this.props.type==="Loading" && this.props.show) {
      return (
        <View style={{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: 'transparent'}}>
          {this._renderAnimation()}
        </View>
      )
    }
    return (
      <Modal
        transparent={true}
        animationType={'none'}
        visible={this.props.show}
      >
        <View style={styles.container}>
        <View style={styles.animationWrapper}>
          <View style={styles.animationBackground}>
            {this._renderAnimation()}
            <Text style={styles.loadingText}> {this.props.text} </Text>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

AnimatedPopover.propTypes = {
  type: PropTypes.oneOfType(["Save","Delete","Queue","Loading"]),
  show: PropTypes.bool,
  text: PropTypes.string,
};

AnimatedPopover.defaultProps = {
  show: false,
  text: ""
};

export default AnimatedPopover;
