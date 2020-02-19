import React, { Component } from "react";
import { Button, Icon } from "native-base";
import { View } from "react-native";
import { connect } from 'react-redux';
import { pauseSong, resumeSong, updateAudioInterupt } from './../../redux/audio/actions';
import styles from "./styles";


class PlayButton extends Component{

  constructor(props) {
    super(props);

    this.set_resume = this.set_resume.bind(this);
    this.set_pause = this.set_pause.bind(this);

  }

  componentDidUpdate(prevProps) {
    if(prevProps.connected && !this.props.connected) {
      this.pauseTimeout()
    }
    else if (!prevProps.connected && this.props.connected) {
      if(this.props.audioInterupted) {
        var currentTime = new Date();
        var timeDiff = Math.abs(currentTime - this.props.audioInteruptTime) / 60000;
        if(timeDiff <= 2) {
          this.set_resume();
        }
        this.props.updateAudioInterupt(false, null)
      }
      else if(this.connectionPause) {
        this.clearPauseTimeout()
      }
    }
  }

  componentDidMount() {
    if(!this.props.connected ) {
      this.set_pause()
    }
  }

  pauseTimeout = () => {
    if(!this.timeout) {
      this.connectionPause = setTimeout(() => {
        if(this.connectionPause) {
          this.set_pause()
          this.props.updateAudioInterupt(true, new Date())
        }
      }, 7000)
    }

  }

  clearPauseTimeout = () => {
    clearTimeout(this.connectionPause)
    this.connectionPause = null
  }

  set_resume(){
    if(this.props.connected) {
      this.props.resumeSong();
    }
  }

  set_pause(){
    this.props.pauseSong();
  }

  render() {
    return (
        <>
        {this.props.isPlaying?
            <Button
            transparent
            style={styles.controlBtn}
            color="white"
            onPress={() => this.set_pause()}
            >
                <Icon type="MaterialCommunityIcons" name="pause-circle-outline" style={{color: "white", fontSize:this.props.size}}/>
            </Button>
            :
            <Button
            transparent
            style={{backgroundColor: "transparent",height:null}}
            color="white"
            onPress={() => this.set_resume()}
            >
                <Icon type="MaterialCommunityIcons" name="play-circle-outline" style={{color: "white", fontSize:this.props.size}}/>
            </Button>
        }
        </>
    );
  }
}


function mapStateToProps(state) {
  return {
    isPlaying: state.audioState.isPlaying,
    connected: state.connectionState.connected,
    audioInterupted: state.audioState.audioInterupted,
    audioInteruptTime: state.audioState.audioInteruptTime
  }
};

const mapDispatchToProps = dispatch => ({
    pauseSong: () =>dispatch(pauseSong()),
    resumeSong: () => dispatch(resumeSong()),
    updateAudioInterupt: (interupted, interuptTime) => dispatch(updateAudioInterupt(interupted, interuptTime)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayButton)
