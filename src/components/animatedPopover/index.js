import React, { Component } from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import { BarIndicator } from 'react-native-indicators';
import styles from "./styles";
import * as Animatable from 'react-native-animatable';


class AnimatedPopover extends Component {

  constructor(props) {
    super(props);
    this.state = {
      animationInProgress: false,
      animation: "fadeInUp",
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(!this.state.animationInProgress && prevState.animationInProgress) {
      this.setState({ animation: "fadeInUp" })
    }
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
          speed={1.1}
        />
        </View>
        </View>
      )
    }
    else if(this.props.type==="PlayNext") {
      return (
        <View style={styles.animationWrapper}>
        <View style={{height: "50%", width: "50%", justifyContent: 'center'}}>
        <LottieView
          source={require('./../../../assets/play_next.json')}
          autoPlay
          loop={false}
          speed={10}
        />
        </View>
        </View>
      )
    }
  }

  handleStartAnimation = () => {
    if(this.state.animation === "fadeInUp") {
      this.setState({animationInProgress: true})
    }
  }

  setExitAnimation = () => {
    if(this.state.animation === "fadeInUp") {
      setTimeout(() => this.setState({ animation: "fadeOutDown" }), 500)
      setTimeout(() => this.setState({ animationInProgress: false }), 1000)
    }

  }

  render() {
    if(this.props.show) {
      if(this.props.type==="Loading") {
        return (
          <View style={{position: "absolute", height: "100%", width: "100%", justifyContent: "center", alignItems: "center"}} pointerEvents={'box-none'}>
            <View style={this.props.type!=="Loading" ? styles.animationBackground : null}>
              <BarIndicator
                animationDuration={700}
                color='#7248bd'
                count={5}
              />
            </View>
          </View>
        )
      }
      return (
        <View style={{position: "absolute", height: "100%", width: "100%", justifyContent: "center", alignItems: "center"}} pointerEvents={'box-none'}>
          <Animatable.View
            style={styles.animatedView}
            animation={this.state.animation}
            duration={500}
            onAnimationBegin={this.handleStartAnimation}
            onAnimationEnd={this.setExitAnimation}
          >
          <View style={this.props.type!=="Loading" ? styles.animationBackground : null}>
            {this._renderAnimation()}
            <Text style={styles.text}> {this.props.text} </Text>
          </View>
          </Animatable.View>
        </View>
      );
    }
    return null
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
