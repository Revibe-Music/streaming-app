import React, { PureComponent } from 'react';
import { View, TouchableOpacity } from "react-native";
import { Text,  Icon, ListItem as BaseListItem } from "native-base";
import PropTypes from 'prop-types';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import ImageLoad from 'react-native-image-placeholder';

import styles from "./styles";

class ArtistItem extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      showOptions: false
    }
    this.setArtist = this.setArtist.bind(this)
    this.goToArtist = this.goToArtist.bind(this)
  }

  setArtist() {
    var contributorString = ""
    if(this.props.displayType) {
       contributorString = `Artist`
    }
    return contributorString

  }

  goToArtist() {
    var navigationOptions = {
      key: "Artist",
      routeName: "Artist",
      params: {
        artist: this.props.artist,
      }
    }
    this.props.navigation.navigate(navigationOptions)
  }

  render() {
    return (
      <BaseListItem noBorder style={styles.listItem}>
        <TouchableOpacity onPress={this.goToArtist}>
          <View style={{flexDirection: "row"}}>
            <ImageLoad
                isShowActivity={false}
                style={styles.image} // rounded or na?
                placeholderStyle={styles.image}
                borderRadius={hp("3.5%")}
                source={{uri: this.props.artist.mediumImage ? this.props.artist.mediumImage : this.props.artist.images[2].url}}
                placeholderSource={require("./../../../assets/userPlaceholder.png")}
            />
            <View style={styles.textContainer}>
             <View>
               <Text style={[styles.mainText,{color:"white"}]} numberOfLines={1}>{this.props.artist.name}</Text>
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

ArtistItem.propTypes = {
  artist: PropTypes.object,
  displayType: PropTypes.bool,
};

ArtistItem.defaultProps = {
  displayType: false,
};


export default ArtistItem
