import React, { Component } from "react";
import { Container, Content, Card, Text, List, Body, Header,Footer, FooterTab } from "native-base";
import { ScrollView, View, Image, TouchableNativeFeedback } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import TouchableNativeFeed from "../../component/TouchableNativeFeedback";
import { SpotifyParseNewReleases, SpotifyGetSavedTracks, KeyExists } from "./../../auth";
import styles from "./styles";

import RevibeAPI from "../../api/Revibe";

import MusicPlayer from "./../musicPlayer/index";
import MinPlayer from "./../minPlayer/index";
import LoadingScreen from "./../LoadingScreen";
import Spotify from 'rn-spotify-sdk';
import { connect } from 'react-redux';




class Browse extends Component {

  constructor(props) {
   super(props);

   this.revibe = new RevibeAPI()
   this.renderRow = this.renderRow.bind(this);
 }

 goToAlbum() {
   var songs = this.props.songs
   var album = this.props.album.platform === "YouTube" ? this.props.album.contributors[0].artist : this.props.album
   if(this.props.isLocal) {
     songs = getPlatform(this.props.album.platform).getSavedAlbumSongs(this.props.album.id)
     var key = album.name+"Local"
   }
   else {
     var key = album.name+"Remote"
   }
   var navigationOptions = {
     key: key,
     routeName: "Album",
     params: {
       album: album,
       songs: songs,
     }
   }
   this.props.navigation.navigate(navigationOptions)
 }


  async componentWillMount() {
      if (this.props.connected) {
        var browseContent = await this.revibe.fetchBrowseContent()
      }
      else {
        // get from realm
      }
  }

  renderRow(item) {
    return(
      <TouchableNativeFeed
      onPress={() => this.props.navigation.navigate(
        {
          key: "Album",
          routeName: "Album",
          params: {
            playlistImg: item.album_cover,
            playlistName: item.name,
          }
        }
      )}
      background={TouchableNativeFeedback.Ripple("white")} delayPressIn={0} useForeground >
        <Card style={styles.card} noShadow={true}>
          <Image source={{uri:item.album_cover}} style={styles.cardImg} />
          <Body style={styles.cardItem}>
            <View style={styles.radioCardName}>
              <View style={{ flex: 0.5}}>
                <Text style={styles.text}>
                  {item.name}
                </Text>
              </View>
              <View style={{ flex: 0.5}}>
                {/* <Text uppercase style={styles.cardSub}>
                  {album.followers}
                </Text> */}
              </View>
            </View>
          </Body>
        </Card>
      </TouchableNativeFeed>
    )
  }

  render() {
    if (!!this.props.spotifyNewReleases) {
      return (
        <Container style={styles.container} androidStatusBarColor="white" iosBarStyle="light-content">
          <Content>
            <View>
              <View>
                <Text style={styles.title}>
                  New Releases
                </Text>
              </View>
              <View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
                  <List
                    horizontal={true}
                    dataArray = {shuffle(this.props.spotifyNewReleases)}
                    renderRow = {album => this.renderRow(album)}
                  />
                </ScrollView>
              </View>

              <View>
                <Text style={styles.title}>
                  Pop
                </Text>
              </View>
              <View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
                  <List
                    horizontal={true}
                    dataArray = {shuffle(this.props.spotifyNewReleases)}
                    renderRow = {album => this.renderRow(album)}
                  />
                </ScrollView>
              </View>

              <View>
                <Text style={styles.title}>
                  Mood
                </Text>
              </View>
              <View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
                  <List
                    horizontal={true}
                    dataArray = {shuffle(this.props.spotifyNewReleases)}
                    renderRow = {album => this.renderRow(album)}
                  />
                </ScrollView>
              </View>

            </View>
          </Content>

        </Container>
      );
    }
    else {
      return <LoadingScreen />;
    }
  }
}

function mapStateToProps(state) {
  return {
    connected: state.connectionState.connected,
  }
};

const mapDispatchToProps = dispatch => ({
    fetchSpotifyNewReleases: () => dispatch(getSpotifyNewReleases()),
    getSpotifyNewReleases: () => dispatch(getSpotifyNewReleases()),
    initializeSpotifyPlayer: (token) => dispatch(initializeSpotifyPlayer(token)),
});


export default connect(mapStateToProps, mapDispatchToProps)(Browse)
