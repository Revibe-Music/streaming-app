import React, { Component } from "react";
import { Platform, TouchableNativeFeedback, TouchableOpacity } from "react-native";



export default class TouchableNativeFeed extends Component {

    constructor(props) {
        super(props);
        this.state = {
          disable: this.props.disabled,
        };
      }

      componentDidUpdate = () => {
          if (this.state.disable) {
            this.setState({
                disable: false
            });
          }
      }

    pressed = () => {
        this.setState({
            disable: true
        });

        this.props.onPress();
    }
  render() {
    const {
        background,
        delayPressIn,
        useForeground,
        onPress,
        ...attributes
      } = this.props;
      if (Platform.OS === "ios"){
          return (
            <TouchableOpacity
            // onPressOut={this.disable}
            underlayColor={"transparent"}
            onPress={this.pressed.bind(this)}
            disabled={this.state.disable}
            {...attributes}>
                {this.props.children}
            </TouchableOpacity>
          );
      } else {
        return (
            <TouchableNativeFeedback
            background={background}
            delayPressIn={delayPressIn}
            useForeground={useForeground}
            underlayColor={"transparent"}
            disabled={this.state.disable}
            onPress={this.pressed.bind(this)}
            {...attributes}
            >
                {this.props.children}
            </TouchableNativeFeedback>
          );
      }
  }
}
