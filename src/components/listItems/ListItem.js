import React, { PureComponent } from 'react';
import { View, TouchableOpacity } from "react-native";
import { Text, ListItem, Icon } from "native-base";
import PropTypes from 'prop-types';
import ImageLoad from 'react-native-image-placeholder';


import SongOptions from "./../songOptions/index";
import styles from "./styles";
import { connect } from 'react-redux';
import { playSong  } from './../../redux/audio/actions';

class ListItem extends PureComponent {

  constructor(props) {
    super(props);
  }

  render() {

    var color = this.props.defaultColor !== this.props.activeColor ? this.prop.activeColor : this.prop.defaultColor
    var placeholderSourc
    if(this.props.types === "artist") {
      placeholderSource = "./../../../assets/userPlaceholder.png"
    }
    else if(this.props.types === "album") {
      placeholderSource = "./../../../assets/albumPlaceholder.png"
    }
    else  {
      placeholderSource = "./../../../assets/albumArtPlaceholder.png"
    }

    return (
      <ListItem noBorder style={styles.libraryItem}>
        <TouchableOpacity onPress={this.props.onClick}}>
          <ImageLoad
              isShowActivity={false}
              style={styles.artistImage} // rounded or na?
              placeholderStyle={styles.artistImage}
              borderRadius={this.props.imageShape==="round" ? hp("3.5%") : 0}
              source={{uri: this.props.image}}
              placeholderSource={require(placeholderSource)}
          />
          <View style={styles.libraryItemText}>
           <View>
             <Text style={[styles.songText,{color:color}]} numberOfLines={1}>{this.props.text}</Text>
           </View>
           <View>
             <Text numberOfLines={1} note style={styles.artistText}>{this.props.note}</Text>
           </View>
         </View>
        </TouchableOpacity>
        {this.props.type === "song" ?
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
      </ListItem>
    )
  }
}

ListItem.propTypes = {
  defaultColor: PropTypes.string,
  activeColor: PropTypes.string,
  type: PropTypes.oneOfType(["song","artist","album"]),
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
  text: "Default Text",
  note: "Default Note",
  onClick: () => console.log("Must pass function to onCLick props in order for clicking the item to do anything."),
  imageShape: "square",
};

export default ListItem
