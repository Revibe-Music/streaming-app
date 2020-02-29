import React from "react";
import { StyleSheet } from "react-native";
import { Block, Text, theme } from "galio-framework";
import { Icon } from "native-base";

class DrawerItem extends React.Component {

  renderIcon = () => {
    const { title, focused } = this.props;

    switch (title) {
      case "Home":
        return (
          <Icon
            type="Ionicons"
            size={50}
            name="md-home"
            style={{color: focused ? "white" : "#7248BD", fontSize: 20}}
          />
        );
      case "Manage Accounts":
        return (
          <Icon
            type="Ionicons"
            size={10}
            name="md-people"
            style={{color: focused ? "white" : "#7248BD", fontSize: 20}}
          />
        );
      default:
        return null;
    }
  };

  render() {
    const { focused, title } = this.props;

    const containerStyles = [
      styles.defaultStyle,
      focused ? [styles.activeStyle, styles.shadow] : null
    ];

    return (
      <Block flex row style={containerStyles}>
        <Block middle flex={0.1} style={{ marginRight: 5 }}>
          {this.renderIcon()}
        </Block>
        <Block row center flex={0.9}>
          <Text
            size={15}
            bold={focused ? true : false}
            color={focused ? "white" : "#7248BD"}
          >
            {title}
          </Text>
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  defaultStyle: {
    paddingVertical: 15,
    paddingHorizontal: 14
  },
  activeStyle: {
    backgroundColor: "#7248BD",
    borderRadius: 4
  },
  shadow: {
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 8,
    shadowOpacity: 0.1
  }
});

export default DrawerItem;
