import React, { PureComponent } from 'react';
import { View, TouchableOpacity, Modal, Image } from "react-native";
import { Container, Content, Button, Text, Icon, ListItem } from "native-base";
import ImageLoad from 'react-native-image-placeholder';
import { connect } from 'react-redux';
import Save from './../save/index';
import Delete from './../delete/index';
import AddToQueue from './../addToQueue/index';
import { removePlatformSong, savePlatformSong } from './../../redux/platform/actions';
import { addToQueue } from './../../redux/audio/actions';

import styles from "./styles";


class SongOptions extends PureComponent {

  static navigationOptions = {
    header: null
  };

  constructor(props) {
     super(props);
     this.state = {songSaved: this.songIsSaved(),
                   saving:false,
                   deleting: false,
                   addingToQueue: false,
                  }
     this.songIsSaved = this.songIsSaved.bind(this);
     this.saveSong = this.saveSong.bind(this);
     this.removeSong = this.removeSong.bind(this);
     this.addSongToQueue = this.addSongToQueue.bind(this);
   }

   songIsSaved() {
     return this.props.navigation.state.params.platform.getLibrary().filter(x => x.id === this.props.navigation.state.params.song.id).length > 0
   }

   saveSong() {
     this.setState({ saving: true })
     this.props.savePlatformSong(this.props.navigation.state.params.platform.name, this.props.navigation.state.params.song)
     this.setState({ songSaved: true })
     setTimeout(() => {
       this.setState({ saving: false })
     }, 1300)

   }

   removeSong() {
     this.setState({ deleting: true })
     this.props.removePlatformSong(this.props.navigation.state.params.platform.name, this.props.navigation.state.params.song)
     this.setState({ songSaved: false })
     setTimeout(() => {
       this.setState({ deleting: false })
     }, 1300)
   }

   addSongToQueue() {
     this.setState({ addingToQueue: true })
     this.props.addToQueue(this.props.navigation.state.params.song,this.props.navigation.state.params.platform.name)
     setTimeout(() => {
       this.setState({ addingToQueue: false })
     }, 1300)
   }

  goToArtist() {
    this.props.navigation.navigate(
      {
        key: "Artist",
        routeName: "Artist",
        params:{artist: this.props.navigation.state.params.song.Artist,
                platform: this.props.navigation.state.params.platform,
              }
      }
    )
  }

  goToAlbum() {
    var album = this.props.navigation.state.params.platform.name === "YouTube" ? this.props.navigation.state.params.song.Artist : this.props.navigation.state.params.song.Album
    this.props.navigation.navigate(
      {
        key: "Album",
        routeName: "Album",
        params: {
          album: album,
          songs: [],
          platform: this.props.navigation.state.params.platform,
        }
      })
  }

  render() {

    return (
        <Container >
          <View style={styles.songOptionContainer} />
          <Save saving={this.state.saving} />
          <Delete deleting={this.state.deleting} />
          <AddToQueue addingToQueue={this.state.addingToQueue} />
          <Content scrollEnabled={false}>
            <Button style={styles.closeButton} transparent onPress={() => this.props.navigation.goBack()}>
              <Icon transparent={false} name="md-close" style={styles.closeButtonIcon}/>
            </Button>
            <View style={styles.songDetailsContainer}>
              <ImageLoad
                  isShowActivity={false}
                  style={styles.albumArt}
                  placeholderStyle={styles.albumArtPlaceholderImg}
                  source={{ uri: this.props.navigation.state.params.song.Album.image}}
                  placeholderSource={require("./../../../assets/albumArtPlaceholder.png")}
              />
              <Text style={styles.songNameText}>{this.props.navigation.state.params.song.name}</Text>
              <Text style={styles.artistNameText}>{this.props.navigation.state.params.song.Artist.name}</Text>
            </View>

            <View>
            <ListItem style={{borderBottomWidth:0}}>
            {this.state.songSaved ?
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={this.removeSong}
                style={{flexDirection: 'row'}}
              >
                <Icon style={styles.actionItemIcon} type="FontAwesome" name="remove" />
                <Text style={styles.actionItemText}> Remove</Text>
              </TouchableOpacity>
            :
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={this.saveSong}
                style={{flexDirection: 'row'}}
              >
                <Icon style={styles.actionItemIcon} type="FontAwesome" name="plus" />
                <Text style={styles.actionItemText}> Add</Text>
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
              <Text style={styles.actionItemText}> Add To Queue</Text>
            </TouchableOpacity>
            </ListItem>
            {this.props.navigation.state.params.platform.name !== "YouTube" ?
              <ListItem style={{borderBottomWidth:0}}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => this.goToArtist()}
                style={{flexDirection: 'row'}}
              >
                <Icon style={styles.actionItemIcon} type="FontAwesome" name="user" />
                <Text style={styles.actionItemText}> Go To Artist</Text>
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
            {this.props.navigation.state.params.platform.name !== "YouTube" ?
              <Icon style={styles.actionItemIcon} type="FontAwesome5" name="compact-disc" />
            :
              <Icon style={styles.actionItemIcon} type="MaterialCommunityIcons" name="youtube-tv" />
            }
              <Text style={styles.actionItemText}> {this.props.navigation.state.params.platform.name === "YouTube" ? "Go To Channel" : "Go To Album"}</Text>
            </TouchableOpacity>
            </ListItem>
            </View>

          </Content>
        </Container>
    )
  }
}


const mapDispatchToProps = dispatch => ({
    savePlatformSong: (platformName, song) => dispatch(savePlatformSong(platformName, song)),
    removePlatformSong: (platformName, song) => dispatch(removePlatformSong(platformName, song)),
    addToQueue: (song, platform) => dispatch(addToQueue(song, platform))
});

export default connect(null,mapDispatchToProps)(SongOptions)
