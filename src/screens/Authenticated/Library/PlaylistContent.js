/*
* All accounts that require authentication will be tested to ensure
* the user has signed in before rendering the account tabs and all
* public platform tabs (YouTube) will automatically render
*/
import React, { Component } from "react";
import { TouchableOpacity, View, Text } from 'react-native'
import {  Button, ListItem , Icon} from "native-base";
import { CheckBox } from 'react-native-elements'
import Modal from "react-native-modal";
import DialogInput from 'react-native-dialog-input';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { uniqBy } from 'lodash'
import { connect } from 'react-redux';


import { shuffleSongs } from '../../../redux/audio/actions'
import RevibeAPI from '../../../api/revibe'
import Container from "../../../components/containers/container";
import SearchBar from "../../../components/searchBar/index";
import List from "../../../components/lists/List";
import FilterModal from "../../../components/modals/filterModal";
import OptionsMenu from "../../../components/OptionsMenu/index";
import styles from "../styles";
import realm from '../../../realm/realm';


class LibraryContent extends Component {

  constructor(props) {
     super(props);

     this.state = {
       sortBy: "dateCreated",
       showFilterModal: false,
       filtering: false,
       filterText: "",
       searching: false,
       availablePlatforms: Object.keys(this.props.platforms),
       content: [],
       updating: false,
       creatingPlaylist: false
     }

     this.revibe = new RevibeAPI()

     this._sort = this._sort.bind(this)
     this._format = this._format.bind(this)
     this._addListeners = this._addListeners.bind(this)
     this._removeListeners = this._removeListeners.bind(this)
     this.getContent = this.getContent.bind(this)
     this.updateContent = this.updateContent.bind(this)
     this.setFilterText = this.setFilterText.bind(this)
     this.createPlaylist = this.createPlaylist.bind(this)
  }

  async componentDidMount(){
    var filteredData = []
    filteredData = realm.objects('Playlist')
    filteredData = Object.keys(filteredData).map(x => filteredData[x])
    filteredData = this._sort(filteredData)
    this.setState({content: this._format(filteredData)})
    setTimeout(() => this.updateContent(), 500)
    setTimeout(() => this._addListeners(), 500)
  }

  componentWillUnmount() {
    this._removeListeners()
  }

  async componentDidUpdate(prevProps, prevState) {
    if(this.state.filterText !== prevState.filterText) {
      this.updateContent()
    }
    if(this.state.sortBy !== prevState.sortBy) {
      this.updateContent()
    }
  }

  _addListeners(platforms=[]) {
    var playlists = realm.objects('Playlist')
    playlists.addListener(this.getContent)
  }

  _removeListeners() {
    var playlists = realm.objects('Playlist')
    playlists.removeListener(this.getContent)
  }

  _sort(data) {
    var sortedData = [...data]
    if(this.state.sortBy === "dateCreated") {
      sortedData.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated))
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
    return JSON.parse(JSON.stringify(data.map(x => x)))
  }

  getContent(libraries, changes) {
    if(changes) {
      console.log(changes);
      if(!this.state.updating) {
        // because events fire mutliple times for the same event must only allow to update once
        this.setState({updating: true})
        this.updateContent()
        this.setState({updating: false})
      }
    }
  }

  updateContent() {
    var filteredData = []
    filteredData = realm.objects('Playlist')
    filteredData = Object.keys(filteredData).map(x => filteredData[x])
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

  createPlaylist(name) {
    this.setState({creatingPlaylist: false})
    this.revibe.createPlaylist(name)
    this.forceUpdate()
  }


  render() {
    return (
      <>
      <Container showBackButton={true} title="Playlists" scrollable={false}>
        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-evenly"}}>
        <View style={{width: this.state.searching ? wp("90%") : wp("80%")}}>
        <SearchBar
          placeholder={`Search Playlists`}
          onFocus={() => this.setState({searching: true})}
          onDelete={() => this.setFilterText("") }
          onChangeText={this.setFilterText}
          onCancel={() => {
            this.setState({searching: false})
            this.setFilterText("")
          }}
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

          <ListItem noBorder style={styles.listItem}>
            <TouchableOpacity onPress={() => this.setState({creatingPlaylist: true})}>
              <View style={{flexDirection: "row"}}>
                <View style={{width: hp("6"), height: hp("6"), backgroundColor: "grey", justifyContent: "center", alignItems: "center"}}>
                  <Icon type="MaterialCommunityIcons" name="plus" style={{fontSize: hp("4"), color: "white"}} />
                </View>
                <View style={styles.textContainer}>
                   <Text style={[styles.mainText,{color:"white", marginLeft: wp("3")}]} numberOfLines={1}>Create New Playlist</Text>
                 </View>
               </View>
            </TouchableOpacity>
          </ListItem>
          <List
            data={this.state.content}
            type="Playlists"
            displayLogo={true}
            isLocal={true}
            allowRefresh={!this.state.filtering}
            onRefresh={() => console.log("Refreshing!")}
            noDataText={this.state.filtering ? "No Results." : "Uh oh its empty."}
            source="Library"
            navigation={this.props.navigation}
          />

      <OptionsMenu navigation={this.props.navigation} />
      </Container>

      <FilterModal
        isVisible={this.state.showFilterModal}
        onClose={() => this.setState({showFilterModal: false})}
        onSortByChange={(method) => this.setState({sortBy: method})}
        onPlatformChange={(platforms) => this.setState({availablePlatforms: platforms})}
      />

      <DialogInput isDialogVisible={this.state.isDialogVisible}
        isDialogVisible={this.state.creatingPlaylist}
        title="Name this playlist"
        hintInput ="Playlist name"
        submitText="Create"
        submitInput={ (inputText) => {this.createPlaylist(inputText)} }
        closeDialog={ () => {this.setState({creatingPlaylist: false})}}>
      </DialogInput>

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
