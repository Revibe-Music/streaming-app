import React, { PureComponent } from 'react';
import { View, TouchableOpacity, Modal, Image } from "react-native";
import { Container, Content, Button, Text, Icon, ListItem } from "native-base";
import { connect } from 'react-redux';
import { removePlatformSong, savePlatformSong } from './../../redux/authentication/actions';

import styles from "./styles";


class SongOptions extends PureComponent {

  constructor(props) {
     super(props);
     this.state = { showTrackOptions:false }
     this.toggleSongOptions = this.toggleSongOptions.bind(this);
     this.songIsSaved = this.songIsSaved.bind(this);
     this.saveSong = this.saveSong.bind(this);
     this.removeSong = this.removeSong.bind(this);
   }

   songIsSaved() {
     return this.props.navigation.state.params.platform.getSongs().filter(x => x.name === this.props.navigation.state.params.song.name && x.Artist.name === this.props.navigation.state.params.song.Artist.name).length > 0
   }

   saveSong() {
     this.props.savePlatformSong(this.props.navigation.state.params.platform.name, this.props.navigation.state.params.song)
   }

   removeSong() {
     this.props.removePlatformSong(this.props.navigation.state.params.platform.name, this.props.navigation.state.params.song)
     this.toggleSongOptions()
   }

  toggleSongOptions() {
    this.setState({ showTrackOptions: !this.state.showTrackOptions })
    // check if song is already saved to determine to show "Add" or "Remove"
  }

  goToArtist() {
    this.props.navigation.navigate(
      {
        key: "Artist",
        routeName: "Artist"
      }
    )
    this.toggleSongOptions()
  }

  goToAlbum() {
    this.props.navigation.navigate(
      {
        key: "Album",
        routeName: "Album"
      }
    )
    this.toggleSongOptions()
  }



  render() {
    return (
        <>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.showTrackOptions}
          hardwareAccelerated={true}
          supportedOrientations={["portrait"]}
        >
          <Container >
          <View style={{backgroundColor: "#121212", opacity:.8, position:"absolute", top:0, left:0, bottom:0, right:0}} />

          <Content scrollEnabled={false}>
          <Button style={{marginTop:50}} transparent onPress={() => this.toggleSongOptions()}>
            <Icon transparent={false} name="md-close" style={{color: "white",opacity: 1, elevation: 100}}/>
          </Button>
            <View style={styles.modalSongDetails}>
              <Image
              source={{uri: this.props.navigation.state.params.song.albumArt}}
              style={styles.modalSongImage}
              />
              <Text style={{textAlign:"center", color: "white", fontWeight: "bold", fontSize:20, borderBottomWidth:1}}>{this.props.navigation.state.params.song.name}</Text>
              <Text style={{textAlign:"center", color: "white", fontWeight: "200", fontSize:15}}>{this.props.navigation.state.params.song.artist}</Text>
            </View>

            <View>
            <ListItem style={{borderBottomWidth:0}}>
            {this.songIsSaved() ?
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={this.removeSong}
                style={{flexDirection: 'row'}}
              >
                <Icon style={{textAlign:"left", color: "white", fontWeight: "bold", fontSize:18, marginTop:15, marginRight:7}} type="FontAwesome" name="remove" />
                <Text style={{textAlign:"left", color: "white", fontWeight: "bold", fontSize:18, marginTop:15}}> Remove</Text>
              </TouchableOpacity>
            :
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={this.saveSong}
                style={{flexDirection: 'row'}}
              >
                <Icon style={{textAlign:"left", color: "white", fontWeight: "bold", fontSize:18, marginTop:15, marginRight:7}} type="FontAwesome" name="plus" />
                <Text style={{textAlign:"left", color: "white", fontWeight: "bold", fontSize:18, marginTop:15}}> Add</Text>
              </TouchableOpacity>
            }

            </ListItem>
            <ListItem style={{borderBottomWidth:0}}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={this.toggleResults}
              style={{flexDirection: 'row'}}
            >
              <Icon style={{textAlign:"left", color: "white", fontWeight: "bold", fontSize:23, marginTop:15, marginRight:0}} type="MaterialCommunityIcons" name="playlist-plus" />
              <Text style={{textAlign:"left", color: "white", fontWeight: "bold", fontSize:18, marginTop:15}}> Add To Queue</Text>
            </TouchableOpacity>
            </ListItem>
            <ListItem style={{borderBottomWidth:0}}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => this.goToArtist()}
              style={{flexDirection: 'row'}}
            >
              <Icon style={{textAlign:"left", color: "white", fontWeight: "bold", fontSize:18, marginTop:15, marginRight:7}} type="FontAwesome" name="user" />
              <Text style={{textAlign:"left", color: "white", fontWeight: "bold", fontSize:18, marginTop:15}}> Go To Artist</Text>
            </TouchableOpacity>
            </ListItem>
            <ListItem style={{borderBottomWidth:0}}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => this.goToAlbum()}
              style={{flexDirection: 'row'}}
            >
              <Icon style={{textAlign:"left", color: "white", fontWeight: "bold", fontSize:18, marginTop:15, marginRight:7}} type="FontAwesome5" name="compact-disc" />
              <Text style={{textAlign:"left", color: "white", fontWeight: "bold", fontSize:18, marginTop:15}}> Go To Album</Text>
            </TouchableOpacity>
            </ListItem>
            </View>

          </Content>
          </Container>
        </Modal>

        <TouchableOpacity
          onPress={() => {this.toggleSongOptions()}}
         >
         <Icon type="FontAwesome" name="ellipsis-v" style={{fontSize: 20, color: "white"}} />
        </TouchableOpacity>
        </>
    )
  }
}


const mapDispatchToProps = dispatch => ({
    savePlatformSong: (platformName, song) => dispatch(savePlatformSong(platformName, song)),
    removePlatformSong: (platformName, song) => dispatch(removePlatformSong(platformName, song)),
});

export default connect(null,mapDispatchToProps)(SongOptions)
