import React, { PureComponent } from 'react';
import { View, TouchableOpacity } from "react-native";
import { Text,  Icon, ListItem as BaseListItem } from "native-base";
import PropTypes from 'prop-types';
import ImageLoad from 'react-native-image-placeholder';

import SongOptions from "./../songOptions/index";
import styles from "./styles";

class ListItem extends PureComponent {

  constructor(props) {
    super(props);
  }

  render() {

    var color = this.props.isActive ? this.props.activeColor : this.props.defaultColor
    var placeholderSourc
    if(this.props.types === "artist") {
      placeholderSource = require("./../../../assets/userPlaceholder.png")
    }
    else if(this.props.types === "album") {
      placeholderSource = require("./../../../assets/albumPlaceholder.png")
    }
    else  {
      placeholderSource = require("./../../../assets/albumArtPlaceholder.png")
    }

    return (
      <BaseListItem noBorder style={styles.listItem}>
        <TouchableOpacity onPress={this.props.onClick}>
          <View style={{flexDirection: "row"}}>
            <ImageLoad
                isShowActivity={false}
                style={styles.image} // rounded or na?
                placeholderStyle={styles.image}
                borderRadius={this.props.imageShape==="circle" ? hp("3.5%") : 0}
                source={{uri: this.props.image}}
                placeholderSource={placeholderSource}
            />
            <View style={styles.textContainer}>
             <View>
               <Text style={[styles.mainText,{color:color}]} numberOfLines={1}>{this.props.text}</Text>
             </View>
             <View>
               <Text numberOfLines={1} note style={styles.noteText}>{this.props.note}</Text>
             </View>
           </View>
         </View>
        </TouchableOpacity>
        {this.props.type === "Song" ?
          <TouchableOpacity style={styles.songOptionContainer}
            onPress={() => {this.props.navigation.navigate(
              {
                key: "SongOptions",
                routeName: "SongOptions",
                params: {song: this.props.object, platform:this.props.object.platform}
              }
            )}}
           >
           <Icon type="FontAwesome" name="ellipsis-v" style={styles.songOptions} />
          </TouchableOpacity>
          :
          null
        }
      </BaseListItem>
    )
  }
}

ListItem.propTypes = {
  defaultColor: PropTypes.string,
  activeColor: PropTypes.string,
  isActive: PropTypes.bool,
  type: PropTypes.oneOfType(["Song","Artist","Album"]),
  text: PropTypes.string,
  note: PropTypes.string,
  onClick: PropTypes.func,            // function that is called whenever a tag is added
  image: PropTypes.string,
  imageShape: PropTypes.string,
  object: PropTypes.object,           // song, album, or artist object
};

ListItem.defaultProps = {
  defaultColor: "white",
  activeColor: "#7248BD",
  isActive: false,
  text: "Default Text",
  note: "Default Note",
  onClick: () => console.log("Must pass function to onClick props in order for clicking the item to do anything."),
  imageShape: "square",
};

export default ListItem
