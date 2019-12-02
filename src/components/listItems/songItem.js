import React, { PureComponent } from 'react';
import { View, TouchableOpacity } from "react-native";
import { Text, ListItem, Icon } from "native-base";
import SongOptions from "./../songOptions/index";
import styles from "./styles";
import { connect } from 'react-redux';
import { playSong  } from './../../redux/audio/actions';

class SongItem extends PureComponent {

  constructor(props) {
   super(props);
   //need to pass platform and library
   this.state={color:"white"}
   this.songPressed = this.songPressed.bind(this);
   this.isCurrentSong = this.isCurrentSong.bind(this);
 }

 componentDidMount() {
   this.isCurrentSong()
 }

 componentDidUpdate() {
   this.isCurrentSong()
 }

  async songPressed() {
    var index = this.props.playlist.findIndex(x => x.name === this.props.song.name && x.Artist.name === this.props.song.Artist.name);
    this.props.playSong(index, this.props.playlist);
    this.setState({color: "#7248BD"})
  }

  isCurrentSong() {
    if(!!this.props.activePlatform) {
      if(this.props.currentplaylist[this.props.currentIndex].name === this.props.song.name && this.props.currentplaylist[this.props.currentIndex].Artist.name === this.props.song.Artist.name) {
        this.setState({color: "#7248BD"})
      }
      else {
        this.setState({color: "white"})
      }
    }

  }

  render() {
    return (
      <ListItem noBorder style={styles.libraryItem}>
        <TouchableOpacity
         onPress={() => {
           this.songPressed();
         }}
         >
         <View style={styles.libraryItemText}>
           <View>
             <Text style={[styles.songText,{color:this.state.color}]} numberOfLines={1}>{this.props.song.name}</Text>
           </View>
           <View>
             <Text numberOfLines={1} note style={styles.artistText}>{this.props.song.Artist.name}</Text>
           </View>
         </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.songOptionContainer}
          onPress={() => {this.props.navigation.navigate(
            {
              key: "SongOptions",
              routeName: "SongOptions",
              params: {song: this.props.song, platform:this.props.platform}
            }
          )}}
         >
         <Icon type="FontAwesome" name="ellipsis-v" style={styles.songOptions} />
        </TouchableOpacity>

      </ListItem>
    )
  }
}
function mapStateToProps(state) {
  return {
    platforms: state.platformState.platforms,
    activePlatform: state.audioState.activePlatform,
    currentIndex: state.audioState.currentIndex,
    currentplaylist: state.audioState.playlist,
  }
};

const mapDispatchToProps = dispatch => ({
    playSong: (index,playlist ) => dispatch(playSong(index, playlist)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SongItem)
