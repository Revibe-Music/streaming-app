/*
* All accounts that require authentication will be tested to ensure
* the user has signed in before rendering the account tabs and all
* public platform tabs (YouTube) will automatically render
*/
import React, { Component } from "react";
import { TouchableOpacity, View, Text } from 'react-native'
import { Container, Tabs, Tab, Icon, Header, Left, Body, Right, Button } from "native-base";
import { connect } from 'react-redux';
import styles from "./styles";
import SplashScreen from "react-native-splash-screen";
import {default as SearchBar} from 'react-native-search-box';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { shuffleSongs } from './../../redux/audio/actions'
import SpotifySongs from "./../../components/libraries/spotifySongs";
import YouTubeSongs from "./../../components/libraries/youtubeSongs";
import RevibeSongs from "./../../components/libraries/revibeSongs";
import LibraryList from "./../../components/lists/libraryList";
import ArtistList from "./../../components/lists/artistList";
import AlbumList from "./../../components/lists/albumList";


class Library extends Component {

  constructor(props) {
     super(props);
     this.state = {
       filtering: false,
       selectedFilter: "Songs",
       filterText: "",
       filteredData: {}
     }
     this.openFilter = this.openFilter.bind(this)
     this.closeFilter = this.closeFilter.bind(this)
     this.setFilterType = this.setFilterType.bind(this)
     this.setFilterText = this.setFilterText.bind(this)
     this.filter = this.filter.bind(this)
     this.renderMedia = this.renderMedia.bind(this)
   }

  static navigationOptions = {
    header: null
  };

  openFilter() {
    this.setState({ filtering: true })
    this.filter("", "")
  }
  closeFilter() {
    this.setState({ filtering: false, filteredData: {}, selectedFilter:"Songs"})
  }
  setFilterType(type) {
    if(type !== this.state.selectedFilter) {
      this.setState({ selectedFilter: type })
      this.filter(type, this.state.filterText)
    }
  }

  setFilterText(text) {
    this.setState({filterText: text})
    this.filter(this.state.selectedFilter, text)
  }

  filter(type, text) {
    // var platformNames = Object.keys(this.props.platforms).filter(x => x!=="Revibe")
    var filteredPlatformData = {}
    for(var x=0; x<platformNames.length; x++) {
      filteredPlatformData[platformNames[x]] = this.props.platforms[platformNames[x]].filterData(type, text)
    }
    this.setState({ filteredData: filteredPlatformData })
  }

  renderMedia(platform) {
    if(this.state.filtering && this.state.filteredData[platform]) {
      if(this.state.filteredData[platform].length > 0) {
        if(this.state.selectedFilter === "Artists") {
          return (<Container style={[{backgroundColor: "#121212",}, this.state.filtering ? {paddingTop:hp("15%")} : {paddingTop:hp("7%")}]}>
                    <ArtistList artists={this.state.filteredData[platform]} displaySavedSongs={true} platform={this.props.platforms[platform]} navigation={this.props.navigation}/>
                  </Container>)
        }
        else if(this.state.selectedFilter === "Albums") {
          return (<Container style={[{backgroundColor: "#121212",}, this.state.filtering ? {paddingTop:hp("15%")} : {paddingTop:hp("7%")}]}>
                    <AlbumList albums={this.state.filteredData[platform]} displaySavedSongs={true} platform={this.props.platforms[platform]} navigation={this.props.navigation}/>
                  </Container>)
        }
        else {
          return (<Container style={[{backgroundColor: "#121212",}, this.state.filtering ? {paddingTop:hp("15%")} : {paddingTop:hp("7%")}]}>
                    <LibraryList filtering={true} songs={this.state.filteredData[platform]} platform={this.props.platforms[platform]} navigation={this.props.navigation}/>
                  </Container>)
        }
      }
      else {
        return (<Container style={[{backgroundColor: "#121212",}, this.state.filtering ? {paddingTop:hp("15%")} : {paddingTop:hp("7%")}]}>
                  <Text style={styles.noFilterResultsText}>No Results.</Text>
               </Container>)
      }
    }
    else {
      if(platform === "Spotify") {
        return (<SpotifySongs filtering={this.state.filtering} navigation={this.props.navigation} />)
      }
      else if(platform === "YouTube") {
        return (<YouTubeSongs filtering={this.state.filtering} navigation={this.props.navigation} />)
      }
      else {
        return (<RevibeSongs filtering={this.state.filtering} navigation={this.props.navigation} />)
      }
    }
  }

  renderLibrary(platform) {

  }


  render() {
    const activePlatformNames = Object.keys(this.props.platforms);

    return (
      <>
      <Header style={styles.libraryHeader} androidStatusBarColor="#222325" iosBarStyle="light-content">
        <Left>
        <Text style={styles.pageTitle}> Library </Text>
        </Left>
        <Body>
        </Body>
        <Right>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={()=> this.props.navigation.navigate({key:"Settings",routeName:"Settings"})}
        >
        <Icon type="Ionicons" name="md-settings" style={styles.songOptions} />
        </TouchableOpacity>
        </Right>
      </Header>

      <Container style={styles.container}>

        <Tabs tabBarPosition="top" tabBarUnderlineStyle={styles.tabs}>

        {activePlatformNames.filter(name => name==="Spotify").length > 0 ?
          <Tab heading="Spotify" style={styles.tab} tabStyle={styles.tabStyle} activeTabStyle={styles.activeTabStyle} textStyle={styles.tabText} activeTextStyle={styles.activeTabText}>
            {this.renderMedia("Spotify")}
          </Tab>
          :
          null
        }
        <Tab heading="YouTube" style={styles.tab} tabStyle={styles.tabStyle} activeTabStyle={styles.activeTabStyle} textStyle={styles.tabText} activeTextStyle={styles.activeTabText}>
          {this.renderMedia("YouTube")}
        </Tab>
        <Tab heading="Revibe" style={styles.tab} tabStyle={styles.tabStyle} activeTabStyle={styles.activeTabStyle} textStyle={styles.tabText} activeTextStyle={styles.activeTabText}>
          {this.renderMedia("Revibe")}
        </Tab>
        </Tabs>
      </Container>
      <View style={[styles.filterOptionConainter, this.state.filtering ? null : {flexDirection:"row"}]} >

      {this.state.filtering ?
        <View styles={{width: wp("90%")}}>
        <SearchBar
          defaultValue=""
          blurOnSubmit={false}
          autoFocus={true}
          onDelete={() => this.setFilterText("") }
          onChangeText={this.setFilterText}
          onCancel={this.closeFilter}
          backgroundColor="#121212"
          placeholderTextColor="white"
          titleCancelColor="#7248BD"
          tintColorSearch="black"
          tintColorDelete="#7248BD"
          autoCapitalize="none"
          inputHeight={hp("5%")}
          inputBorderRadius={hp("1%")}
          inputStyle={styles.searchText}
          iconSearch={<Icon name="search" type="EvilIcons" style={styles.searchText}/>}
          searchIconExpandedMargin={wp("2%")}
          searchIconCollapsedMargin={wp("16%")}
          placeholderCollapsedMargin={wp("9%")}
          placeholderExpandedMargin={wp("10%")}
          style={styles.searchText}
        />
        <View style={{flexDirection:"row", width: wp("75%"), marginTop: wp("3%")}} >
        <Left>
          <Button
          style={[styles.filterButtonSmall, this.state.selectedFilter === "Songs" ? {backgroundColor: "#7248BD"} : {backgroundColor: "#222222"}] }
          onPress={() => this.setFilterType("Songs")}
          >
            <Text style={styles.filterTextSmall}> Songs </Text>
          </Button>
        </Left>
        <Body>
          <Button
          style={[styles.filterButtonSmall, this.state.selectedFilter === "Artists" ? {backgroundColor: "#7248BD"} : {backgroundColor: "#222222"}] }
          onPress={() => this.setFilterType("Artists")}
          >
            <Text style={styles.filterTextSmall}> Artists </Text>
          </Button>
        </Body>
        <Right>
          <Button
          style={[styles.filterButtonSmall, this.state.selectedFilter === "Albums" ? {backgroundColor: "#7248BD"} : {backgroundColor: "#222222"}]}
          onPress={() => this.setFilterType("Albums")}
          >
            <Text style={styles.filterTextSmall}> Albums </Text>
          </Button>
        </Right>
        </View>
        </View>
        :
        <>
        <Left>
          <Button
          style={styles.filterButtonLarge}
          onPress={() => this.props.shuffleSongs()}
          >
            <Text style={styles.filterTextLarge}> Shuffle </Text>
            <Icon type="Entypo" name="shuffle" style={styles.filterIconsLarge} />
          </Button>
        </Left>
        <Right>
          <Button
          style={styles.filterButtonLarge}
          onPress={this.openFilter}
          >
            <Text style={styles.filterTextLarge}> Filter </Text>
            <Icon type="MaterialCommunityIcons" name="xbox-controller-menu" style={styles.filterIconsLarge} />
          </Button>
        </Right>
        </>
      }
      </View>

      </>
    );
  }
}
function mapStateToProps(state) {
  return {
    platforms: state.platformState.platforms,
  }
};

const mapDispatchToProps = dispatch => ({
    shuffleSongs: () => dispatch(shuffleSongs()),
});


export default connect(mapStateToProps, mapDispatchToProps)(Library)
