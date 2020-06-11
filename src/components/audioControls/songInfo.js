import React, { Component } from "react";
import { Button, Icon, Text } from "native-base";
import { View, Image } from "react-native";
import TextTicker from 'react-native-text-ticker'
import { connect } from 'react-redux';
import { compact } from 'lodash';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import styles from "./styles";

class SongInfo extends Component{

  constructor(props) {
    super(props);
  }

  getPlatformLogo = () => {
    if(this.props.playlist[this.props.currentIndex].platform.toLowerCase() === "spotify") {
      return <Icon type="FontAwesome5" name="spotify" style={[styles.logo, {color: "#1DB954"}]} />
    }
    else if(this.props.playlist[this.props.currentIndex].platform.toLowerCase() === "youtube") {
      return <Icon type="FontAwesome5" name="youtube" style={[styles.logo, {color: "red"}]} />
    }
    else {
      return <Image style={{height: hp(2), width: hp(2)}} source={require('./../../../assets/revibe_logo.png')} />
    }
  }

  render() {
    var contributors = Object.keys(this.props.playlist[this.props.currentIndex].contributors).map(x => this.props.playlist[this.props.currentIndex].contributors[x])
    var contributorString = compact(contributors.map(function(x) {if(x.type === "Artist") return x.artist.name})).join(', ')
    if(this.props.playerVisible) {
      return (
        <View style={styles.openPlayerSongDetailsContainer}>
        <TextTicker
          style={styles.openPlayerSongName}
          animationType="scroll"
          duration={9000}
          scrollingSpeed={50}
          scroll={false}
          loop
          repeatSpacer={100}
          marqueeDelay={2000}
        >
        {this.props.playlist[this.props.currentIndex].name}
        </TextTicker>
        <View style={{alignItems: "center", justifyContent: "center", flexDirection: "row", marginTop: hp(.5)}}>
          {this.getPlatformLogo()}
          <Text style={styles.openPlayerArtistName} lineBreakMode="tail" ellipsizeMode="tail" numberOfLines={1}>{contributorString}</Text>
        </View>
        </View>
      );
    }
    else {
      return (
        <View style={styles.closedPlayerSongDetailsContainer}>
          <Text style={styles.closedPlayerSongName} lineBreakMode="tail" ellipsizeMode="tail" numberOfLines={1}>{this.props.playlist[this.props.currentIndex].name}</Text>
          <Text style={styles.closedPlayerArtistName} lineBreakMode="tail" ellipsizeMode="tail" numberOfLines={1}>{contributorString}</Text>
        </View>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    playlist: state.audioState.playlist,
    currentIndex: state.audioState.currentIndex,
  }
};

export default connect(mapStateToProps)(SongInfo)
