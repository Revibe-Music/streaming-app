import React, { PureComponent } from 'react';
import { View, TouchableOpacity } from "react-native";
import { Text, ListItem, Icon } from "native-base";
import ImageLoad from 'react-native-image-placeholder';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import styles from "./styles";

class AlbumItem extends PureComponent {

  constructor(props) {
   super(props);
 }

  render() {
    return (
      <ListItem noBorder style={styles.libraryItem}>
        <TouchableOpacity
          onPress={() => {this.props.navigation.navigate(
            {
              key: "Album",
              routeName: "Album",
              params: {
                album: this.props.album,
                songs: this.props.displaySavedSongs ? this.props.platform.getSavedAlbumTracks(this.props.album.id) : [],
                platform: this.props.platform,
              }
            }
          )}}
          style={{flexDirection: "row", flex:1}}
         >
         <View>
           <ImageLoad
               isShowActivity={false}
               style={styles.artistImage}
               placeholderStyle={styles.artistImage}
               source={{uri: this.props.album.image}}
               placeholderSource={require("./../../../assets/albumPlaceholder.png")}
           />
         </View>
         <View style={styles.searchItemText}>
           <View>
             <Text style={[styles.songText,{color:"white", width: wp("80%")}]} numberOfLines={1}>{this.props.album.name}</Text>
           </View>
           <View>
             <Text numberOfLines={1} note style={styles.artistText}>Album</Text>
           </View>
         </View>

        </TouchableOpacity>
        <View style={{flex:1, alignItems:"flex-end"}}>
        </View>
      </ListItem>
    )
  }
}

export default AlbumItem;
