import React, { PureComponent } from 'react';
import { View, TouchableOpacity, Image } from "react-native";
import { Text,  Icon, ListItem as BaseListItem } from "native-base";
import PropTypes from 'prop-types';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import ImageLoad from 'react-native-image-placeholder';
import { connect } from 'react-redux';

import { getPlatform } from './../../api/utils';
import { goToPlaylist } from './../../redux/navigation/actions';
import RevibeAPI from './../../api/revibe';
import styles from "./styles";

class PlaylistItem extends PureComponent {

  constructor(props) {
    super(props);

    this.revibe = new RevibeAPI()
  }


  getImage() {
    // this.props.album.images = Object.keys(this.props.album.images).map(x => this.props.album.images[x])
    // if(this.props.album.images.length > 0) {
    //   var image = this.props.album.images.reduce(function(prev, curr) {
    //       return prev.height < curr.height ? prev : curr;
    //   });
    //   return {uri: image.url}
    // }
    return require("./../../../assets/albumPlaceholder.png")
  }


  render() {
    return (
      <BaseListItem noBorder style={styles.listItem}>
        <TouchableOpacity onPress={this.goToPlaylist}>
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
               <Text style={[styles.mainText,{color:"white"}]} numberOfLines={1}>{this.props.playlist.name}</Text>
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

PlaylistItem.propTypes = {
  playlist: PropTypes.object,
  source: PropTypes.string,
};

const mapDispatchToProps = dispatch => ({
    goToPlaylist: (playlist) => dispatch(goToArtist(playlist)),
});

export default connect(null,mapDispatchToProps)(PlaylistItem)
