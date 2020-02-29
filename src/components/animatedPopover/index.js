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
        <LottieView
        style={{height:'75%',width:'75%',display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight:"7.5%"}}
        source={require('./../../../assets/save.json')}
        autoPlay
        loop={false}
        speed={1.5}
        />
      )
    }
    else if(this.props.type==="Delete") {
      return (
        <LottieView
          style={{height:'75%',width:'75%',display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight:"7.5%"}}
          source={require('./../../../assets/delete.json')}
          autoPlay
          loop={false}
          speed={1.5}
        />
      )
    }
    else if(this.props.type==="Queue") {
      return (
        <LottieView
          style={{height:'75%',width:'75%',display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', marginRight:"7.5%"}}
          source={require('./../../../assets/add.json')}
          autoPlay
          loop={false}
          speed={1.5}
        />
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
    return (
      <Modal
        transparent={true}
        animationType={'none'}
        visible={this.props.show}
      >
        <View style={styles.container}>
        <View style={styles.animationWrapper}>
          <View style={this.props.type==="Loading" ? null : styles.animationBackground}>
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
