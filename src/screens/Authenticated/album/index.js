import React, { Component } from 'react';
import { View, Button, Text, Icon,} from "native-base";
import { BarIndicator } from 'react-native-indicators';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { compact } from 'lodash';
import { connect } from 'react-redux';

import ParalaxContainer from "../../../components/containers/paralaxContainer";
import SongItem from "../../../components/listItems/songItem";

import { playSong } from './../../../redux/audio/actions'
import { getPlatform } from '../../../api/utils';
import { logEvent } from '../../../amplitude/amplitude';
import { createBranchUniversalObject } from '../../../navigation/branch'

import styles from "./styles";


class Album extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      following: false,
      secondaryColor: "#121212",
      songs: this.props.navigation.state.params.songs.length > 0 ? this.props.navigation.state.params.songs : [],
      branchUniversalObject: null
    };
    this.getImage = this.getImage.bind(this)
    this.setArtist = this.setArtist.bind(this)
    this.displayNumSongs = this.displayNumSongs.bind(this)

    // this.platform = getPlatform(this.props.navigation.state.params.album.platform)
    // this.album = this.props.navigation.state.params.album
    if(this.props.navigation.state.params.album) {
      this.album = this.props.navigation.state.params.album
      this.platform = getPlatform(this.props.navigation.state.params.album.platform)
    }
    else if(this.props.navigation.state.params.id){
      this.album = {
        id: this.props.navigation.state.params.id,
        images: []
      }
      this.platform = getPlatform(this.props.navigation.state.params.platform)
    }
  }

  async componentDidMount() {
    if(this.album.images.length < 1) {
      this.album = await this.platform.fetchAlbum(this.album.id)
    }
    if(this.state.songs.length < 1) {
      this.setState({ loading: true })
      var results = await this.platform.fetchAlbumSongs(this.album.id)
      if(results.length > 0) {
        if(!results[0].album) {
          for(var x=0; x<results.length; x++) {
            results[x].album = this.album
          }
        }
      }
      this.setState({ loading:false, songs: results,})
    }
    var title = "Revibe Album"
    var contentType = "album";

    if(this.props.navigation.state.params.hasOwnProperty("album")) {
      if(this.props.navigation.state.params.album.hasOwnProperty("type")) {
        title = this.props.navigation.state.params.album.type === "song" ? "Revibe Song" : "Revibe Album"
        contentType = this.props.navigation.state.params.album.type === "song" ? "song" : "album"
      }
    }
    var object = await createBranchUniversalObject(this.album.name, title, this.album.images[1].url, this.album.platform, contentType, this.album.id)
    this.setState({branchUniversalObject: object})
  }

  componentWillUnmount() {
    if(this.state.branchUniversalObject !== null) {
      this.state.branchUniversalObject.release()
    }
    // Need to call branchUniversalObject.release() here
  }

  setArtist() {
    if(this.album.contributors) {
      if(this.album.platform === "YouTube") {
        if(this.props.navigation.state.params.songs.length > 0) {
          return "Video • "+this.album.name
        }
        else {
          return "Channel • YouTube"
        }
      }
      this.album.contributors = Object.keys(this.album.contributors).map(x => this.album.contributors[x])
      if(this.album.contributors.length > 0) {
        var contributors = Object.keys(this.album.contributors).map(x => this.album.contributors[x])
        var contributorString = compact(contributors.map(function(x) {if(x.type === "Artist") return x.artist.name})).join(', ')
        var albumType = this.album.type.charAt(0).toUpperCase() + this.album.type.slice(1)
        return  `${albumType} • ${contributorString}`
      }
    }
    return  ""
  }

  getImage() {
    this.album.images = Object.keys(this.album.images).map(x => this.album.images[x])
    if(this.album.images.length > 0) {
      var size=0
      var index = 0
      for(var x=0; x<this.album.images.length; x++) {
        if(this.album.images[x].height < 1000) {
          if(this.album.images[x].height > size) {
            size = this.album.images[x].height
            index = x
          }
        }
      }
      return {uri: this.album.images[index].url}
    }
    return require("./../../../../assets/albumPlaceholder.png")
  }

  displayNumSongs() {
    if(this.state.songs.length === 1){
      return `${this.state.songs.length} Song`
    }
    return `${this.state.songs.length} Songs`
  }

  render() {
    return (
      <>
      <ParalaxContainer
        platform={this.platform.name}
        allowSharing={!this.props.navigation.state.params.isLocal}
        title={this.album.name}
        text={this.setArtist()}
        images={this.getImage()}
        branchUniversalObject={this.state.branchUniversalObject}
      >
        <View style={[styles.title, {marginTop: hp("1")}]}>
          <Text style={styles.title}>{this.setArtist()}</Text>
          <Text note style={{textAlign: "center"}}>{this.album.type !== "song" ? this.displayNumSongs() : null}</Text>
        </View>
        <View style={[styles.center, {marginBottom: hp("2")}]}>
          <Button
            rounded
            large
            onPress={() => {
              this.props.playSong(0, this.state.songs)
              logEvent("Play", "Album")
            }}
            style={styles.shuffleBtn}
          >
            <View style={styles.center}>
              <Text uppercase style={styles.shuffle}>Listen</Text>
            </View>
          </Button>
        </View>

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
                 displayImage={false}
                 displayType={false}
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
      </>
    );
  }
}

const mapDispatchToProps = dispatch => ({
    playSong: (index, playlist) => dispatch(playSong(index, playlist)),
});


export default connect(null, mapDispatchToProps)(Album)
