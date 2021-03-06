import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  Easing,
  Image,
  Alert,
  View,
  Dimensions
} from 'react-native';

import spinner from '../../assets/loading.gif';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const MARGIN = 40;

export default class ButtonSubmit extends Component {
  constructor() {
    super();

    this.buttonAnimated = new Animated.Value(0);
    this.growAnimated = new Animated.Value(0);
    this._onPress = this._onPress.bind(this);
  }

  componentDidUpdate(prevProps) {
    if(!prevProps.loading && this.props.loading) {
      Animated.timing(this.buttonAnimated, {
        toValue: 1,
        duration: 200,
        easing: Easing.linear,
      }).start();
    }
    else if(prevProps.loading && !this.props.loading) {
      this.buttonAnimated.setValue(0);
    }
    // else if(!prevProps.success && this.props.success) {
    //   Animated.timing(this.growAnimated, {
    //     toValue: 1,
    //     duration: 200,
    //     easing: Easing.linear,
    //   }).start();
    // }
  }

  async _onPress() {
    if (this.props.loading) return;


    // setTimeout(() => {
    //   this._onGrow();
    // }, 500);
    await this.props.onPress()
    // if(success) {
    //   this._onGrow();
    // }

    // setTimeout(() => {
    //   // Actions.secondScreen();
    //   this.buttonAnimated.setValue(0);
    //   // this.growAnimated.setValue(0);
    // }, 2300);
  }

  _onGrow() {
    Animated.timing(this.growAnimated, {
      toValue: 1,
      duration: 200,
      easing: Easing.linear,
    }).start();
  }

  render() {
    const changeWidth = this.buttonAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [DEVICE_WIDTH - MARGIN, MARGIN],
    });
    const changeScale = this.growAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [1, MARGIN],
    });

    return (
      <View style={styles.container}>
        <Animated.View style={{width: changeWidth, alignItems: 'center', justifyContent: 'center',}}>
          <TouchableOpacity
            style={[styles.button,  {width: this.props.width, height: this.props.height}]}
            onPress={this._onPress}
            activeOpacity={1}>
            {this.props.loading ? (
              <Image source={spinner} style={styles.image} />
            ) : (
              <Text style={styles.text}>{this.props.text}</Text>
            )}
          </TouchableOpacity>
          <Animated.View
            style={[styles.circle, {transform: [{scale: changeScale}]}]}
          />
        </Animated.View>
      </View>
    );
  }
}

ButtonSubmit.propTypes = {
  text: PropTypes.string,
  onPress: PropTypes.func,
  loading: PropTypes.bool,
  success: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
};

ButtonSubmit.defaultProps = {
  onPress: () => console.log("Must pass function to onPress prop."),
  loading: false,
  success: false,
  width: "100%",
  height: "100%",
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7248BD',
    height: MARGIN,
    borderRadius: 20,
    zIndex: 100,
  },
  circle: {
    height: MARGIN,
    width: MARGIN,
    marginTop: -MARGIN,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 100,
    alignSelf: 'center',
    zIndex: 99,
    backgroundColor: 'black',
  },
  text: {
    color: 'white',
    backgroundColor: 'transparent',
  },
  image: {
    width: 24,
    height: 24,
  },
});
