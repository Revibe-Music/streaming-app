import React, { Component } from "react";
import { View, Image } from "react-native";
import { Container, Content, Header, Body, Right ,Text, Input, Icon, Left, Tabs, Tab, } from "native-base";
import { BarIndicator } from 'react-native-indicators';
import {default as SearchBar} from 'react-native-search-box';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import SearchSongList from "./../../components/lists/searchSongList";
import SearchArtistList from "./../../components/lists/searchArtistList";
import Platform from './../../api/platform'
import styles from "./styles";


class Search extends Component {

  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      didSearch: false,
      spotifyResults: {songs:[], artists: []},
      youtubeResults: {songs:[], artists: []},
      loading: false,
    };

    this.search = this.search.bind(this);
    this.cancelSearch = this.cancelSearch.bind(this);
    this.availablePlatforms()
  }


  async search(text) {
    if(!!text) {
      if (this.props.connected) {
          this.setState({ loading: true });
          var platformsFetching = []
          var platformNames = Object.keys(this.props.platforms)
          platformNames = platformNames.filter(x => x=="Revibe")

          for(var x=0; x<platformNames.length; x++) {
            platformsFetching.push(this.props.platforms[platformNames[x]].search(text))
          }
          var searchResults = await Promise.all(platformsFetching)

          var newState = {}
          for(var x=0; x<searchResults.length; x++) {
            if(platformNames[x]==="YouTube") {
              newState[platformNames[x].toLowerCase()+"Results"] = {songs: searchResults[x].songs}
            }
            else {
              newState[platformNames[x].toLowerCase()+"Results"] = {songs: searchResults[x].songs, artists: searchResults[x].artists} // need to initialize object here
            }
          }
          newState["loading"] = false
          newState["didSearch"] = true
          this.setState(newState)
      }
      else {
        // show no internet connection
      }
    }
    else {
      this.setState({
        youtubeResults: {songs:[], artists: []},
        spotifyResults: {songs:[], artists: []},
      });
    }
  }

  cancelSearch() {
    this.setState({
      youtubeResults: {songs:[], artists: []},
      spotifyResults: {songs:[], artists: []},
      didSearch: false
    });
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

          {!(this.state.spotifyResults.songs.length === 0 && this.state.spotifyResults.artists.length === 0 && this.state.youtubeResults.songs.length === 0 && !this.state.didSearch) ?
            <>
            {this.state.loading  ?
              <Content>
              <View style={styles.loadingIndicator}>
                <BarIndicator
                  animationDuration={700}
                  color='#7248bd'
                  count={5}
                />
              </View>
              </Content>
              :
              <Tabs
                tabBarPosition="top"
                tabBarUnderlineStyle={styles.tabs}
              >
                <Tab heading="Songs" style={styles.container} tabStyle={styles.tabStyle} activeTabStyle={styles.activeTabStyle} textStyle={styles.tabText} activeTextStyle={styles.activeTabText}>
                <Content>
                { Object.keys(this.props.platforms).filter(x => x==="Spotify").length > 0 ?
                  <>
                  {this.state.spotifyResults.songs.length > 0 ?
                    <View>
                      <Image
                        style={styles.searchPlatformLogo}
                        source={require("../../../assets/spotify_logo.png")}
                      />
                      <SearchSongList
                        results={this.state.spotifyResults.songs}
                        platform={this.props.platforms["Spotify"]}
                        navigation={this.props.navigation}
                      />
                    </View>
                    :
                    <>
                    {this.state.didSearch ?
                      <View>
                        <Image
                          style={styles.searchPlatformLogo}
                          source={require("../../../assets/spotify_logo.png")}
                        />
                        <Text style={styles.searchNoResults}> No Results </Text>
                      </View>
                      :
                      null
                    }
                    </>
                  }
                  </>
                :
                 null
               }
               {this.state.revibeResults.songs.length > 0 ?
                 <View>
                 <Image
                   style={styles.searchPlatformLogo}
                   source={require("../../../assets/revibetransparent.png")}
                 />
                 <SearchSongList
                   results={this.state.revibeResults.songs}
                   platform={this.props.platforms["Revibe"]}
                   navigation={this.props.navigation}
                 />
                 </View>
               :
               <>
               {this.state.didSearch ?
                 <View>
                   <Image
                     style={styles.searchPlatformLogo}
                     source={require("../../../assets/revibetransparent.png")}
                   />
                   <Text style={styles.searchNoResults}> No Results </Text>
                 </View>
                 :
                 null
               }
               </>
               }
                {this.state.youtubeResults.songs.length > 0 ?
                  <View>
                  <Image
                    style={styles.searchPlatformLogo}
                    source={require("../../../assets/youtube_logo.png")}
                  />
                  <SearchSongList
                    results={this.state.youtubeResults.songs}
                    platform={this.props.platforms["YouTube"]}
                    navigation={this.props.navigation}
                  />
                  </View>
                :
                <>
                {this.state.didSearch ?
                  <View>
                    <Image
                      style={styles.searchPlatformLogo}
                      source={require("../../../assets/youtube_logo.png")}
                    />
                    <Text style={styles.searchNoResults}> No Results </Text>
                  </View>
                  :
                  null
                }
                </>
                }


                </Content>

                </Tab>
                <Tab heading="Artists" style={styles.container} tabStyle={styles.tabStyle} activeTabStyle={styles.activeTabStyle} textStyle={styles.tabText} activeTextStyle={styles.activeTabText}>
                <Content>

                { Object.keys(this.props.platforms).filter(x => x==="Spotify").length > 0 ?
                  <>
                  {this.state.spotifyResults.artists.length > 0  ?
                    <View>
                      <Image
                        style={styles.searchPlatformLogo}
                        source={require("../../../assets/spotify_logo.png")}
                      />
                      <SearchArtistList
                        results={this.state.spotifyResults.artists}
                        platform={this.props.platforms["Spotify"]}
                        navigation={this.props.navigation}
                      />
                    </View>
                    :
                    <>
                    {this.state.didSearch ?
                      <View>
                        <Image
                          style={styles.searchPlatformLogo}
                          source={require("../../../assets/spotify_logo.png")}
                        />
                        <Text style={styles.searchNoResults}> No Results </Text>
                      </View>
                      :
                      null
                    }
                    </>
                  }
                  </>
                :
                null
              }

                </Content>
                </Tab>
              </Tabs>
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

export default connect(mapStateToProps)(Search)
