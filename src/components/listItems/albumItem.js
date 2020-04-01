import React, { PureComponent } from 'react';
import { View, TouchableOpacity, Image } from "react-native";
import { Text,  Icon, ListItem as BaseListItem } from "native-base";
import PropTypes from 'prop-types';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import ImageLoad from 'react-native-image-placeholder';
import { compact } from 'lodash';
import { connect } from 'react-redux';

import FastImage from "./../images/fastImage";
import { getPlatform } from './../../api/utils';
import { goToAlbum } from './../../redux/navigation/actions';
import styles from "./styles";

class AlbumItem extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      showOptions: false
    }
    this.setArtist = this.setArtist.bind(this)
  }

  setArtist() {
    var contributors = Object.keys(this.props.album.contributors).map(x => this.props.album.contributors[x])
    var contributorString = compact(contributors.map(function(x) {if(x.type === "Artist") return x.artist.name})).join(', ')
    if(this.props.displayType) {
       contributorString = `Album • ${contributorString}`
    }
    return contributorString
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

  displayPlatform() {
    if(this.props.album.platform.toLowerCase() === "spotify") {
      var platformIcon = <Icon type="FontAwesome5" name="spotify" style={[styles.logo, {color: "#1DB954"}]} />
    }
    else if(this.props.album.platform.toLowerCase() === "youtube") {
      var platformIcon = <Icon type="FontAwesome5" name="youtube" style={[styles.logo, {color: "red"}]} />
    }
    else {
      var platformIcon = <Image source={require('./../../../assets/revibe_logo.png')} style={{height: hp("2"), width: hp("2")}} />
    }
    return platformIcon
  }

  render() {
    return (
      <BaseListItem noBorder style={styles.listItem}>
        <TouchableOpacity onPress={() => this.props.goToAlbum(this.props.album, [], this.props.isLocal)}>
          <View style={{flexDirection: "row", alignItems: "center"}}>
            <FastImage
              style={styles.image} // rounded or na?
              source={this.getImage()}
              placeholder={require("./../../../assets/albumPlaceholder.png")}
            />
            <View style={styles.textContainer}>
             <View>
               <Text style={[styles.mainText,{color:"white"}]} numberOfLines={1}>{this.props.album.name}</Text>
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
           <View style={styles.arrowContainer}>
            <Icon type="Entypo" name={this.props.iconName} style={styles.arrow} />
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
  source: PropTypes.string,
  displayLogo: PropTypes.bool,
  iconName: PropTypes.string,
};

AlbumItem.defaultProps = {
  songs: [],
  displayType: false,
  isLocal: false,
  displayLogo: false,
  iconName: "chevron-small-right",
};



const mapDispatchToProps = dispatch => ({
    goToAlbum: (album,songs,isLocal) => dispatch(goToAlbum(album,songs,isLocal)),
});

export default connect(null,mapDispatchToProps)(AlbumItem)
