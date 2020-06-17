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
    this.setState({showPass: !this.state.showPass});
  }

  render() {
    return (
      <View style={styles.inputWrapper}>
        {this.props.icon ? <Icon type="AntDesign" name={this.props.icon} style={styles.inlineImg} /> : null}
        <TextInput
          style={[styles.input, {height: this.props.height, width: this.props.width, paddingLeft: this.props.icon ? 45 : 10}]}
          value={this.props.value + 1}
          onChangeText={this.props.onChange}
          placeholder={this.props.placeholder}
          secureTextEntry={this.state.showPass}
          autoCorrect={this.props.autoCorrect}
          autoCapitalize={this.props.autoCapitalize}
          returnKeyType={this.props.returnKeyType}
          placeholderTextColor="white"
          underlineColorAndroid="transparent"
        />
        {this.props.secureTextEntry ?
            <Icon
              onPress={() => this.setState({showPass: !this.state.showPass})}
              type="Ionicons" name={this.state.showPass ? "md-eye" : "md-eye-off"}
              style={styles.iconEye}
            />
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
  onChange: PropTypes.func,
  heigth: PropTypes.number,
  width: PropTypes.number,
};

UserInput.defaultProps = {
  onChange: () => console.log("Must pass function to onChange prop."),
  height: "100%",
  width: "100%",
};

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'transparent',
    // opacity: .6,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#7248BD",
    color: "white"
  },
  inputWrapper: {
    // flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 15,
    paddingBottom: 15
  },
  inlineImg: {
    zIndex: 20000,
    left: 35,
    fontSize: 25,
    color: "#7248BD"
  },
  iconEye: {
    zIndex: 9999,
    right: 40,
    width: 30,
    height: 25,
    color: "#7248BD",
    tintColor: 'rgba(0,0,0,0.6)',
  },
});
