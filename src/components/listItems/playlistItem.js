import React, { PureComponent } from 'react';
import { View, TouchableOpacity, Image } from "react-native";
import { Text,  Icon, ListItem as BaseListItem } from "native-base";
import PropTypes from 'prop-types';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import ImageLoad from 'react-native-image-placeholder';
import { CheckBox } from 'react-native-elements'
import { connect } from 'react-redux';
import { uniqBy } from 'lodash'

import { goToPlaylist } from './../../redux/navigation/actions';
import PlaylistImage from "./../images/playlistImage";
import FastImage from "./../images/fastImage";
import RevibeAPI from './../../api/revibe';
import styles from "./styles";

class PlaylistItem extends PureComponent {

  constructor(props) {
    super(props);
    this.revibe = new RevibeAPI()
    var playlist = this.revibe.playlists.filtered(`id = "${this.props.playlist.id}"`)["0"]
    this.state = {
      updating: true,
      playlist: playlist,
      images: playlist.smallImage
    }
    this.update = this.update.bind(this)
    this.onPress = this.onPress.bind(this)
    this.displayPlatforms = this.displayPlatforms.bind(this)
  }

  componentDidMount() {
    if(!this.props.preventLiveUpdates) {
      this.state.playlist.addListener(this.update)
      setTimeout(() => this.setState({updating: false}), 1000)
    }
  }

  componentWillUnmount() {
    if(!this.props.preventLiveUpdates) {
      this.state.playlist.removeListener(this.update)
    }
  }

  update(playlist, changes) {
    if(changes.changedProperties.filter(x => x==="songs").length > 0) {
      if(!this.state.updating) {
        this.setState({updating: true})
        this.setState({images: this.state.playlist.smallImage})
        this.setState({updating: false})
      }
    }
  }


  displayPlatforms() {
    var playlist = this.revibe.playlists.filtered(`id = "${this.props.playlist.id}"`)["0"]
    var songs = JSON.parse(JSON.stringify(playlist.allSongs.map(x => x.song)))
    var platforms = songs.map(x => x.platform)
    platforms = uniqBy(platforms)
    platforms.sort()
    return (
      <View style={{flexDirection: "row"}}>
          {platforms.map(platform => {
            if(platform.toLowerCase() === "spotify") {
              return <Icon type="FontAwesome5" name="spotify" style={[styles.logo, {color: "#1DB954", paddingRight: wp("2%")}]} />
            }
            else if(platform.toLowerCase() === "youtube") {
              return <Icon type="FontAwesome5" name="youtube" style={[styles.logo, {color: "red", paddingRight: wp("2%")}]} />
            }
            else {
              return <Image source={require('./../../../assets/revibe_logo.png')} style={{height: hp("2"), width: hp("2"), marginRight: wp("2%")}} />
            }
          })}
      </View>
    )
  }

  onPress(args) {
    if(this.props.onPress) {
      this.props.onPress(this.props.playlist)
    }
    else {
      this.props.goToPlaylist(this.props.playlist)
    }
  }


  render() {
    // var playlist = this.revibe.playlists.filtered(`id = "${this.props.playlist.id}"`)["0"]
    // var images = playlist.smallImage
    return (
      <BaseListItem noBorder style={styles.listItem}>
        <TouchableOpacity onPress={this.onPress}>
          <View style={{flexDirection: "row", alignItems: "center"}}>
            {this.state.images.length ?
              <PlaylistImage images={this.state.images} height={hp("7")} width={hp("7")}/>
              :
              <FastImage
                style={styles.image} // rounded or na?
                source={this.state.images}
                placeholder={require("./../../../assets/albumArtPlaceholder.png")}
              />
            }
            <View style={styles.textContainer}>
             <View>
               <Text style={[styles.mainText,{color:"white"}]} numberOfLines={1}>{this.props.playlist.name}</Text>
             </View>
             <View style={{flexDirection: "row"}}>

                {this.props.playlist.curated ?
                  <View>
                    <Text numberOfLines={1} note style={styles.noteText}>by Revibe</Text>
                  </View>
                :
                <View style={styles.logoContainer}>
                {this.displayPlatforms()}
                </View>
               }

             </View>
           </View>
           {!this.props.editting ?
             <View style={styles.arrowContainer}>
              <Icon type="Entypo" name={this.props.iconName} style={styles.arrow} />
             </View>
            :
            <CheckBox
              checked={this.props.edittedPlaylists.filter(x => x.id === this.props.playlist.id).length > 0}
              onPress={this.onPress}
              checkedIcon='dot-circle-o'
              uncheckedIcon='circle-o'
              checkedColor="#7248BD"
              size={hp("2")}
              center
              containerStyle={styles.editCheckbox}
            />
           }
         </View>
        </TouchableOpacity>
      </BaseListItem>
    )
  }
}

PlaylistItem.propTypes = {
  playlist: PropTypes.object,
  iconName: PropTypes.string,
  displayIcon: PropTypes.bool,
  onPress: PropTypes.func,
  editting: PropTypes.bool,
  preventLiveUpdates: PropTypes.bool
};

PlaylistItem.defaultProps = {
  editting: false,
  preventLiveUpdates: false,
  iconName: "chevron-small-right",
};

const mapDispatchToProps = dispatch => ({
    goToPlaylist: (playlist) => dispatch(goToPlaylist(playlist)),
});

export default connect(null,mapDispatchToProps)(PlaylistItem)
