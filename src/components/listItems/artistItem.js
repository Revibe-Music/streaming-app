import React, { PureComponent } from 'react';
import { View, TouchableOpacity, Image } from "react-native";
import { Text,  Icon, ListItem as BaseListItem } from "native-base";
import PropTypes from 'prop-types';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import ImageLoad from 'react-native-image-placeholder';
import { connect } from 'react-redux';

import { getPlatform } from './../../api/utils';
import { goToArtist } from './../../redux/navigation/actions';
import styles from "./styles";

class ArtistItem extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      showOptions: false
    }
    this.setArtist = this.setArtist.bind(this)
  }

  setArtist() {
    var contributorString = ""
    if(this.props.displayType) {
       contributorString = `Artist`
    }
    return contributorString
  }


  getImage() {
    this.props.artist.images = Object.keys(this.props.artist.images).map(x => this.props.artist.images[x])
    if(this.props.artist.images.length > 0) {
      var image = this.props.artist.images.reduce(function(prev, curr) {
          return prev.height < curr.height ? prev : curr;
      });
      return {uri: image.url}
    }
    return require("./../../../assets/userPlaceholder.png")
  }

  displayPlatform() {
    if(this.props.artist.platform.toLowerCase() === "spotify") {
      var platformIcon = <Icon type="FontAwesome5" name="spotify" style={[styles.logo, {color: "#1DB954"}]} />
    }
    else if(this.props.artist.platform.toLowerCase() === "youtube") {
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
        <TouchableOpacity onPress={() => this.props.goToArtist(this.props.artist, this.props.isLocal)}>
          <View style={{flexDirection: "row"}}>
            <ImageLoad
                isShowActivity={false}
                style={styles.image} // rounded or na?
                placeholderStyle={styles.image}
                borderRadius={hp("3.5%")}
                source={this.getImage()}
                placeholderSource={require("./../../../assets/userPlaceholder.png")}
            />
            <View style={styles.textContainer}>
             <View>
               <Text style={[styles.mainText,{color:"white"}]} numberOfLines={1}>{this.props.artist.name}</Text>
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
            <Icon type="FontAwesome" name="angle-right" style={styles.ellipsis} />
           </View>
         </View>

        </TouchableOpacity>
      </BaseListItem>
    )
  }
}

ArtistItem.propTypes = {
  artist: PropTypes.object,
  displayType: PropTypes.bool,
  displayLogo: PropTypes.bool,
  isLocal: PropTypes.bool,
  source: PropTypes.string,
};

ArtistItem.defaultProps = {
  displayType: false,
  displayLogo: false,
  isLocal: false
};

const mapDispatchToProps = dispatch => ({
    goToArtist: (artist,isLocal) => dispatch(goToArtist(artist,isLocal)),
});

export default connect(null,mapDispatchToProps)(ArtistItem)
