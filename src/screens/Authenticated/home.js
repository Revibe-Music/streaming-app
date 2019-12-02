import React, { Component } from "react";
import { Container, Content, Card, Text, List, Body, Header,Footer, FooterTab } from "native-base";
import { ScrollView, View, Image, TouchableNativeFeedback } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import TouchableNativeFeed from "../../component/TouchableNativeFeedback";
import { SpotifyParseNewReleases, SpotifyGetSavedTracks, KeyExists } from "./../../auth";
import styles from "./styles";
import MusicPlayer from "./../musicPlayer/index";
import MinPlayer from "./../minPlayer/index";
import LoadingScreen from "./../LoadingScreen";
import Spotify from 'rn-spotify-sdk';
import { connect } from 'react-redux';

function copy(o) {
  var output, v, key;
  output = Array.isArray(o) ? [] : {};
  for (key in o) {
      v = o[key];
      output[key] = (typeof v === "object") ? copy(v) : v;
  }
  return output;
}

const shuffle = (array) => {
  let currentIndex = array.length, temp, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temp = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temp;
  }
  let arr = copy(array);
  return arr;
};


class Home extends Component {

  constructor(props) {
   super(props);


   this.renderRow = this.renderRow.bind(this);
 }


  // componentWillMount() {
  //     if (!!!this.props.spotifyNewReleases) {
  //         if(!Spotify.isInitialized()) {
  //           this.props.initializeSpotifyPlayer(this.props.accessToken);
  //         }
  //         else {
  //           this.props.fetchSpotifyNewReleases();
  //         }
  //     }
  // }

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
    spotifyNewReleases: state.spotifyState.spotifyNewReleases,
    accessToken: state.platformState.accessToken,
  }
};

const mapDispatchToProps = dispatch => ({
    fetchSpotifyNewReleases: () => dispatch(getSpotifyNewReleases()),
    getSpotifyNewReleases: () => dispatch(getSpotifyNewReleases()),
    initializeSpotifyPlayer: (token) => dispatch(initializeSpotifyPlayer(token)),
});


export default connect(mapStateToProps, mapDispatchToProps)(Home)
