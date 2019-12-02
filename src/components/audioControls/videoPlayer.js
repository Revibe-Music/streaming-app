import React, { Component } from "react";
import { connect } from 'react-redux';
import { Image, View } from "react-native";
import ImageLoad from 'react-native-image-placeholder';
import { updatePlatformData } from './../../redux/platform/actions';
import { setSongDuration, updateSongTime, resumeSong, pauseSong } from './../../redux/audio/actions';
import styles from "./styles";
import YouTube from 'react-native-youtube';

class VideoPlayer extends Component{

  constructor(props) {
      super(props);
      this.state={ setDuration: false,
                  videoLoaded: false
                }
      this._player = React.createRef();
  }

  showPlaceholder() {
    if(!this.state.videoLoaded && this.props.playerVisible) {
      return (
        <ImageLoad
            style={styles.videoPlayerStyle}
            isShowActivity={false}
            source={{ uri: this.props.playlist[this.props.currentIndex].Album.image}}
            placeholderSource={require("./../../../assets/albumArtPlaceholder.png")}
        />
      )
    }
  }


  render() {
    // { this.showPlaceholder()}

    return (
      <View style={this.props.playerVisible ? styles.videoPlayerContainer : {flex: 0.2}} >
        <YouTube
          videoId={this.props.playlist[this.props.currentIndex].uri}   // The YouTube video ID
          origin="http://www.youtube.com"
          play={this.props.isPlaying}         // control playback of video with true/false
          controls={0}
          showinfo={false}
          modestbranding={true}
          showFullscreenButton={true}
          rel={false}
          style={this.props.playerVisible ? styles.videoPlayerStyle : styles.minVideoStyle}
          ref={this._player}
          onReady={(e) => {
            var platform = this.props.platforms["YouTube"]
            platform.player = this._player
            this.props.updatePlatformData(platform)
            this.setState({ videoLoaded: true })
          }}
          onProgress={async (e) => {
            if(!this.props.time.max) {
              this.props.setSongDuration(await this._player.current.getDuration())
            }
          }}
          onChangeState={e => {
              if(e.state === "playing") {
              this.props.resumeSong()
            }
            else if (e.state === "paused") {
              this.props.pauseSong()
            }
          }}
          onError={e => {
            console.log(e);
            this._player.reloadIframe()
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


export default connect(mapStateToProps, mapDispatchToProps)(VideoPlayer)
