import React, { Component } from 'react';
import {StatusBar, Image, Dimensions, TouchableOpacity } from 'react-native';
import {
  Container,
  Content,
  View,
  Button,
  Text,
  Icon,
  Header,
  Left,
  Right,
} from "native-base";
import * as Animatable from 'react-native-animatable';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { getColorFromURL } from 'rn-dominant-color';

import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
import LinearGradient from 'react-native-linear-gradient';

import ImageLoad from 'react-native-image-placeholder';
import { BarIndicator } from 'react-native-indicators';
import { compact } from 'lodash';
import { connect } from 'react-redux';


import ParalaxContainer from "../../../components/containers/paralaxContainer";
import OptionsMenu from "../../../components/OptionsMenu/index";
import SongItem from "../../../components/listItems/songItem";
import List from "../../../components/lists/List";
import RevibeAPI from "../../../api/revibe";

import { playSong } from './../../../redux/audio/actions'
import { getPlatform } from '../../../api/utils';
import styles from "./styles";


class Playlist extends Component {

  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      primaryColor: "#121212",
      secondaryColor: "#121212",
      songs: this.props.navigation.state.params.songs.slice(0,30),
      numSongs: this.props.navigation.state.params.songs.length,
      updating: true
    };

    this.revibe = new RevibeAPI()
    this.playlist = this.revibe.playlists.filtered(`id = "${this.props.navigation.state.params.playlist.id}"`)["0"]

    this.updateContent = this.updateContent.bind(this)
  }

  async componentDidMount(){
    // var songs = this.props.navigation.state.params.songs.slice(0,30)
    // var songs = this.props.navigation.state.params.songs
    // this.setState({
    //   songs: songs,
    // })
    setTimeout(() => this._addListeners(), 500)
    setTimeout(() => {
      // var songs = this.revibe.getSavedPlaylistSongs(this.playlist.id)
      var songs = this.props.navigation.state.params.songs
      this.setState({songs: songs})
    }, 500)
    setTimeout(() => this.setState({updating: false}), 1000)
  }

  componentWillUnmount() {
    this._removeListeners()
  }

  _addListeners() {
    this.playlist.addListener(this.updateContent)
  }

  _removeListeners() {
    this.playlist.removeListener(this.updateContent)
  }

  updateContent(playlist, changes) {
    if(changes.changedProperties.filter(x => x==="songs").length > 0) {
      if(!this.state.updating) {
        this.setState({updating: true})
        var songs = this.revibe.getSavedPlaylistSongs(this.playlist.id)
        this.setState({songs: songs})
        this.setState({updating: false})
      }
    }
  }

  render() {
    return (
      <ParalaxContainer
        displayLogo={false}
        placeholderImage={require("./../../../../assets/albumArtPlaceholder.png")}
        title={`${this.playlist.name}`}
        note={`Playlist • ${this.state.numSongs} ${this.state.numSongs > 1 ? "Songs" : this.state.numSongs ===0  ? "Songs" : "Song"}`}
        showButton={true}
        onButtonPress={() => this.props.playSong(0, this.state.songs)}
        images={this.playlist.regularImage}
      >
        <View style={styles.container}>
          {this.state.loading  ?
            <View style={styles.loadingIndicator}>
              <BarIndicator animationDuration={700} color='#7248bd' count={5} />
            </View>
          :
            <>
            {this.state.songs.length > 0 ?
              <View style={{flex: 1, minHeight: 1}}>
              {this.state.songs.map(song => (
                <SongItem
                 song={song}
                 playlist={this.state.songs}
                 displayImage={true}
                 displayType={false}
                 displayLogo={true}
                 source={this.source}
                />
              ))}
              </View>
            :
            <View style={styles.textContainer}>
              <Text style={styles.noDataText}>No Songs.</Text>
            </View>
            }
            </>
          }
        </View>
      </ParalaxContainer>
    );
  }
}

const mapDispatchToProps = dispatch => ({
    playSong: (index, playlist) => dispatch(playSong(index, playlist)),
});


export default connect(null, mapDispatchToProps)(Playlist)
