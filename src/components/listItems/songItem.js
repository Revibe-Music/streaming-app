import React, { PureComponent } from 'react';
import { View, TouchableOpacity } from "react-native";
import { Text,  Icon, ListItem as BaseListItem } from "native-base";
import PropTypes from 'prop-types';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import ImageLoad from 'react-native-image-placeholder';
import { connect } from 'react-redux';
import { compact } from 'lodash';

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
    this.onClick = this.onClick.bind(this)
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

  onClick() {
    var index = this.props.playlist.map(function(e) { return e.id; }).indexOf(this.props.song.id);
    this.props.playSong(index, this.props.playlist)
  }

  render() {
    return (
      <BaseListItem noBorder style={styles.listItem}>
        <TouchableOpacity onPress={this.onClick}>
          <View style={{flexDirection: "row"}}>
            {this.props.displayImage ?
              <ImageLoad
                  isShowActivity={false}
                  style={styles.image} // rounded or na?
                  placeholderStyle={styles.image}
                  source={{uri: this.props.song.album.mediumImage ? this.props.song.album.mediumImage : this.props.song.album.images[2].url}}
                  placeholderSource={require("./../../../assets/albumArtPlaceholder.png")}
              />
            :
            null
            }
            <View style={styles.textContainer}>
             <View>
               <Text style={[styles.mainText,{color:this.setColor()}]} numberOfLines={1}>{this.props.song.name}</Text>
             </View>
             <View>
               <Text numberOfLines={1} note style={styles.noteText}>{this.setArtist()}</Text>
             </View>
           </View>
         </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={this.props.displayImage ? styles.ellipsisContainer : [styles.ellipsisContainerImageAdjusted,styles.ellipsisContainer]}
          onPress={this.toggleOptionsMenu}
         >
         <Icon type="FontAwesome" name="ellipsis-v" style={styles.ellipsis} />
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
};

SongItem.defaultProps = {
  displayImage: true,
  displayType: false,
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
    playSong: (index, playlist) => dispatch(playSong(index, playlist))
});

export default connect(mapStateToProps,mapDispatchToProps)(SongItem)
