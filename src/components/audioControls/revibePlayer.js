import React, { Component } from "react";
import { connect } from 'react-redux';
import { Image, View } from "react-native";
import ImageLoad from 'react-native-image-placeholder';
import { updatePlatformData } from './../../redux/platform/actions';
import { setSongDuration, updateSongTime, resumeSong, pauseSong } from './../../redux/audio/actions';
import styles from "./styles";
import Video from 'react-native-video';

class RevibePlayer extends Component{

  constructor(props) {
      super(props);
      this.state={ setDuration: false,
                }
      this._player = React.createRef();
  }



  render() {

    return (
      <View style={this.props.playerVisible ? styles.videoPlayerContainer : {flex: 0.2}} >

        <Video
         source={{uri: "https://revibe-media.s3.amazonaws.com/media/audio/songs/"+this.props.playlist[this.props.currentIndex].uri+".mp3"}}   // Can be a URL or a local file.
         ref={this._player}
         audioOnly={true}
         playInBackground={true}
         playWhenInactive={true}
         paused={!this.props.isPlaying}         // control playback of video with true/false
         onProgress={async (e) => {
           // if(!this.props.time.max) {
           //   this.props.setSongDuration(await this._player.current.getDuration())
           // }
           // console.log(e);
         }}
       />
       </View>
       
    );

  }
}


function mapStateToProps(state) {
  return {
    playlist: state.audioState.playlist,
    currentIndex: state.audioState.currentIndex,
    isPlaying: state.audioState.isPlaying,
    time: state.audioState.time,
    platforms: state.platformState.platforms,
  }
};

const mapDispatchToProps = dispatch => ({
  updatePlatformData: (platform) => dispatch(updatePlatformData(platform)),
  setSongDuration: (time) => dispatch(setSongDuration(time)),
  updateSongTime: (time) => dispatch(updateSongTime(time)),
  resumeSong: () => dispatch(resumeSong()),
  pauseSong: (time) => dispatch(pauseSong()),

});


export default connect(mapStateToProps, mapDispatchToProps)(RevibePlayer)
