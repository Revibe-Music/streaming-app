import React, { PureComponent } from 'react';
import { View, TouchableOpacity, Modal, Image } from "react-native";
import { Container, Content, Button, Text, Icon, ListItem } from "native-base";
import PropTypes from 'prop-types';
import ImageLoad from 'react-native-image-placeholder';
import { connect } from 'react-redux';
import { compact } from 'lodash';
import AnimatedPopover from './../animatedPopover/index';
import { getPlatform } from './../../api/utils';
import { addToQueue } from './../../redux/audio/actions';
import { selectSong } from './../../redux/navigation/actions'

import styles from "./styles";


class OptionsMenu extends PureComponent {

  constructor(props) {
     super(props);
     this.state = {
       songSaved: false,
       saving:false,
       deleting: false,
       addingToQueue: false,
     }

     this.closeOptionsMenu = this.closeOptionsMenu.bind(this);
     this.songInLibrary = this.songInLibrary.bind(this);
     this.addSongToLibrary = this.addSongToLibrary.bind(this);
     this.removeSongFromLibrary = this.removeSongFromLibrary.bind(this);
     this.addSongToQueue = this.addSongToQueue.bind(this);
     this.goToArtist = this.goToArtist.bind(this);
     this.goToAlbum = this.goToAlbum.bind(this);

   }

   closeOptionsMenu() {
     this.props.selectSong(null)
   }

   songInLibrary() {
     // check if object is already saved to determine to show "Add" or "Remove"
     if(this.props.song) {
       var platform = getPlatform(this.props.song.platform)
       return platform.library.allSongs.filter(x => x.id === this.props.song.id).length > 0
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
     platform.removeFromLibrary(this.props.song.id)
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

  goToArtist() {
    this.closeOptionsMenu()
    this.props.navigation.navigate(
      {
        key: "Artist",
        routeName: "Artist",
        params:{
          artist: this.props.song.contributors[0].artist,
        }
      }
    )
  }

  goToAlbum() {
    this.closeOptionsMenu()
    var album = this.props.song.platform === "YouTube" ? this.props.song.contributors[0].artist : this.props.song.album
    this.props.navigation.navigate(
      {
        key: "Album",
        routeName: "Album",
        params: {
          album: album,
          songs: [],
        }
      })
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
      hardwareAccelerated={true}
      supportedOrientations={["portrait"]}
    >
        <View style={styles.optionContainer} />
        <AnimatedPopover type="Save" show={this.state.saving} text="Saving..."/>
        <AnimatedPopover type="Delete" show={this.state.deleting} text="Deleting..." />
        <AnimatedPopover type="Queue" show={this.state.addingToQueue} text="Queuing..." />
        <Content scrollEnabled={false}>
          <Button style={styles.closeButton} transparent onPress={() => this.closeOptionsMenu()}>
            <Icon transparent={false} name="md-close" style={styles.closeButtonIcon}/>
          </Button>
          <View style={styles.detailsContainer}>
            <ImageLoad
                isShowActivity={false}
                style={styles.image}
                placeholderStyle={styles.image}
                source={{uri: this.props.song.album.mediumImage ? this.props.song.album.mediumImage : this.props.song.album.images[2].url}}
                placeholderSource={require("./../../../assets/albumArtPlaceholder.png")}
            />
            <Text style={styles.mainText}>{this.props.song.name}</Text>
            <Text style={styles.noteText}>{this.contributorString}</Text>
          </View>

          <View>
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
          {this.props.song.platform !== "YouTube" ?
            <ListItem style={{borderBottomWidth:0}}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => this.goToArtist()}
              style={{flexDirection: 'row'}}
            >
              <Icon style={styles.actionItemIcon} type="FontAwesome" name="user" />
              <Text style={styles.actionItemText}> Go to artist</Text>
            </TouchableOpacity>
            </ListItem>
          :
            null
          }
          <ListItem style={{borderBottomWidth:0}}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => this.goToAlbum()}
            style={{flexDirection: 'row'}}
          >
          {this.props.song.platform !== "YouTube" ?
            <Icon style={styles.actionItemIcon} type="FontAwesome5" name="compact-disc" />
          :
            <Icon style={styles.actionItemIcon} type="MaterialCommunityIcons" name="youtube-tv" />
          }
            <Text style={styles.actionItemText}> {this.props.song.platform === "YouTube" ? "Go To Channel" : "Go To Album"}</Text>
          </TouchableOpacity>
          </ListItem>
          </View>

        </Content>
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
});

export default connect(mapStateToProps, mapDispatchToProps)(OptionsMenu)
