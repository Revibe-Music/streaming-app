/*
* All accounts that require authentication will be tested to ensure
* the user has signed in before rendering the account tabs and all
* public platform tabs (YouTube) will automatically render
*/
import React, { Component } from "react";
import { TouchableOpacity, View, Text } from 'react-native'
import { Container, Tabs, Tab, Icon, Header, Left, Body, Right, Button, ListItem } from "native-base";
import { CheckBox } from 'react-native-elements'
import { connect } from 'react-redux';
import styles from "./styles";
import {default as SearchBar} from 'react-native-search-box';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Modal from "react-native-modal";
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
       showFilterModal: false,
       filtering: false,
       selectedFilter: "Songs",
       filterText: "",
     }

     var activePlatformNames = Object.keys(this.props.platforms);
     for(var x=0; x<activePlatformNames.length; x++) {
       this.state[activePlatformNames[x] + "Data"] = this.props.platforms[activePlatformNames[x]].filterData("Songs", "")
     }
     this.updateSongs = this.updateSongs.bind(this)
     this.openFilter = this.openFilter.bind(this)
     this.closeFilter = this.closeFilter.bind(this)
     this.setFilterType = this.setFilterType.bind(this)
     this.setFilterText = this.setFilterText.bind(this)
     this.filter = this.filter.bind(this)
     this.renderTabData = this.renderTabData.bind(this)
  }

  componentDidMount(){
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
      this.props.platforms[platformName].library.removeListener(() => {
        this.updateSongs(platformName)
      })
    }
  }

  componentDidUpdate(prevProps) {
    if(Object.keys(prevProps.platforms).length !== Object.keys(this.props.platforms).length) {
      // add listeners to new platform libraries
      activePlatformNames = Object.keys(this.props.platforms);
      for(var x=0; x<activePlatformNames.length; x++) {
        this.setState({[activePlatformNames[x] + "Data"]: this.props.platforms[activePlatformNames[x]].filterData(this.state.selectedFilter, this.state.filterText)})
        const platformName = activePlatformNames[x]
        this.props.platforms[platformName].library.addListener(() => {
          this.updateSongs(platformName)
        })
      }
    }
  }

  updateSongs(platform) {
    if(this.props.platforms[platform]) {
      if(this.props.platforms[platform].hasLoggedIn()) {
        this.setState({[platform+"Data"]: this.props.platforms[platform].filterData(this.state.selectedFilter, this.state.filterText)})
      }
    }
    else {
      // remove platform song from state
      var state = this.state
      delete state[platform+"Data"]
      this.setState(state)
    }
  }

  openFilter() {
    this.setState({ showFilterModal: true })
  }

  closeFilter() {
    this.setState({ showFilterModal: false})
  }

  setFilterType(type) {
    if(type !== this.state.selectedFilter) {
      this.setState({ selectedFilter: type})
      this.filter(type, this.state.filterText)
      this.closeFilter()
    }
  }

  setFilterText(text) {
    if(text !== "") {
      this.setState({filterText: text, filtering: true})
    }
    else {
      this.setState({filterText: text})
    }
    this.filter(this.state.selectedFilter, text)
  }

  filter(type, text) {
    var filteredData = {}
    var platformNames = Object.keys(this.props.platforms)
    for(var x=0; x<platformNames.length; x++) {
      var data = this.props.platforms[platformNames[x]].filterData(type, text)
      filteredData[platformNames[x]+"Data"] = data
    }
    this.setState(filteredData)
  }

  renderTabData() {
    const activePlatformNames = Object.keys(this.props.platforms);
    const filter = this.state.selectedFilter
    return (
      activePlatformNames.map(platform => (
        <Tab heading={platform} style={styles.tab} tabStyle={styles.tabStyle} activeTabStyle={styles.activeTabStyle} textStyle={styles.tabText} activeTextStyle={styles.activeTabText}>
          <Container style={{backgroundColor: "#121212", paddingTop: hp("2%")}}>
            <List
              data={this.state[platform+"Data"]}
              type={filter}
              isLocal={true}
              allowRefresh={!this.state.filtering}
              onRefresh={() => console.log("Refreshing!")}
              noDataText={this.state.filtering ? "No Results." : "Your Library is empty."}
              navigation={this.props.navigation}
            />
          </Container>
        </Tab>
      ))
    )
  }


  render() {

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
          onPress={()=> this.props.navigation.openDrawer()}
        >
        <Icon type="Ionicons" name="md-menu" style={styles.songOptions} />
        </TouchableOpacity>
        </Right>
      </Header>

      <View style={styles.container}>
      <View style={{width: wp("90%"), marginLeft: "5%"}}>
        <SearchBar
          defaultValue=""
          placeholder="Search Library"
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
          searchIconCollapsedMargin={wp("25%")}
          placeholderCollapsedMargin={wp("18%")}
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
            <Icon type="MaterialCommunityIcons" name="filter-variant" style={styles.filterIconsLarge} />
          </Button>
          </View>
      <Container style={{backgroundColor: "#121212"}}>

      <Tabs tabBarPosition="top" tabBarUnderlineStyle={styles.tabs}>
        {this.renderTabData()}
      </Tabs>

      <OptionsMenu navigation={this.props.navigation} />
      </Container>
      </View>

      <Modal
        isVisible={this.state.showFilterModal}
        hasBackdrop={false}
        deviceWidth={wp("100")}
        style={{justifyContent: 'flex-end',margin: 0, padding: 0}}
        >
        <View style={{backgroundColor: '#202020', height: "45%", width: "100%", borderRadius: 20,}}>
          <ListItem noBorder style={[styles.filterListItem, {marginTop: "3%"}]}>
            <TouchableOpacity onPress={() => this.setFilterType("Songs")}>
              <View style={{flexDirection: "row"}}>
                <CheckBox
                  checked={this.state.selectedFilter === "Songs"}
                  onPress={() => this.setFilterType("Songs")}
                  checkedIcon='dot-circle-o'
                  uncheckedIcon='circle-o'
                  checkedColor="#7248BD"
                  style={styles.filterCheckbox}
                />
                <View style={styles.textContainer}>
                 <View>
                   <Text style={styles.filterOptionText}>Songs</Text>
                 </View>
               </View>
              </View>
            </TouchableOpacity>
          </ListItem>
          <ListItem noBorder style={styles.filterListItem}>
            <TouchableOpacity onPress={() => this.setFilterType("Albums")}>
              <View style={{flexDirection: "row"}}>
                <CheckBox
                  checked={this.state.selectedFilter === "Albums"}
                  onPress={() => this.setFilterType("Albums")}
                  checkedIcon='dot-circle-o'
                  uncheckedIcon='circle-o'
                  checkedColor="#7248BD"
                  style={styles.filterCheckbox}
                />
                <View style={styles.textContainer}>
                 <View>
                   <Text style={styles.filterOptionText}>Albums</Text>
                 </View>
                </View>
              </View>
            </TouchableOpacity>
          </ListItem>
          <ListItem noBorder style={styles.filterListItem}>
          <TouchableOpacity onPress={() => this.setFilterType("Artists")}>
            <View style={{flexDirection: "row"}}>
              <CheckBox
                checked={this.state.selectedFilter === "Artists"}
                onPress={() => this.setFilterType("Artists")}
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                checkedColor="#7248BD"
                style={styles.filterCheckbox}
              />
              <View style={styles.textContainer}>
               <View>
                 <Text style={styles.filterOptionText}>Artists</Text>
               </View>
              </View>
            </View>
          </TouchableOpacity>
          </ListItem>
          <Button style={styles.filterCancelButton}
          block
          onPress={() => this.closeFilter() }
          >
            <Text style={styles.filterCancelText}>Cancel</Text>
          </Button>
        </View>
      </Modal>
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
