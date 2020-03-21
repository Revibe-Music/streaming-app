import React, { PureComponent } from 'react';
import { View, TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback, Image,ScrollView } from "react-native";
import { Container, Content, Button, Text, Icon, ListItem } from "native-base";
import PropTypes from 'prop-types';
import Modal from "react-native-modal";
import ImageLoad from 'react-native-image-placeholder';
import { BlurView } from "@react-native-community/blur";
import { connect } from 'react-redux';
import { compact } from 'lodash';
import AnimatedPopover from './../animatedPopover/index';
import { getPlatform } from './../../api/utils';
import { addToQueue } from './../../redux/audio/actions';
import { selectSong, goToAlbum, goToArtist } from './../../redux/navigation/actions'

import styles from "./styles";


class OptionsMenu extends PureComponent {

  constructor(props) {
     super(props);
     this.state = {
       songSaved: false,
       saving:false,
       deleting: false,
       addingToQueue: false,
       displayArtists: false,
     }

     this.closeOptionsMenu = this.closeOptionsMenu.bind(this);
     this.songInLibrary = this.songInLibrary.bind(this);
     this.addSongToLibrary = this.addSongToLibrary.bind(this);
     this.removeSongFromLibrary = this.removeSongFromLibrary.bind(this);
     this.addSongToQueue = this.addSongToQueue.bind(this);
     this.goToArtist = this.goToArtist.bind(this);
     this.goToAlbum = this.goToAlbum.bind(this);
     this.displayArtists = this.displayArtists.bind(this);

   }

   closeOptionsMenu() {
     this.props.selectSong(null)
     this.setState({displayArtists: false})
   }

   songInLibrary() {
     // check if object is already saved to determine to show "Add" or "Remove"
     if(this.props.song) {
       var platform = getPlatform(this.props.song.platform)
       return platform.library.songIsSaved(this.props.song)
       // return platform.library.allSongs.filter(x => x.id === this.props.song.id).length > 0
     }
     return false
   }

   addSongToLibrary() {
     this.setState({ saving: true })
     var platform = getPlatform(this.props.song.platform)
     platform.addSongToLibrary(this.props.song)
     this.setState({ songSaved: true })
     setTimeout(() => {
       this.setState({ saving: false })
     }, 1300)
   }

   removeSongFromLibrary() {
     this.setState({ deleting: true })
     var platform = getPlatform(this.props.song.platform)
     platform.removeSongFromLibrary(this.props.song.id)
     this.setState({ songSaved: false })
     setTimeout(() => {
       this.setState({ deleting: false })
     }, 1300)
   }

   addSongToQueue() {
     this.setState({ addingToQueue: true })
     this.props.addToQueue(this.props.song)
     setTimeout(() => {
       this.setState({ addingToQueue: false })
     }, 1300)
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
    for(var x=0; x<this.props.song.album.images.length; x++) {
      if(this.props.song.album.images[x].height < 1000) {
        if(this.props.song.album.images[x].height > size) {
          size = this.props.song.album.images[x].height
          index = x
        }
      }
    }
    return this.props.song.album.images[index].url
  }

  render() {
    if(!this.props.song) {
      return null
    }
    return (

    <Modal
      animationType="slide"
      transparent
      visible={true}
      onSwipeComplete={this.closeOptionsMenu}
      supportedOrientations={["portrait"]}
      style={{margin: 0, padding: 0}}
    >
      <BlurView
        style={styles.optionContainer}
        blurType="dark"
        blurAmount={20}
      >
        <AnimatedPopover type="Save" show={this.state.saving} text="Saving..."/>
        <AnimatedPopover type="Delete" show={this.state.deleting} text="Deleting..." />
        <AnimatedPopover type="Queue" show={this.state.addingToQueue} text="Queuing..." />
          <TouchableOpacity
            style={styles.closeButtonContainer}
            onPress={() => this.closeOptionsMenu()}
           >
           <Icon transparent={false} name="md-close" style={styles.closeButtonIcon}/>
          </TouchableOpacity>
          <View>
          {this.state.displayArtists ?
            null
          :
            <>
            <ScrollView alwaysBounceVertical={false} showsVerticalScrollIndicator={false}>
            <View style={styles.detailsContainer}>
              <ImageLoad
                  isShowActivity={false}
                  style={styles.image}
                  placeholderStyle={styles.image}
                  source={{uri: this.getImage()}}
                  placeholderSource={require("./../../../assets/albumArtPlaceholder.png")}
              />
              <Text style={styles.mainText}>{this.props.song.name}</Text>
              <Text style={styles.noteText}>{this.setArtist()}</Text>
            </View>
              <ListItem style={{borderBottomWidth:0}}>
              {this.songInLibrary() ?
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

              <ListItem style={{borderBottomWidth:0}}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={this.addSongToQueue}
                style={{flexDirection: 'row'}}
              >
                <Icon style={styles.actionItemIcon} type="MaterialCommunityIcons" name="playlist-plus" />
                <Text style={styles.actionItemText}> Add to queue</Text>
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
                <ListItem style={{borderBottomWidth:0}}>
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
              </ScrollView >
            </>
          }
          </View>
          {this.state.displayArtists ?
            <View style={styles.selectArtistContainer}>
            <Text style={{marginLeft: "5%",color: "white"}}> Select an artist:</Text>
            <View style={styles.selectArtistScrollview}>
              <ScrollView>
                {this.displayArtists()}
              </ScrollView>
              </View>

                <Button style={styles.selectArtistCancelButton}
                block
                onPress={() => this.setState({displayArtists: false}) }
                >
                  <Text style={styles.selectArtistCancelText}>Cancel</Text>
                </Button>
            </View>
          :
            null
          }
          </BlurView>
      </Modal>
    )
  }
}

function mapStateToProps(state) {
  return {
    song: state.naviationState.selectedSong,
  }
};

const mapDispatchToProps = dispatch => ({
    addToQueue: (object, platform) => dispatch(addToQueue(object, platform)),
    selectSong: (song) => dispatch(selectSong(song)),
    goToArtist: (artist) => dispatch(goToArtist(artist)),
    goToAlbum: (album) => dispatch(goToAlbum(album)),
});

export default connect(mapStateToProps, mapDispatchToProps)(OptionsMenu)
