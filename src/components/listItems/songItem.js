import React, { PureComponent } from 'react';
import { View, TouchableOpacity, Image } from "react-native";
import { Text,  Icon, ListItem as BaseListItem } from "native-base";
import PropTypes from 'prop-types';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import ImageLoad from 'react-native-image-placeholder';
import { SwipeRow } from 'react-native-swipe-list-view';
import { connect } from 'react-redux';
import { compact } from 'lodash';

import FastImage from "./../images/fastImage";
import OptionsMenu from "./../OptionsMenu/index";
import { playSong,addToQueue, setAddingToLibrary, setRemovingFromLibrary, setAddingToQueue } from './../../redux/audio/actions'
import { selectSong } from './../../redux/navigation/actions'
import { getPlatform } from './../../api/utils';
import { logEvent } from './../../amplitude/amplitude';
import styles from "./styles";
import { ThemeConsumer } from 'react-native-elements';

class SongItem extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      inLibrary: false,
      addingToLibrary:false,
      removingFromLibrary: false,
      addingToQueue: false,
    }

    this.toggleOptionsMenu = this.toggleOptionsMenu.bind(this)
    this.setColor = this.setColor.bind(this)
    this.setArtist = this.setArtist.bind(this)
    this.getImage = this.getImage.bind(this)
    this.onClick = this.onClick.bind(this)
  }

  toggleOptionsMenu() {
    this.props.selectSong(this.props.song)
    this.setState({update: true})
    this.setState({update: false})
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
    try {
      this.props.song.album.images = Object.keys(this.props.song.album.images).map(x => this.props.song.album.images[x])
      if(this.props.song.album.images.length > 0) {
        var image = this.props.song.album.images.reduce(function(prev, curr) {
            return prev.height < curr.height ? prev : curr;
        });
        return {uri: image.url}
      }
    }
    catch(error) {
      console.log("Error with album image");
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

  handleSwipe = (direction, isActivated) => {
    if(isActivated) {
      if(direction === "left") {
        this.props.setAddingToQueue(true)
        ReactNativeHapticFeedback.trigger("impactLight", {enableVibrateFallback: true,ignoreAndroidSystemSettings: false});
        setTimeout(() => this.props.setAddingToQueue(false), 1500)
        this.props.addToQueue(this.props.song)
      }
      else {
        if(this.state.inLibrary) {
          this.props.setRemovingFromLibrary(true)
          ReactNativeHapticFeedback.trigger("impactLight", {enableVibrateFallback: true,ignoreAndroidSystemSettings: false});
          setTimeout(() => this.props.setRemovingFromLibrary(false), 1500)
          this.removeSongFromLibrary()
        }
        else {
          this.props.setAddingToLibrary(true)
          ReactNativeHapticFeedback.trigger("impactLight", {enableVibrateFallback: true,ignoreAndroidSystemSettings: false});
          setTimeout(() => this.props.setAddingToLibrary(false), 1500)
          this.addSongToLibrary()
        }
      }
    }
  }

  songInLibrary = () => {
    // check if object is already saved to determine to show "Add" or "Remove"
    var platform = getPlatform(this.props.song.platform)
    return platform.library.songIsSaved(this.props.song)
  }

  addSongToLibrary = () => {
    var platform = getPlatform(this.props.song.platform)
    platform.addSongToLibrary(this.props.song)
    logEvent("Library", "Add Song", {"Platform": this.props.song.platform, "ID": this.props.song.id})
  }

  removeSongFromLibrary = () => {
    var platform = getPlatform(this.props.song.platform)
    platform.removeSongFromLibrary(this.props.song.id)
    logEvent("Library", "Remove Song", {"Platform": this.props.song.platform, "ID": this.props.song.id})
  }

  render() {
    return (
      <>
      <SwipeRow
        leftOpenValue={.01}
        rightOpenValue={.01}
        leftActivationValue={wp(30)}
        rightActivationValue={-wp(35)}
        stopLeftSwipe={wp(40)}
        stopRightSwipe={-wp(40)}
        onLeftActionStatusChange={value => this.handleSwipe("left", value.isActivated)}
        onRightActionStatusChange={value => this.handleSwipe("right", value.isActivated)}
        swipeToOpenVelocityContribution={8}
        swipeGestureBegan={() => this.setState({inLibrary: this.songInLibrary()})}
        >
        <View style={{alignItems: 'center',flexDirection: 'row',justifyContent: 'space-between', width: wp(90), height: hp(8.5), marginLeft: wp(5)}}>
          <Icon style={{fontSize: hp(4), color: "#7248BD"}} type="MaterialIcons" name="library-add" />
          {this.state.inLibrary ?
            <Icon style={{fontSize: hp(4), color: "red"}} type="MaterialCommunityIcons" name="delete-forever" />
          :
            <Icon style={{fontSize: hp(3), color: "green"}} type="FontAwesome" name="plus" />
          }

        </View>
        <BaseListItem noBorder style={[styles.listItem, !Object.keys(this.props.platforms).includes(this.props.song.platform) ? {opacity: .3} : {}]}>
          <TouchableOpacity disabled={!Object.keys(this.props.platforms).includes(this.props.song.platform)} onPress={this.onClick}>
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
            disabled={!Object.keys(this.props.platforms).includes(this.props.song.platform)}
            style={this.props.displayImage ? styles.ellipsisContainer : [styles.ellipsisContainerImageAdjusted,styles.ellipsisContainer]}
            onPress={this.toggleOptionsMenu}
           >
           <Icon type="Feather" name="more-horizontal" style={styles.ellipsis} />
          </TouchableOpacity>
        </BaseListItem>
      </SwipeRow>

      </>
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
    activePlatform: state.audioState.activePlatform,
    platforms: state.platformState.platforms
  }
};
const mapDispatchToProps = dispatch => ({
    selectSong: (song) => dispatch(selectSong(song)),
    playSong: (index, playlist, inQueue) => dispatch(playSong(index, playlist, inQueue)),
    addToQueue: (song) => dispatch(addToQueue(song)),
    setAddingToLibrary: (bool) => dispatch(setAddingToLibrary(bool)),
    setRemovingFromLibrary: (bool) => dispatch(setRemovingFromLibrary(bool)),
    setAddingToQueue: (bool) => dispatch(setAddingToQueue(bool)),
});

export default connect(mapStateToProps,mapDispatchToProps)(SongItem)
