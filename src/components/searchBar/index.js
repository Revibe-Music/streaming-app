import React, { Component } from "react";
import { Icon} from "native-base";
import {StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
import {default as BaseSearchBar} from 'react-native-search-box';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

class SearchBar extends Component {

  render() {
    var searchIconCollapsedMargin = wp("16%")
    var placeholderCollapsedMargin = wp("9%")
    return (
      <BaseSearchBar
        defaultValue=""
        placeholder={this.props.placeholder}
        blurOnSubmit={false}
        onFocus={this.props.onFocus}
        onDelete={this.props.onDelete}
        onChangeText={this.props.onChangeText}
        onCancel={this.props.onCancel}
        onSearch={this.props.onSearch}
        backgroundColor="#121212"
        placeholderTextColor="white"
        titleCancelColor="#7248BD"
        tintColorSearch="black"
        tintColorDelete="#7248BD"
        autoCapitalize="none"
        inputHeight={this.props.spanScreen ? hp("6%") : hp("5%")}
        inputBorderRadius={hp("1%")}
        inputStyle={styles.text}
        iconSearch={<Icon name="search" type="EvilIcons" style={[styles.icon, {top: this.props.spanScreen ? "-50%": "-35%"}]}/>}
        searchIconExpandedMargin={wp("2%")}
        searchIconCollapsedMargin={this.props.spanScreen ? searchIconCollapsedMargin : searchIconCollapsedMargin*1.5}
        placeholderCollapsedMargin={this.props.spanScreen ? placeholderCollapsedMargin : placeholderCollapsedMargin*2}
        placeholderExpandedMargin={wp("10%")}
        style={styles.text}
      />
    );
  }
}

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  onFocus: PropTypes.func,
  onSearch: PropTypes.func,
  onDelete: PropTypes.func,
  onChangeText: PropTypes.func,
  onCancel: PropTypes.func,
  spanScreen: PropTypes.bool,
};

SearchBar.defaultProps = {
  placeholder: "Search",
};

const styles = StyleSheet.create({
  text: {
    backgroundColor: "#222222",
    color: "white",
    textAlign: "left",
    fontSize: hp("2.5%"),
  },
  icon: {
    backgroundColor: "#222222",
    color: "white",
    textAlign: "left",
    fontSize: hp("2.2%"),
    position: "absolute",
  },
});

export default SearchBar
