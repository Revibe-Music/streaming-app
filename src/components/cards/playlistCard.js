import React, { PureComponent } from 'react';
import { View, Image, TouchableOpacity } from "react-native";
import { Card, Text, Icon, Body} from "native-base";
import PropTypes from 'prop-types';
import { compact } from 'lodash';
import { connect } from 'react-redux';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import PlaylistImage from "./../images/playlistImage";
import { goToPlaylist } from './../../redux/navigation/actions';
import styles from "./styles";

class PlaylistCard extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      images: []
    }
  }



  getImage() {
    var songs = JSON.parse(JSON.stringify(this.allSongs.map(x => x.song)))
    var albums = uniqBy(songs.map(x => x.album), "id")
    if(albums.length >= 4) {
      var albumArts = albums.slice(0,4)
      var images = []
      for(var x=0; x<albumArts.length; x++) {
        albumArts[x].images = Object.keys(albumArts[x].images).map(j => albumArts[x].images[j])
        var size=100000
        var index = 0
        for(var y=0; y<albumArts[x].images.length; y++) {
          if(albumArts[x].images[y].height < size) {
            if(albumArts[x].images[y].height > 64) {
              size = albumArts[x].images[y].height
              index = y
            }
          }
        }
        images.push({uri: albumArts[x].images[index].url})
      }
      return images
    }
    else if (albums.length > 0) {
      albums[0].images = Object.keys(albums[0].images).map(x => albums[0].images[x])
      if(albums[0].images.length > 0) {
        var size=0
        var index = 0
        for(var x=0; x<albums[0].images.length; x++) {
          if(albums[0].images[x].height < 1000) {
            if(albums[0].images[x].height > size) {
              size = albums[0].images[x].height
              index = x
            }
          }
        }
        return {uri: albums[0].images[index].url}
      }
    }
    // return require("./../../../../assets/albumArtPlaceholder.png")
  }
  // <PlaylistImage
  //   images={this.props.images}
  //   height={hp("15%")}
  //   width={hp("15%")}
  // />

  render() {
    return (
      <TouchableOpacity
      style={{borderBottomWidth:0}}
      onPress={() => this.props.goToPlaylist(this.props.playlist, false)}
      delayPressIn={0} useForeground >
        <Card style={styles.card} noShadow={true}>

          <Body style={styles.cardItem}>
            <View style={styles.radioCardName}>
              <View style={{ flex: 0.5}}>
                <Text numberOfLines={1} style={styles.text}>
                  {this.props.playlist.name}
                </Text>
              </View>
              <View style={{ flex: 0.5}}>
              </View>
            </View>
          </Body>
        </Card>
      </TouchableOpacity>
    )
  }
}

PlaylistCard.propTypes = {
  playlist: PropTypes.object.isRequired,
  images: PropTypes.string
};

const mapDispatchToProps = dispatch => ({
    goToPlaylist: (playlist, isLocal) => dispatch(goToPlaylist(playlist,isLocal)),
});

export default connect(null,mapDispatchToProps)(PlaylistCard)
