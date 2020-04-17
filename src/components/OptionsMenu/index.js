import React, { PureComponent } from 'react';
import { View, TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback, Image,ScrollView, Alert } from "react-native";
import { Container, Content, Button, Text, Icon, ListItem } from "native-base";
import PropTypes from 'prop-types';
import Modal from "react-native-modal";
import ImageLoad from 'react-native-image-placeholder';
import { BlurView } from "@react-native-community/blur";
import { connect } from 'react-redux';
import { compact } from 'lodash';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import RevibeAPI from './../../api/revibe';
import FastImage from "./../images/fastImage";
import AnimatedPopover from './../animatedPopover/index';
import PlaylistItem from "./../../components/listItems/playlistItem";

import { getPlatform } from './../../api/utils';
import { addToQueue, addToPlayNext } from './../../redux/audio/actions';
import { selectSong, goToAlbum, goToArtist } from './../../redux/navigation/actions'
import { logEvent } from './../../amplitude/amplitude';

import realm from './../../realm/realm';

import styles from "./styles";


class OptionsMenu extends PureComponent {

  constructor(props) {
     super(props);
     this.revibe = new RevibeAPI()
     this.state = {
       addingToLibrary:false,
       removingFromLibrary: false,
       addingToPlaylist:false,
       removingFromPlaylist: false,
       addingToQueue: false,
       addingToPlayNext: false,
       displayArtists: false,
       displayPlaylists: false,
       songInPlaylist: false
     }

     this.closeOptionsMenu = this.closeOptionsMenu.bind(this);
     this.songInLibrary = this.songInLibrary.bind(this);
     this.songInPlaylist = this.songInPlaylist.bind(this);
     this.addSongToLibrary = this.addSongToLibrary.bind(this);
     this.removeSongFromLibrary = this.removeSongFromLibrary.bind(this);
     this.addSongToPlaylist = this.addSongToPlaylist.bind(this);
     this.removeSongFromPlaylist = this.removeSongFromPlaylist.bind(this);
     this.addSongToQueue = this.addSongToQueue.bind(this);
     this.addSongToPlayNext = this.addSongToPlayNext.bind(this);
     this.goToArtist = this.goToArtist.bind(this);
     this.goToAlbum = this.goToAlbum.bind(this);
     this.displayArtists = this.displayArtists.bind(this);
   }

   componentDidUpdate(prevProps) {
     if(!prevProps.song && this.props.song) {
       // first song to be selected, so must check if in playlist
       this.setState({songInPlaylist: this.songInPlaylist()})
     }
     else if(prevProps.song && this.props.song) {
       if(prevProps.song.id !== this.props.song.id) {
         // > 1 songs have been selected already, so must check if in playlist
         this.setState({songInPlaylist: this.songInPlaylist()})
       }
     }
   }

   closeOptionsMenu(timeout=null) {
     if(timeout === null) {
       this.props.selectSong(null)
       this.setState({displayArtists: false, displayPlaylists: false, playlist: null})
     }
     else {
       setTimeout(() => {
         this.props.selectSong(null)
         this.setState({displayArtists: false,displayPlaylists: false, playlist: null})
       }, timeout)

     }
   }

   songInLibrary() {
     // check if object is already saved to determine to show "Add" or "Remove"
     if(this.props.song) {
       var platform = getPlatform(this.props.song.platform)
       return platform.library.songIsSaved(this.props.song)
     }
     return false
   }

   songInPlaylist() {
     // check if object is already saved to determine to show "Add" or "Remove"
     if(this.props.currentPage === "Playlist") {
       if(this.props.selectedPlaylist) {
         if(this.props.selectedPlaylist.curated) {
           return false
         }
       }
       if(this.props.song) {
         var playlist = this.revibe.playlists.filtered(`id = "${this.props.selectedPlaylist.id}"`)["0"]
         return playlist.songIsSaved(this.props.song)
       }
     }
     return false
   }

   addSongToLibrary() {
     this.setState({ addingToLibrary: true })
     var platform = getPlatform(this.props.song.platform)
     platform.addSongToLibrary(this.props.song)
     setTimeout(() => this.setState({ addingToLibrary: false }), 1000)
     this.closeOptionsMenu(1500)
     logEvent("Library", "Add Song", {"Platform": this.props.song.platform, "ID": this.props.song.id})
   }

   removeSongFromLibrary() {
     this.setState({ removingFromLibrary: true })
     var platform = getPlatform(this.props.song.platform)
     platform.removeSongFromLibrary(this.props.song.id)
     setTimeout(() => this.setState({ removingFromLibrary: false }), 1000)
     this.closeOptionsMenu(1500)
     logEvent("Library", "Add Song", {"Platform": this.props.song.platform, "ID": this.props.song.id})
   }

   addSongToPlaylist(playlist) {
     var playlist = this.revibe.playlists.filtered(`id = "${playlist.id}"`)["0"]
     if(playlist.songIsSaved(this.props.song)) {
       Alert.alert(
         'This song is already in this playlist.',
         '',
         [
           {text: 'OK', onPress: () => console.log('OK Pressed')},
         ],
         {cancelable: false},
       );
     }
     else {
       this.setState({ addingToPlaylist: true,  playlist: playlist.name})
       this.revibe.addSongToPlaylist(this.props.song, playlist.id)
       setTimeout(() => this.setState({ addingToPlaylist: false}), 1000)
       this.closeOptionsMenu(1500)
       logEvent("Playlist", "Add Song", {"Platform": this.props.song.platform, "ID": this.props.song.id, "Playlist ID": playlist.id})
     }
   }

   removeSongFromPlaylist() {
     this.setState({ removingFromPlaylist: true, playlist: this.props.selectedPlaylist.name })
     this.revibe.removeSongFromPlaylist(this.props.song.id, this.props.selectedPlaylist.id)
     setTimeout(() => this.setState({ removingFromPlaylist: false}), 1000)
     this.closeOptionsMenu(1500)
     logEvent("Playlist", "Delete Song", {"Platform": this.props.song.platform, "ID": this.props.song.id, "Playlist ID": this.props.selectedPlaylist.id})
   }

   addSongToQueue() {
     this.setState({ addingToQueue: true })
     this.props.addToQueue(this.props.song)
     setTimeout(() => this.setState({ addingToQueue: false }), 1200)
     this.closeOptionsMenu(1500)
   }

   addSongToPlayNext() {
     this.setState({ addingToPlayNext: true })
     this.props.addToPlayNext(this.props.song)
     setTimeout(() => this.setState({ addingToPlayNext: false }), 1000)
     this.closeOptionsMenu(1500)
   }

   setArtist() {
     if(this.state.displayArtists) {
       return null
     }
     const song = this.props.song
     var contributors = Object.keys(this.props.song.contributors).map(x => this.props.song.contributors[x])
     var contributorString = compact(contributors.map(function(x) {if(x.type === "Artist") return x.artist.name})).join(', ')
     if(this.props.displayType) {
        contributorString = `Song • ${contributorString}`
     }
     return contributorString
   }

   displayArtists() {
     const contributors = Object.keys(this.props.song.contributors).map(x => this.props.song.contributors[x].artist)
     return (
       contributors.map(artist => (
         <ListItem style={{borderBottomWidth:0}}>
           <TouchableOpacity
             activeOpacity={0.9}
             onPress={() => this.goToArtist(artist)}
             style={{flexDirection: 'row', alignItems: 'center'}}
           >
            <View style={{flex: 1}}>
             <Text style={styles.selectArtistText}> {artist.name}</Text>
            </View>
           </TouchableOpacity>
         </ListItem>
       ))
     )
   }

   displayPlaylists() {
     var playlists = []
     playlists = this.revibe.playlists.filtered('curated == false')
     playlists = JSON.parse(JSON.stringify(playlists.slice()))
     playlists.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated))
     return (
       playlists.map(playlist => (
         <PlaylistItem
          playlist={playlist}
          displayIcon={false}
          iconName="plus"
          preventLiveUpdates={true}
          onPress={() => this.addSongToPlaylist(playlist)}
        />
       ))
     )
   }

   goToArtist(artist=null) {
     if(artist) {
       this.closeOptionsMenu()
       this.props.goToArtist(artist)
       this.setState({displayArtists: false})
     }
     else if(Object.keys(this.props.song.contributors).length > 1) {
       this.setState({displayArtists: true})
     }
     else {
       this.closeOptionsMenu()
       this.props.goToArtist(this.props.song.contributors[0].artist)
       this.setState({displayArtists: false})
     }
   }

  goToAlbum() {
    this.closeOptionsMenu()
    this.props.goToAlbum(this.props.song.album)
  }

  getImage() {
    var size=0
    var index = 0
    var images = Object.keys(this.props.song.album.images).map(x => this.props.song.album.images[x])
    for(var x=0; x<images.length; x++) {
      if(images[x].height < 1000) {
        if(images[x].height > size) {
          size = images[x].height
          index = x
        }
      }
    }
    return images[index].url
  }

  displayLogo() {
    if(this.props.song.platform.toLowerCase() === "spotify") {
      return <Icon type="FontAwesome5" name="spotify" style={[styles.logo, {color: "#1DB954"}]} />
    }
    else if(this.props.song.platform.toLowerCase() === "youtube") {
      return <Icon type="FontAwesome5" name="youtube" style={[styles.logo, {color: "red"}]} />
    }
    else {
      return <Image source={require('./../../../assets/revibe_logo.png')} style={{height: hp("4"), width: hp("4%"), margin: 10, padding: 0}} />
    }
  }

  render() {
    if(!this.props.song) {
      return null
    }
    return (

    <Modal
      animationType="slide"
      transparent
      isVisible={true}
      onSwipeComplete={() => this.closeOptionsMenu()}
      supportedOrientations={["portrait"]}
      style={{margin: 0, padding: 0}}
      swipeDirection="down"
      propagateSwipe={true}
    >
      <BlurView
        style={styles.optionContainer}
        blurType="dark"
        blurAmount={20}
      >
        <AnimatedPopover type="Save" show={this.state.addingToLibrary} text="Added to library"/>
        <AnimatedPopover type="Delete" show={this.state.removingFromLibrary} text="Deleted from library" />
        <AnimatedPopover type="Save" show={this.state.addingToPlaylist} text={`Added to ${this.state.playlist}`}/>
        <AnimatedPopover type="Delete" show={this.state.removingFromPlaylist} text={`Deleted from ${this.state.playlist}`} />
        <AnimatedPopover type="Queue" show={this.state.addingToQueue} text="Queuing..." />
        <AnimatedPopover type="PlayNext" show={this.state.addingToPlayNext} text="Playing next..." />

          <View >
          {this.state.displayArtists || this.state.displayPlaylists?
            null
          :
            <>
            <ScrollView style={{height: hp("90%")}} showsVerticalScrollIndicator={false}>
            <View style={styles.headerContainer}>
              {this.displayLogo()}
            </View>
            <View style={styles.detailsContainer}>
              <FastImage
                style={styles.image} // rounded or na?
                source={{uri: this.getImage()}}
                placeholder={require("./../../../assets/albumArtPlaceholder.png")}
              />
              <Text style={styles.mainText}>{this.props.song.name}</Text>
              <Text style={styles.noteText}>{this.setArtist()}</Text>
            </View>
            <View style={{flexDirection: "row", justifyContent:'center', alignItems: "center"}}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={this.addSongToPlayNext}
                style={{flexDirection: 'column', justifyContent:'center', alignItems: "center",width: "40%"}}
              >
                <Icon style={[styles.topItemIcon, {fontSize: hp("3.5%")}]} type="MaterialIcons" name="playlist-play" />
                <Text style={styles.topItemText}> Play next</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={this.addSongToQueue}
                style={{flexDirection: 'column', justifyContent:'center', alignItems: "center", width: "40%"}}
              >
                <Icon style={[styles.topItemIcon, {fontSize: hp("3%")}]} type="MaterialIcons" name="library-add" />
                <Text style={styles.topItemText}> Add to queue</Text>
              </TouchableOpacity>
            </View>
            <View>
              <ListItem style={{borderBottomWidth:0}}>
              {this.songInLibrary()?
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={this.removeSongFromLibrary}
                  style={{flexDirection: 'row'}}
                >
                  <Icon style={styles.actionItemIcon} type="FontAwesome" name="remove" />
                  <Text style={styles.actionItemText}> Remove from library</Text>
                </TouchableOpacity>
              :
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={this.addSongToLibrary}
                  style={{flexDirection: 'row'}}
                >
                  <Icon style={styles.actionItemIcon} type="FontAwesome" name="plus" />
                  <Text style={styles.actionItemText}> Add to library</Text>
                </TouchableOpacity>
              }
              </ListItem>
              {this.state.songInPlaylist ?
                <ListItem style={{borderBottomWidth:0}}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={this.removeSongFromPlaylist}
                    style={{flexDirection: 'row'}}
                  >
                  <Icon style={[styles.actionItemIcon, {fontSize: hp("2.5%"), marginRight: wp("3%")}]} type="MaterialCommunityIcons" name="playlist-remove" />
                    <Text style={styles.actionItemText}> Remove from this playlist</Text>
                  </TouchableOpacity>
                </ListItem>
              :
                null
              }
              <ListItem style={{borderBottomWidth:0}}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => this.setState({displayPlaylists: true})}
                  style={{flexDirection: 'row'}}
                >
                  <Icon style={[styles.actionItemIcon, {fontSize: hp("2.5%"), marginRight: wp("3%")}]} type="MaterialCommunityIcons" name="playlist-plus" />
                  <Text style={styles.actionItemText}> Add to playlist</Text>
                </TouchableOpacity>
              </ListItem>

              <ListItem style={{borderBottomWidth:0}}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => this.goToArtist()}
                style={{flexDirection: 'row'}}
              >
                {this.props.song.platform !== "YouTube" ?
                  <Icon style={styles.actionItemIcon} type="FontAwesome" name="user" />
                :
                  <Icon style={styles.actionItemIcon} type="MaterialCommunityIcons" name="youtube-tv" />
                }
                <Text style={styles.actionItemText}> {this.props.song.platform === "YouTube" ? "Go to channel" : "Go to artist"}</Text>
              </TouchableOpacity>
              </ListItem>
              {this.props.song.platform !== "YouTube" ?
                <ListItem style={{borderBottomWidth:0, paddingBottom: hp("20")}}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => this.goToAlbum()}
                  style={{flexDirection: 'row'}}
                >
                  <Icon style={styles.actionItemIcon} type="FontAwesome5" name="compact-disc" />
                  <Text style={styles.actionItemText}> Go to album</Text>
                </TouchableOpacity>
                </ListItem>
              :
                null
              }
              </View>
              </ScrollView >
            </>

          }
          </View>
          {this.state.displayArtists ?
            <>
            <View style={styles.libraryHeader}>
              <View style={{flexDirection: "row", alignItems: "center", width: wp("100%")}}>
                <View style={{flexDirection: "row", justifyContent: "flex-start", width: wp("20%"),}}>
                  <Button
                    transparent
                    onPress={() => this.setState({displayArtists: false})}>
                    <Icon name="ios-arrow-back" style={{color:"white", fontSize: 30}}/>
                  </Button>
                </View>
                <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center",width: wp("60%")}}>
                  <Text style={[styles.pageTitle, {fontSize: hp("2.5%"), paddingLeft: 0}]}>Select Artist</Text>
                </View>
              </View>
            </View>

            <View style={styles.selectArtistContainer}>
              <View style={styles.selectArtistScrollview}>
                <ScrollView>
                  {this.displayArtists()}
                </ScrollView>
              </View>
            </View>
            </>
          :
            null
          }
          {this.state.displayPlaylists ?
            <>
            <View style={styles.libraryHeader}>
              <View style={{flexDirection: "row", alignItems: "center", width: wp("100%")}}>
                <View style={{flexDirection: "row", justifyContent: "flex-start", width: wp("20%"),}}>
                  <Button
                    transparent
                    onPress={() => this.setState({displayPlaylists: false})}>
                    <Icon name="ios-arrow-back" style={{color:"white", fontSize: 30}}/>
                  </Button>
                </View>
                <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center",width: wp("60%")}}>
                  <Text style={[styles.pageTitle, {fontSize: hp("2.5%"), paddingLeft: 0}]}>Select Playlist</Text>
                </View>
              </View>
            </View>
            <View style={styles.selectArtistContainer}>
              <View style={styles.selectPlaylistScrollview}>
                <ScrollView>
                  {this.displayPlaylists()}
                </ScrollView>
              </View>
            </View>
            </>
          :
            null
          }
            <Button style={styles.filterCancelButton}
            block
            onPress={() => this.closeOptionsMenu() }
            >
              <Text style={styles.filterCancelText}>Close</Text>
            </Button>
        </BlurView>
      </Modal>
    )
  }
}

function mapStateToProps(state) {
  return {
    song: state.navigationState.selectedSong,
    currentPage: state.navigationState.currentPage,
    selectedPlaylist: state.navigationState.selectedPlaylist,
  }
};

const mapDispatchToProps = dispatch => ({
    addToQueue: (object) => dispatch(addToQueue(object)),
    addToPlayNext: (object) => dispatch(addToPlayNext(object)),
    selectSong: (song) => dispatch(selectSong(song)),
    goToArtist: (artist) => dispatch(goToArtist(artist)),
    goToAlbum: (album) => dispatch(goToAlbum(album)),
});

export default connect(mapStateToProps, mapDispatchToProps)(OptionsMenu)
