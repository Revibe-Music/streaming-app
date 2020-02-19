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
import {default as SearchBar} from 'react-native-search-box';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { shuffleSongs, playSong } from './../../redux/audio/actions'
import List from "./../../components/lists/List";
import OptionsMenu from "./../../components/OptionsMenu/index";

import realm from './../../realm/realm';


class Library extends Component {

  static navigationOptions = {
    header: null
  };

  constructor(props) {
     super(props);

     this.state = {
       filtering: false,
       selectedFilter: "Song",
       filterText: "",
       filteredData: {}
     }

     var activePlatformNames = Object.keys(this.props.platforms);
     for(var x=0; x<activePlatformNames.length; x++) {
       this.state[activePlatformNames[x] + "Songs"] = this.props.platforms[activePlatformNames[x]].library.allSongs
     }
     this.updateSongs = this.updateSongs.bind(this)
     this.openFilter = this.openFilter.bind(this)
     this.closeFilter = this.closeFilter.bind(this)
     this.setFilterType = this.setFilterType.bind(this)
     this.setFilterText = this.setFilterText.bind(this)
     this.filter = this.filter.bind(this)
  }

  componentDidMount () {
    var activePlatformNames = Object.keys(this.props.platforms);
    for(var x=0; x<activePlatformNames.length; x++) {
      const platformName = activePlatformNames[x]
      this.props.platforms[platformName].library.addListener(() => {
        this.updateSongs(platformName)
      })
    }
  }

  componentWillUnmount() {
    var activePlatformNames = Object.keys(this.props.platforms);
    for(var x=0; x<activePlatformNames.length; x++) {
      const platformName = activePlatformNames[x]
      this.props.platforms[platformName].library.removeListener()
    }
  }

  updateSongs(platform) {
    this.setState({[platform+"Songs"]: this.props.platforms[platform].library.allSongs})
  }

  openFilter() {
    this.setState({ filtering: true })
    this.filter("", "")
  }

  closeFilter() {
    this.setState({ filtering: false, filteredData: {}, selectedFilter:"Song"})
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
    var filteredPlatformData = {}
    var platformNames = Object.keys(this.props.platforms)
    for(var x=0; x<platformNames.length; x++) {
      filteredPlatformData[platformNames[x]] = this.props.platforms[platformNames[x]].filterData(type, text)
    }
    this.setState({ filteredData: filteredPlatformData })
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

      <View style={styles.container}>
      <View style={{width: wp("90%"), marginLeft: "5%"}}>
        <SearchBar
          defaultValue=""
          blurOnSubmit={false}
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
        </View>

        <View style={{flexDirection:"row", marginTop: hp("1%"), justifyContent: "space-evenly"}} >
          <Button
          style={styles.filterButtonLarge}
          onPress={() => this.props.shuffleSongs()}
          >
            <Text style={styles.filterTextLarge}> Shuffle </Text>
            <Icon type="Entypo" name="shuffle" style={styles.filterIconsLarge} />
          </Button>
          <Button
          style={styles.filterButtonLarge}
          onPress={this.openFilter}
          >
            <Text style={styles.filterTextLarge}> Filter </Text>
            <Icon type="MaterialCommunityIcons" name="xbox-controller-menu" style={styles.filterIconsLarge} />
          </Button>
          </View>
      <Container style={{backgroundColor: "#121212"}}>
      <Tabs tabBarPosition="top" tabBarUnderlineStyle={styles.tabs}>
        {activePlatformNames.map(platform => (
          <Tab heading={platform} style={styles.tab} tabStyle={styles.tabStyle} activeTabStyle={styles.activeTabStyle} textStyle={styles.tabText} activeTextStyle={styles.activeTabText}>
            <Container style={{backgroundColor: "#121212"}}>
              <List
                data={this.state.filteredData[platform] ? this.state.filteredData[platform] : this.state[platform+"Songs"]}
                type={this.state.selectedFilter}
                allowRefresh={!this.state.filtering}
                onRefresh={() => console.log("Refreshing!")}
                noDataText="Your Library is empty."
                navigation={this.props.navigation}
                onClick={(index, playlist) => this.props.playSong(index,playlist)}
              />
            </Container>
          </Tab>
        ))}
      </Tabs>
      <OptionsMenu navigation={this.props.navigation} />
      </Container>
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
    playSong: (index, playlist) => dispatch(playSong(index, playlist))
});


export default connect(mapStateToProps, mapDispatchToProps)(Library)
