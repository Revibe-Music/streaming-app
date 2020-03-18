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
import styles from "../styles";
import {default as SearchBar} from 'react-native-search-box';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Modal from "react-native-modal";
import { uniqBy } from 'lodash'

import { shuffleSongs } from '../../../redux/audio/actions'
import List from "../../../components/lists/List";
import FilterModal from "../../../components/modals/filterModal";
import OptionsMenu from "../../../components/OptionsMenu/index";

import realm from '../../../realm/realm';


class LibraryContent extends Component {

  static navigationOptions = {
    header: null
  };

  constructor(props) {
     super(props);

     this.state = {
       sortBy: "dateSaved",
       showFilterModal: false,
       filtering: false,
       filterText: "",
       searching: false,
       availablePlatforms: Object.keys(this.props.platforms),
       content: [],
       updating: false,
     }

     this.contentType = this.props.navigation.state.params.contentType

     this._sort = this._sort.bind(this)
     this._format = this._format.bind(this)
     this._addListeners = this._addListeners.bind(this)
     this._removeListeners = this._removeListeners.bind(this)
     this.getContent = this.getContent.bind(this)
     this.updateContent = this.updateContent.bind(this)
     this.setFilterText = this.setFilterText.bind(this)
  }

  async componentDidMount(){
    var filteredData = []
    for(var x=0; x<this.state.availablePlatforms.length; x++) {
      if(this.contentType === "Songs") {
        var filteredData = filteredData.concat(this.props.platforms[this.state.availablePlatforms[x]].library.allSongs.slice(0,50))
      }
      else if (this.contentType === "Albums") {
        var filteredData = filteredData.concat(this.props.platforms[this.state.availablePlatforms[x]].library.allAlbums.slice(0,50))
      }
      else {
        var filteredData = filteredData.concat(this.props.platforms[this.state.availablePlatforms[x]].library.allArtists.slice(0,50))
      }
    }
    filteredData = this._sort(filteredData)
    this.setState({content: this._format(filteredData)})
    setTimeout(() => this.updateContent(), 500)
    setTimeout(() => this._addListeners(), 500)
  }

  componentWillUnmount() {
    this._removeListeners()
  }

  async componentDidUpdate(prevProps, prevState) {
    if(this.state.availablePlatforms.length !== prevState.availablePlatforms.length) {
      this.updateContent()
    }
    if(this.state.filterText !== prevState.filterText) {
      this.updateContent()
    }
    if(this.state.sortBy !== prevState.sortBy) {
      this.updateContent()
    }
    if(Object.keys(prevProps.platforms).length !== Object.keys(this.props.platforms).length) {
      await this.setState({availablePlatforms: Object.keys(this.props.platforms)})
      this.updateContent()
      if(Object.keys(prevProps.platforms).length < Object.keys(this.props.platforms).length) {
        var newPlatforms = Object.keys(this.props.platforms).filter(function(itm){
          return Object.keys(prevProps.platforms).indexOf(itm)==-1;
        });
        this._addListeners(newPlatforms)
      }
    }
  }

  _addListeners(platforms=[]) {
    if(platforms.length > 0) {
      var libraries = []
      for(var x=0; x<platforms.length; x++) {
        libraries.push(realm.objects('Library').filtered(`platform = "${platforms[x]}"`)[0])
      }
    }
    else {
      var libraries = realm.objects('Library')
    }
    for(var x=0; x<libraries.length; x++) {
      const platform = libraries[x].platform
      libraries[x].addListener(this.getContent)
    }
  }

  _removeListeners() {
    var allLibraries = realm.objects('Library')
    for(var x=0; x<allLibraries.length; x++) {
      const platform = allLibraries[x].platform
      allLibraries[x].removeListener(this.getContent)
    }
  }

  _sort(data) {
    var sortedData = [...data]
    if(this.contentType === "Songs") {
      if(this.state.sortBy === "dateSaved") {
        sortedData.sort((a, b) => new Date(b.dateSaved) - new Date(a.dateSaved))
      }
      else {
        sortedData.sort(function(a, b) {
          if(a.song.name < b.song.name) { return -1; }
          if(a.song.name > b.song.name) { return 1; }
          return 0;
        })
      }
    }
    else {
      sortedData.sort(function(a, b) {
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })
    }

    return sortedData
  }

  _format(data) {
    if(this.contentType === "Songs") {
      return JSON.parse(JSON.stringify(data.map(x => x.song)))
    }
    return JSON.parse(JSON.stringify(data.map(x => x)))
  }

  getContent(libraries, changes) {
    if(changes) {
      if(changes.changedProperties.filter(x => x==="songs").length > 0) {
        if(!this.state.updating) {
          // because events fire mutliple times for the same event must only allow to update once
          this.setState({updating: true})
          this.updateContent()
          this.setState({updating: false})
        }
      }
    }
  }

  updateContent() {
    var filteredData = []
    for(var x=0; x<this.state.availablePlatforms.length; x++) {
      var filteredData = filteredData.concat(this.props.platforms[this.state.availablePlatforms[x]].library.filter(this.contentType, this.state.filterText))
    }
    filteredData = this._sort(filteredData)
    this.setState({content: this._format(filteredData)})
  }

  setFilterText(text) {
    if(text !== "") {
      this.setState({filterText: text, filtering: true})
    }
    else {
      this.setState({filterText: text})
    }
  }


  render() {
    return (
      <>
      <Header style={styles.libraryHeader} androidStatusBarColor="#222325" iosBarStyle="light-content">
        <View style={{flexDirection: "row", alignItems: "center", width: wp("100%")}}>
          <View style={{flexDirection: "row", justifyContent: "flex-start", width: wp("20%")}}>
            <Button
              transparent
              onPress={() => this.props.navigation.goBack()}>
              <Icon name="ios-arrow-back" style={{color:"white", fontSize: 30}}/>
            </Button>
          </View>
          <View style={{flexDirection: "row", justifyContent: "center", width: wp("60%")}}>
            <Text style={[styles.pageTitle, {fontSize: hp("2.5%")}]}>{this.contentType}</Text>
            </View>
        </View>
      </Header>

      <View style={styles.container}>
      <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-evenly"}}>
      <View style={{width: this.state.searching ? wp("90%") : wp("80%")}}>
        <SearchBar
          defaultValue=""
          placeholder={`Search ${this.contentType}`}
          blurOnSubmit={false}
          onFocus={() => this.setState({searching: true})}
          onDelete={() => this.setFilterText("") }
          onChangeText={this.setFilterText}
          onCancel={() => {
            this.setState({searching: false})
            this.setFilterText("")
          }}
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
        {!this.state.searching ?
          <Button
          style={styles.filterButtonLarge}
          onPress={() => this.setState({ showFilterModal: true })}
          >
            <Text style={styles.filterTextLarge}> Filter </Text>
          </Button>
        :
          null
        }
        </View>

        <Container style={{backgroundColor: "#121212", paddingTop: hp("2%")}}>
          <List
            data={this.state.content}
            type={this.contentType}
            displayLogo={true}
            displayType={this.contentType==="Artists"}
            isLocal={true}
            allowRefresh={!this.state.filtering}
            onRefresh={() => console.log("Refreshing!")}
            noDataText={this.state.filtering ? "No Results." : "Your Library is empty."}
            source="Library"
            navigation={this.props.navigation}
          />
        </Container>

      <OptionsMenu navigation={this.props.navigation} />
      </View>

      <FilterModal
        isVisible={this.state.showFilterModal}
        onClose={() => this.setState({showFilterModal: false})}
        onSortByChange={(method) => this.setState({sortBy: method})}
        onPlatformChange={(platforms) => this.setState({availablePlatforms: platforms})}
      />

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


export default connect(mapStateToProps, mapDispatchToProps)(LibraryContent)
