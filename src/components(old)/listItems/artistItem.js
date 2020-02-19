import React, { PureComponent } from 'react';
import { View, TouchableOpacity } from "react-native";
import { Text, ListItem, Icon } from "native-base";
import ImageLoad from 'react-native-image-placeholder';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import styles from "./styles";

class ArtistItem extends PureComponent {

  constructor(props) {
   super(props);
 }

  render() {
    return (
      <ListItem noBorder style={styles.libraryItem}>
        <TouchableOpacity
          onPress={() => {
            if(this.props.displaySavedSongs) {
              this.props.navigation.navigate(
                {
                  key: "Album",
                  routeName: "Album",
                  params:{album: this.props.artist,
                          songs: this.props.platform.getSavedArtistTracks(this.props.artist.id),
                          platform: this.props.platform,
                        }
                }
              )
            }
            else {
              this.props.navigation.navigate(
                {
                  key: "Artist",
                  routeName: "Artist",
                  params:{artist: this.props.artist,
                          platform: this.props.platform,
                        }
                }
              )
            }
          }
        }
          style={{flexDirection: "row", flex:1}}
         >
         <View>
           <ImageLoad
               isShowActivity={false}
               style={styles.artistImage}
               placeholderStyle={styles.artistImage}
               borderRadius={hp("3.5%")}
               source={{uri: this.props.artist.image}}
               placeholderSource={require("./../../../assets/userPlaceholder.png")}
           />
         </View>
         <View style={styles.searchItemText}>
           <View>
             <Text style={[styles.songText,{color:"white", width: wp("80%")}]} numberOfLines={1}>{this.props.artist.name}</Text>
           </View>
           <View>
             <Text numberOfLines={1} note style={styles.artistText}>Artist</Text>
           </View>
         </View>

        </TouchableOpacity>
        <View style={{flex:1, alignItems:"flex-end"}}>
        </View>
      </ListItem>
    )
  }
}

export default ArtistItem;
