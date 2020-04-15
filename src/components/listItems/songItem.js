import React, { PureComponent } from 'react';
import { View, TouchableOpacity, Image } from "react-native";
import { Text,  Icon, ListItem as BaseListItem } from "native-base";
import PropTypes from 'prop-types';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import ImageLoad from 'react-native-image-placeholder';
import { connect } from 'react-redux';
import { compact } from 'lodash';

import FastImage from "./../images/fastImage";
import OptionsMenu from "./../OptionsMenu/index";
import { playSong } from './../../redux/audio/actions'
import { selectSong } from './../../redux/navigation/actions'
import styles from "./styles";

class SongItem extends PureComponent {

  constructor(props) {
    super(props);

    this.toggleOptionsMenu = this.toggleOptionsMenu.bind(this)
    this.setColor = this.setColor.bind(this)
    this.setArtist = this.setArtist.bind(this)
    this.getImage = this.getImage.bind(this)
    this.onClick = this.onClick.bind(this)
    if(!this.props.song) {
      console.log(this.props.song);
    }
  }

  toggleOptionsMenu() {
    this.props.selectSong(this.props.song)
  }

  setColor() {
    if(this.props.activePlatform) {
      if(this.props.currentplaylist[this.props.currentIndex].id === this.props.song.id) {
        return "#7248BD"
      }
    }
    return "white"
  }

  setArtist() {
    const song = this.props.song
    var contributors = Object.keys(this.props.song.contributors).map(x => this.props.song.contributors[x])
    var contributorString = compact(contributors.map(function(x) {if(x.type === "Artist") return x.artist.name})).join(', ')
    if(this.props.displayType) {
       contributorString = `Song • ${contributorString}`
    }
    return contributorString
  }

  getImage() {
    this.props.song.album.images = Object.keys(this.props.song.album.images).map(x => this.props.song.album.images[x])
    if(this.props.song.album.images.length > 0) {
      var image = this.props.song.album.images.reduce(function(prev, curr) {
          return prev.height < curr.height ? prev : curr;
      });
      return {uri: image.url}
    }
    return require("./../../../assets/albumArtPlaceholder.png")
  }

  displayPlatform() {
    if(this.props.song.platform.toLowerCase() === "spotify") {
      var platformIcon = <Icon type="FontAwesome5" name="spotify" style={[styles.logo, {color: "#1DB954"}]} />
    }
    else if(this.props.song.platform.toLowerCase() === "youtube") {
      var platformIcon = <Icon type="FontAwesome5" name="youtube" style={[styles.logo, {color: "red"}]} />
    }
    else {
      var platformIcon = <Image source={require('./../../../assets/revibe_logo.png')} style={{height: hp("2"), width: hp("2")}} />
    }
    return platformIcon
  }

  onClick() {
    if(this.props.onClick) {
      this.props.onClick()
    }
    if(!this.props.preventPlay) {
      var index = this.props.playlist.map(function(e) { return e.id; }).indexOf(this.props.song.id);
      this.props.playSong(index, this.props.playlist, false)
    }
  }

  render() {
    return (
      <BaseListItem noBorder style={styles.listItem}>
        <TouchableOpacity onPress={this.onClick}>
          <View style={{flexDirection: "row"}}>
            {this.props.displayImage ?
              <FastImage
                style={styles.image} // rounded or na?
                source={this.getImage()}
                placeholder={require("./../../../assets/albumPlaceholder.png")}
              />
            :
            null
            }
            <View style={styles.textContainer}>
             <View>
               <Text style={[styles.mainText,{color:this.setColor()}]} numberOfLines={1}>{this.props.song.name}</Text>
             </View>
             <View style={{flexDirection: "row"}}>
               {this.props.displayLogo ?
                 <View style={styles.logoContainer}>
                 {this.displayPlatform()}
                 </View>
                :
                  null
               }
             <View>
               <Text numberOfLines={1} note style={styles.noteText}>{this.setArtist()}</Text>
               </View>
             </View>
           </View>
         </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={this.props.displayImage ? styles.ellipsisContainer : [styles.ellipsisContainerImageAdjusted,styles.ellipsisContainer]}
          onPress={this.toggleOptionsMenu}
         >
         <Icon type="Feather" name="more-horizontal" style={styles.ellipsis} />
        </TouchableOpacity>
      </BaseListItem>
    )
  }
}

SongItem.propTypes = {
  song: PropTypes.object,
  playlist: PropTypes.arrayOf(PropTypes.object),
  displayImage: PropTypes.bool,
  displayType: PropTypes.bool,
  displayLogo: PropTypes.bool,
  onClick: PropTypes.func,
  preventPlay: PropTypes.bool
};

SongItem.defaultProps = {
  displayImage: true,
  displayType: false,
  displayLogo: false,
  preventPlay: false,
};


function mapStateToProps(state) {
  return {
    currentIndex: state.audioState.currentIndex,
    currentplaylist: state.audioState.playlist,
    activePlatform: state.audioState.activePlatform
  }
};
const mapDispatchToProps = dispatch => ({
    selectSong: (song) => dispatch(selectSong(song)),
    playSong: (index, playlist, inQueue) => dispatch(playSong(index, playlist, inQueue))
});

export default connect(mapStateToProps,mapDispatchToProps)(SongItem)
