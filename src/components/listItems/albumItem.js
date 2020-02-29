import React, { PureComponent } from 'react';
import { View, TouchableOpacity } from "react-native";
import { Text,  Icon, ListItem as BaseListItem } from "native-base";
import PropTypes from 'prop-types';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import ImageLoad from 'react-native-image-placeholder';
import { compact } from 'lodash';

import { getPlatform } from './../../api/utils';
import styles from "./styles";

class AlbumItem extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      showOptions: false
    }
    this.setArtist = this.setArtist.bind(this)
    this.goToAlbum = this.goToAlbum.bind(this)
  }

  setArtist() {
    var contributors = Object.keys(this.props.album.contributors).map(x => this.props.album.contributors[x])
    var contributorString = compact(contributors.map(function(x) {if(x.type === "Artist") return x.artist.name})).join(', ')
    if(this.props.displayType) {
       contributorString = `Album • ${contributorString}`
    }
    return contributorString
  }

  goToAlbum() {
    var songs = this.props.songs
    var album = this.props.album.platform === "YouTube" ? this.props.album.contributors[0].artist : this.props.album
    if(this.props.isLocal) {
      songs = getPlatform(this.props.album.platform).getSavedAlbumSongs(this.props.album.id)
      var key = album.name+"Local"
    }
    else {
      var key = album.name+"Remote"
    }
    var navigationOptions = {
      key: key,
      routeName: "Album",
      params: {
        album: album,
        songs: songs,
      }
    }
    this.props.navigation.navigate(navigationOptions)
  }

  getImage() {
    this.props.album.images = Object.keys(this.props.album.images).map(x => this.props.album.images[x])
    if(this.props.album.images.length > 0) {
      var image = this.props.album.images.reduce(function(prev, curr) {
          return prev.height < curr.height ? prev : curr;
      });
      return {uri: image.url}
    }
    return require("./../../../assets/albumPlaceholder.png")
  }

  render() {
    return (
      <BaseListItem noBorder style={styles.listItem}>
        <TouchableOpacity onPress={this.goToAlbum}>
          <View style={{flexDirection: "row"}}>
            <ImageLoad
                isShowActivity={false}
                style={styles.image} // rounded or na?
                placeholderStyle={styles.image}
                source={this.getImage()}
                placeholderSource={require("./../../../assets/albumPlaceholder.png")}
            />
            <View style={styles.textContainer}>
             <View>
               <Text style={[styles.mainText,{color:"white"}]} numberOfLines={1}>{this.props.album.name}</Text>
             </View>
             <View>
               <Text numberOfLines={1} note style={styles.noteText}>{this.setArtist()}</Text>
             </View>
           </View>
           <View style={styles.arrowContainer}>
            <Icon type="FontAwesome" name="angle-right" style={styles.ellipsis} />
           </View>
         </View>
        </TouchableOpacity>
      </BaseListItem>
    )
  }
}

AlbumItem.propTypes = {
  album: PropTypes.object,
  songs: PropTypes.array,
  displayType: PropTypes.bool,
  isLocal: PropTypes.bool,
};

AlbumItem.defaultProps = {
  songs: [],
  displayType: false,
  isLocal: false,
};


export default AlbumItem
