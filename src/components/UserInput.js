import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View, TextInput, Image, Dimensions, TouchableOpacity} from 'react-native';
import { Icon } from "native-base";

import eyeImg from './../../assets/eye_black.png';

export default class UserInput extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showPass: this.props.secureTextEntry,
    };

    this.showPass = this.showPass.bind(this);
  }

  showPass() {
    console.log("UPOO");
    this.setState({showPass: !this.state.showPass});
  }

  render() {
    return (
      <View style={styles.inputWrapper}>
        {this.props.icon ? <Icon type="AntDesign" name={this.props.icon} style={styles.inlineImg} /> : null}
        <TextInput
          style={[styles.input, {width: this.props.width, paddingLeft: this.props.icon ? 45 : 10}]}
          onChangeText={this.props.onChange}
          placeholder={this.props.placeholder}
          secureTextEntry={this.state.showPass}
          autoCorrect={this.props.autoCorrect}
          autoCapitalize={this.props.autoCapitalize}
          returnKeyType={this.props.returnKeyType}
          placeholderTextColor="black"
          textColor="black"
          underlineColorAndroid="transparent"
        />
        {this.props.secureTextEntry ?
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={this.showPass}>
            {this.state.showPass ?
              <Icon type="Ionicons" name="md-eye" style={styles.iconEye} />
            :
              <Icon type="Ionicons" name="md-eye-off" style={styles.iconEye} />
            }
          </TouchableOpacity>
        :
          <View style={styles.iconEye} />
        }
      </View>
    );
  }
}

UserInput.propTypes = {
  icon: PropTypes.number.isRequired,
  placeholder: PropTypes.string.isRequired,
  secureTextEntry: PropTypes.bool,
  autoCorrect: PropTypes.bool,
  autoCapitalize: PropTypes.string,
  returnKeyType: PropTypes.string,
  onChange: PropTypes.func
};

UserInput.defaultProps = {
  onChange: () => console.log("Must pass function to onChange prop."),
};

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'rgb(255, 255, 255)',
    opacity: .6,
    height: 40,
    borderRadius: 20,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  inlineImg: {
    zIndex: 99,
    left: 35,
    fontSize: 25
  },
  iconEye: {
    zIndex: 99,
    right: 40,
    width: 25,
    height: 25,
    tintColor: 'rgba(0,0,0,0.6)',
  },
});
