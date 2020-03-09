import React, { Component } from "react";
import Slider from "react-native-slider";
import { View } from "react-native";
import { Text } from "native-base";
import { connect } from 'react-redux';
import styles from "./styles";
import { updateSongTime, setScrubbing  } from './../../redux/audio/actions';


class Scrubber extends Component{

    constructor(props) {
      super(props);
    }

    timeFromMilliseconds = (time) => {
      var seconds = Math.floor((time / 1000) % 60);
      var minutes = Math.floor((time / (1000 * 60)) % 60);
      minutes = (minutes < 10) ? "0" + minutes : minutes;
      seconds = (seconds < 10) ? "0" + seconds : seconds;
      return minutes + ":" + seconds;
    }

    timeFromSeconds = (time) => {
      var minutes = Math.floor(time / 60);
      var seconds = Math.floor(time - minutes * 60);

      minutes = (minutes < 10) ? "0" + minutes : minutes;
      seconds = (seconds < 10) ? "0" + seconds : seconds;
      return minutes + ":" + seconds;
    }

    changeValue = (value) => {
      this.props.setScrubbing(true);
    };

    endValueChange = (value) => {
       value = Math.floor(value);
       this.props.platforms[this.props.activePlatform].seek(value);
       this.props.updateSongTime(value)
       this.props.setScrubbing(false)
    }

  render() {
    return (
      <>
        <Slider
          style={styles.seekBar}
          value={this.props.time.current}
          maximumValue={isNaN(this.props.time.max) ? 0 : this.props.time.max}
          onSlidingStart={this.changeValue}
          onSlidingComplete={this.endValueChange}
          minimumTrackTintColor="white"
          maximumTrackTintColor="grey"
          thumbStyle={styles.thumbStyle}
          thumbTouchSize={{width: 50, height: 40}}
        />
        <View style={styles.time}>
            <View style={styles.seekTimeContainer}>
                <Text style={styles.seekTime}>{this.timeFromSeconds(this.props.time.current)}</Text>
            </View>
            <View style={{flex: 0.7}}/>
            <View style={styles.seekTimeContainer}>
                <Text style={styles.seekTime}>{this.timeFromSeconds(this.props.time.max)}</Text>
            </View>
        </View>

      </>
    );
  }
}


function mapStateToProps(state) {
  return {
    time: state.audioState.time,
    platforms: state.platformState.platforms,
    activePlatform: state.audioState.activePlatform,
  }
};

const mapDispatchToProps = dispatch => ({
    updateSongTime: (time) => dispatch(updateSongTime(time)),
    setScrubbing: (time) => dispatch(setScrubbing(time)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Scrubber)
