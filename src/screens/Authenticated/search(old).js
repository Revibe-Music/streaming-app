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
      results: {},
      loading: false,
    };
    var platformNames = Object.keys(this.props.platforms)
    for(var x=0; x<platformNames.length; x++) {
      this.state.results[platformNames[x]] = {Songs: [], Atists: [], Albums: []}
    }

    this.platformLogo = {
      Revibe: require("../../../assets/RevibeLogo.png"),
      Spotify: require("../../../assets/SpotifyLogo.png"),
      YouTube: require("../../../assets/YouTubeLogo.png"),
    }

    this.search = this.search.bind(this);
    this.cancelSearch = this.cancelSearch.bind(this);
    this.availablePlatforms()
  }


  async search(text) {
    if(!!text) {
      if (this.props.connected) {
          this.setState({ loading: true, didSearch: true });
          var platformsFetching = []
          var platformNames = Object.keys(this.props.platforms)
          // platformNames = platformNames.filter(x => x=="Revibe")

          for(var x=0; x<platformNames.length; x++) {
            platformsFetching.push(this.props.platforms[platformNames[x]].search(text))
          }
          var searchResults = await Promise.all(platformsFetching)

          var results = {}
          for(var x=0; x<searchResults.length; x++) {
            results[platformNames[x]] = searchResults[x]
          }
          this.setState({results: results, loading: false, didSearch: true})
      }
      else {
        // show no internet connection
      }
    }
    else {
      var results = {}
      var platformNames = Object.keys(this.props.platforms)
      for(var x=0; x<platformNames.length; x++) {
        results[platformNames[x]] = {Songs: [], Artists: [], Albums: []}
      }
      this.setState({results: results});
    }
  }

  cancelSearch() {
    var results = {}
    var platformNames = Object.keys(this.props.platforms)
    for(var x=0; x<platformNames.length; x++) {
      results[platformNames[x]] = {Songs: [], Artists: [], Albums: []}
    }
    this.setState({results: results,didSearch: false});
  }

  displayResults() {
    const resultTypes = ["Songs", "Artists", "Albums"]
    const activePlatformNames = Object.keys(this.props.platforms);
    return (
      <Tabs
        tabBarPosition="top"
        tabBarUnderlineStyle={styles.tabs}
      >
        {resultTypes.map(contentType => {
          // var type = contentType.charAt(0).toUpperCase() + contentType.substring(1)
          return (
            <Tab heading={contentType} style={styles.container} tabStyle={styles.tabStyle} activeTabStyle={styles.activeTabStyle} textStyle={styles.tabText} activeTextStyle={styles.activeTabText}>
              <Content>
              {activePlatformNames.map(platform => {
                return (
                  <View>
                    <Image
                      style={styles.searchPlatformLogo}
                      source={this.platformLogo[platform]}
                    />
                    <View style={{minHeight: 1,}}>
                      <List
                        data={this.state.results[platform][contentType.toLowerCase()].slice(0,5)}
                        type={contentType}
                        allowRefresh={false}
                        displayType={true}
                        navigation={this.props.navigation}
                      />
                    </View>
                  </View>
                )
              }
            )}
            </Content>
          </Tab>
          )
        }
      )}
    </Tabs>
    )

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
          onSearch={this.search}
          onCancel={this.cancelSearch}
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
            <>
            {this.state.loading  ?
              <Content>
                <AnimatedPopover type="Loading" show={this.state.loading} />
              </Content>
              :
              <>
              {this.displayResults()}
              </>
            }
            </>
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
