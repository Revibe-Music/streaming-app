/*
* All accounts that require authentication will be tested to ensure
* the user has signed in before rendering the account tabs and all
* public platform tabs (YouTube) will automatically render
*/
import React, { Component } from "react";
import { TouchableOpacity, View, Text, ScrollView, FlatList } from 'react-native'
import {  Button, ListItem , Icon} from "native-base";
import { CheckBox } from 'react-native-elements'
import Modal from "react-native-modal";
import DialogInput from 'react-native-dialog-input';
import { BarIndicator } from 'react-native-indicators';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { uniqBy } from 'lodash'
import { connect } from 'react-redux';


import { shuffleSongs } from '../../../redux/audio/actions'
import { logEvent } from '../../../amplitude/amplitude';
import RevibeAPI from '../../../api/revibe'
import SpotifyAPI from '../../../api/spotify'
import Container from "../../../components/containers/container";
import PlaylistItem from "../../../components/listItems/playlistItem";
import SearchBar from "../../../components/searchBar/index";
import List from "../../../components/lists/List";
import FilterModal from "../../../components/modals/filterModal";
import AnimatedPopover from "../../../components/animatedPopover/index";
import styles from "../styles";
import realm from '../../../realm/realm';


class PlaylistContent extends Component {

  constructor(props) {
     super(props);

     this.state = {
       sortBy: "dateCreated",
       showFilterModal: false,
       filterText: "",
       searching: false,
       availablePlatforms: Object.keys(this.props.platforms),
       content: [],
       updating: true,
       loading: false,
       creatingPlaylist: false,
       showPlaylistNameDialog: false,
       selectingPlaylists: false,
       availablePlaylists: [],
       selectedPlaylist: {name: "", id: ""},
       editting: false,
       edittedPlaylists: []
     }

     this.revibe = new RevibeAPI()
     this.spotify = Object.keys(this.props.platforms).includes("Spotify") ? new SpotifyAPI() : null

     this._sort = this._sort.bind(this)
     this._format = this._format.bind(this)
     this._addListeners = this._addListeners.bind(this)
     this._removeListeners = this._removeListeners.bind(this)
     this.getContent = this.getContent.bind(this)
     this.updateContent = this.updateContent.bind(this)
     this.setFilterText = this.setFilterText.bind(this)
     this.createPlaylist = this.createPlaylist.bind(this)
     this.toggleEdit = this.toggleEdit.bind(this)
     this.selectPlaylist = this.selectPlaylist.bind(this)
     this.deletePlaylists = this.deletePlaylists.bind(this)
  }

  async componentDidMount() {
    // var curatedPlaylists = this.revibe.fetchCuratedPlaylists()
    var filteredData = []
    filteredData = realm.objects('Playlist')
    filteredData = Object.keys(filteredData).map(x => filteredData[x])
    filteredData = this._sort(filteredData)
    this.setState({content: this._format(filteredData)})
    setTimeout(() => this.updateContent(), 500)
    setTimeout(() => this._addListeners(), 500)
    setTimeout(() => this.setState({updating: false}), 1000)
    // curatedPlaylists = await curatedPlaylists
    // console.log(curatedPlaylists);
  }

  componentWillUnmount() {
    this._removeListeners()
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.state.filterText !== prevState.filterText) {
      this.updateContent()
    }
    if(this.state.sortBy !== prevState.sortBy) {
      this.updateContent()
    }
  }

  _addListeners(platforms=[]) {
    this.revibe.playlists.addListener(this.getContent)
  }

  _removeListeners() {
    this.revibe.playlists.removeListener(this.getContent)
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
    if(changes.deletions.length > 0 || changes.insertions.length > 0) {
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
    filteredData = this.revibe.playlists
    if(this.state.filterText) {
      filteredData = filteredData.filtered(`name BEGINSWITH[c] "${this.state.filterText}" OR name CONTAINS[c] "${this.state.filterText}"`)
    }
    filteredData = JSON.parse(JSON.stringify(Object.keys(filteredData).map(x => filteredData[x])))
    filteredData = this._sort(filteredData)
    this.setState({content: this._format(filteredData)})
  }

  setFilterText(text) {
    if(text !== "") {
      this.setState({filterText: text})
    }
    else {
      this.setState({filterText: text})
    }
  }

  async fetchAvailablePlaylists() {
    this.setState({selectingPlaylists: true, })
    var playlists = await this.spotify.fetchAllPlaylists()
    this.setState({availablePlaylists: playlists})
    // this.setState({creatingPlaylist: false, showPlaylistNameDialog: false})
  }

  async createPlaylist(name) {
    await this.setState({creatingPlaylist: false, showPlaylistNameDialog: false})
    var newPlaylist = await this.revibe.createPlaylist(name)
    this.setState({loading: true})
    if(this.state.selectedPlaylist.id) {
      var playlistSongs = await this.spotify.fetchPlaylistSongs(this.state.selectedPlaylist.id)
      await this.revibe.batchAddSongsToPlaylist(playlistSongs, newPlaylist.id)
      logEvent("Playlist", "Create", {"Imported": true, "Source": "Spotify"})
    }
    else {
      logEvent("Playlist", "Create", {"Imported": false})
    }
    this.setState({availablePlaylists: [], selectingPlaylists: false, loading: false})
  }

  toggleEdit() {
    this.setState({editting: !this.state.editting, edittedPlaylists: []})
  }

  selectPlaylist(playlist) {
    if(this.state.edittedPlaylists.filter(x => x.id === playlist.id).length > 0) {
      var newEdittedPlaylists = [...this.state.edittedPlaylists]
      var index = newEdittedPlaylists.map(function(e) { return e.id; }).indexOf(playlist.id);
      newEdittedPlaylists.splice(index, 1);
      this.setState({edittedPlaylists: newEdittedPlaylists})
    }
    else {
      this.setState({edittedPlaylists: [...this.state.edittedPlaylists, playlist]})
    }
  }

  async deletePlaylists() {
    await this.setState({loading: true})
    var playlistDeletions = []
    for(var x=0; x<this.state.edittedPlaylists.length; x++) {
      playlistDeletions.push(this.revibe.deletePlaylist(this.state.edittedPlaylists[x].id))
      logEvent("Playlist", "Delete")
    }
    await Promise.all(playlistDeletions)
    this.updateContent()
    this.toggleEdit()
    this.setState({loading: false})
  }

  render() {
    if(this.state.editting) {
      var headerIcon = (
        <Button style={styles.playListCancelButton} onPress={this.toggleEdit}>
          <Text style={styles.filterTextLarge}> Cancel </Text>
        </Button>
      )
    }
    else {
      var headerIcon = (
        <Button transparent onPress={this.toggleEdit}>
          <Icon type="MaterialCommunityIcons" name="format-list-checkbox" style={{color:"white", fontSize: 30}} />
        </Button>
      )
    }

    return (
      <>
      <Container
        showBackButton={true}
        title="Playlists"
        scrollable={false}
        headerIcon={headerIcon}
      >
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
            <TouchableOpacity
              onPress={() => {
                if(this.state.editting) {
                  this.deletePlaylists()
                }
                else {
                  this.setState({creatingPlaylist: true})
                }
              }}
              disabled={this.state.editting && this.state.edittedPlaylists.length < 1}
            >
              <View style={[{flexDirection: "row"}, this.state.editting && this.state.edittedPlaylists.length < 1 ? {opacity: .4} : {}]}>
                <View style={[{width: hp("7"), height: hp("7"),justifyContent: "center", alignItems: "center"}, this.state.editting ?{backgroundColor: "red"} :{backgroundColor: "grey"}] }>
                  <Icon type="MaterialCommunityIcons" name={this.state.editting ? "delete-forever" : "plus"} style={{fontSize: hp("4"), color: "white"}} />
                </View>
                <View style={styles.textContainer}>
                   <Text style={[styles.mainText,{color:"white", marginLeft: wp("3")}]} numberOfLines={1}>{this.state.editting ? "Delete Playlists" : "Create Playlist"}</Text>
                 </View>
               </View>
            </TouchableOpacity>
          </ListItem>
          <FlatList
            data={this.state.content}
            renderItem={({ item }) => (
              <PlaylistItem
                playlist={item}
                edittedPlaylists={this.state.edittedPlaylists}
                editting={this.state.editting}
                onPress={this.state.editting ? this.selectPlaylist : null}
              />
            )}
            keyExtractor={item => item.id}
          />

      </Container>
      <AnimatedPopover type="Loading" show={this.state.loading} />
      {Object.keys(this.props.platforms).includes("Spotify") ?
        <Modal
          isVisible={this.state.creatingPlaylist}
          hasBackdrop={false}
          deviceWidth={wp("100")}
          style={{justifyContent: 'flex-end',margin: 0, padding: 0}}
          >

          <DialogInput
            isDialogVisible={this.state.showPlaylistNameDialog}
            title="Name this playlist"
            hintInput ="Playlist name"
            initValueTextInput={this.state.selectedPlaylist.name}
            submitText="Create"
            submitInput={ (inputText) => {this.createPlaylist(inputText)} }
            closeDialog={ () => {this.setState({showPlaylistNameDialog: false,})}}>
          </DialogInput>

          <View style={{backgroundColor: '#202020', height: "70%", width: "100%", borderRadius: 25}}>
            <View style={{marginTop: hp("3%"), justifyContent: "center",alignItems: "center"}}>
              {!this.state.selectingPlaylists ?
                <>
                <Text style={{marginBottom: hp("10%"), textAlign: "center",fontSize: hp("3.5%"),color: "white",}}>Let's Get Started</Text>
                <Button
                  style={{width: wp('45%'),height: hp('5%'),backgroundColor: "#7248BD",justifyContent: "center",alignItems:"center"}}
                  onPress={async () => {
                    this.setState({showPlaylistNameDialog: true})
                  }}
                >
                  <Text style={{fontSize: hp("2%"),color: 'white',textAlign: "center",paddingLeft: 0,paddingRight: 0,}}> Start New Playlist</Text>
                </Button>
                <Text style={{marginTop: hp("8%"),marginBottom: hp("8%"), textAlign: "center",fontSize: hp("2%"),color: "white",}}>━━━━━━━ OR ━━━━━━━</Text>
                <Button
                  style={{width: wp('45%'),height: hp('5%'),backgroundColor: "green",justifyContent: "center",alignItems:"center"}}
                  onPress={() => this.fetchAvailablePlaylists()}
                >
                  <Text style={{fontSize: hp("2%"),color: 'white',textAlign: "center",paddingLeft: 0,paddingRight: 0,}}> Import From Spotify</Text>
                </Button>
                </>
              :
                <View>
                <Text style={{marginBottom: hp("5%"), textAlign: "center",fontSize: hp("3.5%"),color: "white",}}>Select A Playlist</Text>
                {this.state.availablePlaylists.length > 0 ?
                  <ScrollView showsVerticalScrollIndicator={false}>
                  {this.state.availablePlaylists.map(playlist => (
                    <ListItem noBorder style={styles.listItem}>
                      <TouchableOpacity onPress={() => this.setState({showPlaylistNameDialog: true, selectedPlaylist: playlist})}>
                        <View style={styles.textContainer}>
                           <Text style={[styles.mainText,{color:"white", marginLeft: wp("3")}]} numberOfLines={1}>{playlist.name}</Text>
                        </View>
                      </TouchableOpacity>
                    </ListItem>
                  ))}
                  </ScrollView>
                :
                  <BarIndicator
                    animationDuration={700}
                    color='#7248bd'
                    count={5}
                  />
                }
                </View>
              }

              </View>
            <Button style={{marginLeft: 0,width: wp('80%'),height: hp('5%'),backgroundColor: "transparent",alignSelf: 'center',position: "absolute",bottom: hp("3%"),}}
            block
            onPress={() => this.setState({creatingPlaylist: false, selectingPlaylists: false, availablePlaylists: [], showPlaylistNameDialog: false, selectedPlaylist: {name: "", id: ""}}) }
            >
              <Text style={{fontSize: hp("2.5%"),color: "white",}}>Close</Text>
            </Button>
          </View>
        </Modal>
      :
        <DialogInput
          isDialogVisible={this.state.creatingPlaylist}
          title="Name this playlist"
          hintInput ="Playlist name"
          submitText="Create"
          submitInput={ (inputText) => {this.createPlaylist(inputText)}}
          closeDialog={ () => {this.setState({creatingPlaylist: false,showPlaylistNameDialog: false,})}}>
        </DialogInput>
      }

      <FilterModal
        isVisible={this.state.showFilterModal}
        onClose={() => this.setState({showFilterModal: false})}
        sortOptions={["dateCreated", "alphabetically"]}
        displayPlatforms={false}
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


export default connect(mapStateToProps, mapDispatchToProps)(PlaylistContent)
