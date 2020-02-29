import React, { Component } from "react";
import { View, Image } from "react-native";
import { Container, Content, Header, Body, Right ,Text, Input, Icon, Left, Tabs, Tab, } from "native-base";
import { BarIndicator } from 'react-native-indicators';
import {default as SearchBar} from 'react-native-search-box';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { connect } from 'react-redux';

import List from "./../../components/lists/List";
import OptionsMenu from "./../../components/OptionsMenu/index";
import AnimatedPopover from './../../components/animatedPopover/index';
import SearchTab from './../../components/tabs/SearchTab';
import { playSong } from './../../redux/audio/actions';
import styles from "./styles";


class Search extends Component {

  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      didSearch: false,
      shouldSearch: false,
      query: ""
    };

    this.availablePlatforms()
  }

  availablePlatforms() {
    var platformNames = Object.keys(this.props.platforms)
    // platformNames = platformNames.filter(x => x!=="Revibe")
    if(platformNames.length > 2) {
      searchablePlatforms = platformNames.slice(0, platformNames.length-1).join(", ") + " & " + platformNames[platformNames.length-1]
    }
    else if(platformNames.length === 2) {
      searchablePlatforms =  platformNames[0] + " & " + platformNames[1]
    }
    else {
      searchablePlatforms =  platformNames[0]
    }
    return searchablePlatforms
  }

  render() {
    const activePlatformNames = Object.keys(this.props.platforms);

    return (
      <>
      <Header style={styles.libraryHeader} androidStatusBarColor="#222325" iosBarStyle="light-content">
        <Left>
        <Text style={styles.pageTitle}> Search </Text>
        </Left>
        <Body>
        </Body>
        <Right></Right>
      </Header>
      <Container style={styles.container}>
        <SearchBar
          blurOnSubmit
          onSearch={(text) => this.setState({query: text, didSearch:true})}
          onCancel={() => this.setState({query: "", didSearch:false})}
          backgroundColor="#121212"
          placeholderTextColor="white"
          titleCancelColor="#7248BD"
          tintColorSearch="black"
          tintColorDelete="#7248BD"
          autoCapitalize="none"
          inputHeight={hp("6%")}
          inputBorderRadius={hp("1%")}
          inputStyle={styles.searchText}
          iconSearch={<Icon name="search" type="EvilIcons" style={styles.searchText}/>}
          searchIconExpandedMargin={wp("2%")}
          searchIconCollapsedMargin={wp("16%")}
          placeholderCollapsedMargin={wp("9%")}
          placeholderExpandedMargin={wp("10%")}
          style={styles.searchText}
        />

        {this.state.didSearch ?
          <Tabs
            tabBarPosition="top"
            tabBarUnderlineStyle={styles.tabs}
          >
            {activePlatformNames.map(platform => (
              <SearchTab
                style={styles.container} tabStyle={styles.tabStyle} activeTabStyle={styles.activeTabStyle} textStyle={styles.tabText} activeTextStyle={styles.activeTabText}
                heading={platform}
                platform={this.props.platforms[platform]}
                query={this.state.query}
                navigation={this.props.navigation}
              />
            ))}
          </Tabs>
        :
          <Content>
          <View style={styles.center}>
            <Icon name="search" type="EvilIcons" style={styles.searchIcon} />
            <Text style={styles.searchBgText}>
              Search {this.availablePlatforms()}
            </Text>
            <Text style={styles.searchFindText}>
              Millions of songs at your fingertips!
            </Text>
          </View>
          </Content>
        }
        <OptionsMenu navigation={this.props.navigation} />
      </Container>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    connected: state.connectionState.connected,
    platforms: state.platformState.platforms
  }
};

const mapDispatchToProps = dispatch => ({
    playSong: (index, playlist) => dispatch(playSong(index, playlist)),
});


export default connect(mapStateToProps, mapDispatchToProps)(Search)
