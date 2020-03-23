import React, { Component } from "react";
import { View, Text, Alert, Image, TouchableOpacity, Animated} from "react-native";
import Modal from "react-native-modal";
import { Container,Content,Header,Left,Right,Body,Button,Icon,Footer, FooterTab } from "native-base";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { throttle } from 'lodash';
import { getColorFromURL } from 'rn-dominant-color';
import LinearGradient from 'react-native-linear-gradient';
import DeviceInfo from 'react-native-device-info';

import TouchableNativeFeed from "../../components/TouchableNativeFeedback";
import PreviousButton from "./../audioControls/previousButton.js";
import NextButton from "./../audioControls/nextButton";
import PlayButton from "./../audioControls/playButton";
import SongInfo from "./../audioControls/songInfo";
import Scrubber from "./../audioControls/scrubber";
import ImageSwiper from "./../audioControls/imageSwiper";
import VideoPlayer from "./../audioControls/videoPlayer";
import Queue from "./../queue/index";
import SlidingUpPanel from 'rn-sliding-up-panel';
import OfflineNotice from './../offlineNotice/index';
import TrackPlayer from './../../api/TrackPlayer'

import styles from "./styles";
import { selectSong } from './../../redux/navigation/actions'
import { continuousTimeUpdate } from './../../redux/audio/actions';
import { connect } from 'react-redux';

const device = DeviceInfo.getModel();
const playerHeight = device.includes("X") || device.includes("11") ? hp("89.5%") : hp("93%")


class Player extends Component {

    static navigationOptions = {
      header:  null
    };

    constructor(props){
        super(props);
        this.state = {
          playerVisible:false, // are the contents of the player visible (they can be visible while dragging up from minimized position)
          playerOpen: false,  // is the state of the player minimized or maximized
          showQueue: false,
          primaryColor: "#121212",
          secondaryColor: "#121212",
        }
        this.animatedValue = new Animated.Value(0)
        this.toggleOptionsMenu = this.toggleOptionsMenu.bind(this);
        this.togglePlayerModal = this.togglePlayerModal.bind(this);
        this.handlePlayerDrag = this.handlePlayerDrag.bind(this);
        this.onAnimatedValueChange = this.onAnimatedValueChange.bind(this);
        this.listener = this.animatedValue.addListener(throttle(this.onAnimatedValueChange, 100)) //need to throttle bc if not show/hide animation is slow

    }

    async componentDidUpdate(prevProps) {
      // very tempory way to close player when user selects go to artist
      // or go to album to get plyer to close. The issue is that if
      // user is already on artist or album page then existing options menu
      // also closes the player. Will need to figure out how to get active page
      // from navigation
      if(this.props.hasAudio) {
        if(prevProps.playlist.length > 0) {
          try{
            if(prevProps.playlist[prevProps.currentIndex].album.images[1].url !== this.props.playlist[this.props.currentIndex].album.images[1].url) {
              var color = await getColorFromURL(this.props.playlist[this.props.currentIndex].album.images[1].url)
              this.setState({primaryColor: color.primary, secondaryColor: color.secondary})
            }
          }
          catch(error) {
            console.log("ERROR:",error);
          }

        }
        else if(this.props.playlist.length > 0) {
          var color = await getColorFromURL(this.props.playlist[this.props.currentIndex].album.images[1].url)
          this.setState({primaryColor: color.primary, secondaryColor: color.secondary})
        }
        if(prevProps.selectedSong && !this.props.selectedSong) {
          var routes = this.props.navigation.state.routes
          for(var x=0; x<routes.length; x++) {
            if(routes[x].routes.length > 1) {
              this._panel.hide()
              this.props.navigation.setParams({ visible: true })
              break
            }
          }
        }
      }
    }

    toggleOptionsMenu() {
      this.props.selectSong(this.props.playlist[this.props.currentIndex])
    }

    onAnimatedValueChange({ value }) {
      // Fired when the panel is moving
      if(value > hp("6%")) {
        if(!this.state.playerVisible) {
          this.setState({playerVisible:true})
          this.props.navigation.setParams({ visible: false })
        }
      }
      else if(this.state.playerVisible){
        this.setState({playerVisible:false})
        this.props.navigation.setParams({ visible: true })
      }
    }

    handlePlayerDrag(value) {
      if(this.state.playerOpen) {
        // if player is open, but dragged beloew 75% of screen height, close the player
        if(value < hp("75")) {
          this._panel.hide()
          this.setState({playerOpen: false, showQueue: false})
        }
        else {
          this._panel.show()
        }
      }
      else {
        // if player is closed, but dragged above 20% of screen height, open the player
        if(value > hp("15%")) {
          this._panel.show()
          this.setState({playerOpen: true})
        }
        else {
          this._panel.hide()
        }
      }
    }

    togglePlayerModal() {
      // KNOWN ISSUE (hard for user to replicate though):
      // if min player is presses, then user immidiately swipes down,
      // the animatedValue even listener isnt reattached in time so player disappears

      this.animatedValue.removeListener(this.listener)
      if(this.state.playerVisible) {
        this.setState({showQueue: false})
        this._panel.hide()
        this.props.navigation.setParams({ visible: true })
      }
      else {
        this._panel.show()
        this.props.navigation.setParams({ visible: false })
      }
      var playerState = !this.state.playerVisible
      this.setState({playerVisible: playerState, playerOpen: playerState})
      setTimeout(() => {
        this.listener = this.animatedValue.addListener(this.onAnimatedValueChange)
      },300)
    }


    playerTop() {
      if(this.props.activePlatform.toLowerCase() === "spotify") {
        var platformIcon = <Icon type="FontAwesome5" name="spotify" style={[styles.logo, {color: "#1DB954"}]} />
      }
      else if(this.props.activePlatform.toLowerCase() === "youtube") {
        var platformIcon = <Icon type="FontAwesome5" name="youtube" style={[styles.logo, {color: "red"}]} />
      }
      else {
        var platformIcon = <Image source={require('./../../../assets/revibe_logo.png')} />
      }


      if(this.state.playerVisible) {

        return (

          <>
            <Header style={styles.playerHeader} androidStatusBarColor="#222325" iosBarStyle="light-content">
              <Left>
                <Button
                  transparent onPress={() => this.togglePlayerModal()}
                >
                  <Icon name="ios-arrow-down" style={styles.playerCloseArrow}/>
                </Button>
              </Left>
              <Right>
              <View style={styles.logoContainer}>
              {platformIcon}
              </View>
              </Right>
            </Header>
            </>
          )
      }
      return null;
    }

    renderPlatform() {
      if(this.props.activePlatform != "YouTube") {
        if (this.state.playerVisible) {
          return (
            <View style={styles.albumArtContainer}>
                <ImageSwiper/>
            </View>
          );
        }
      }
      else {
        return (<VideoPlayer
                playerVisible={this.state.playerVisible}
                ref={(player) => {this.videoPlayer = player;}}
                />
              );
      }
    }

    render() {


     const playerControls = <>
                              <Scrubber/>
                              <View style={styles.controls}>
                                  <PreviousButton/>
                                  <PlayButton size={hp("9%")}/>
                                  <NextButton/>
                                </View>
                              </>;


      if (this.props.hasAudio) {
        return (

        <View style={!this.state.playerVisible ? styles.minPlayerContainer : null} >
        <SlidingUpPanel
          ref={c => this._panel = c}
          draggableRange={{top:playerHeight,bottom:0}} // top is 93% because it starts 7% up bc of tab bar bottom
          backdropOpacity={1}
          animatedValue={this.animatedValue}
          minimumVelocityThreshold={.75}
          minimumDistanceThreshold={.18}
          friction={.75}
          onDragEnd={(value) => this.handlePlayerDrag(value)}
          onMomentumDragEnd={(value) => this.handlePlayerDrag(value)}
        >


        <LinearGradient
          style={this.state.playerVisible ? styles.playerView1 : styles.playerView2}
          locations={[0,0.4,0.65]}
          colors={this.state.playerVisible && this.props.playlist[this.props.currentIndex].platform !== "YouTube"? [this.state.primaryColor, this.state.secondaryColor, '#0E0E0E'] : ['#0E0E0E', '#0E0E0E', '#0E0E0E']}
        >

          {this.playerTop()}
          <Content scrollEnabled={false}>
            <TouchableNativeFeed
              onPress={() => this.togglePlayerModal()}
              disabled={!this.state.playerVisible ? false : true}
            >
              <View style={ !this.state.playerVisible ? {alignItems: "center", justifyContent: "space-evenly", flexDirection: "row"} : null}>
                <View style={ this.props.activePlatform != "YouTube" ? {flex: .2} : null}/>
                {this.renderPlatform()}
                { this.state.playerVisible ?
                  <>
                  <View style={{flex: 0.8, alignItems: "center"}}>
                    <SongInfo
                      name={this.props.playlist[this.props.currentIndex].name}
                      artists={this.props.playlist[this.props.currentIndex].contributors}
                      playerVisible={this.state.playerVisible}
                    />
                    <View style={{flexDirection: "row", marginTop: 10}}>
                      <View style={{alignItems: "flex-start", width: "50%", paddingLeft:"10%"}}>
                        <Button
                          transparent
                          onPress={this.toggleOptionsMenu}
                        >
                          <Icon type="MaterialCommunityIcons" name="dots-horizontal-circle-outline" style={styles.playerIcons}/>
                        </Button>
                      </View>
                      <View style={{alignItems: "flex-end", width: "50%", paddingRight:"10%"}}>
                        <Button
                          transparent
                          onPress={() => this.setState({showQueue: true})}
                        >
                          <Icon type="MaterialIcons" name="queue-music" style={styles.playerIcons}/>
                        </Button>
                      </View>
                    </View>
                  </View>

                    {playerControls}

                  </>
                  :
                    <>
                    <SongInfo
                      name={this.props.playlist[this.props.currentIndex].name}
                      artists={this.props.playlist[this.props.currentIndex].contributors}
                      playerVisible={this.state.playerVisible}
                    />
                    <View style={{flex: 0.2, alignItems: "center"}}>
                      <PlayButton size={hp("3.5%")}/>
                    </View>
                    </>
                }
              </View>
            </TouchableNativeFeed>
            { this.state.playerVisible ? <OfflineNotice /> : null }
            </Content>
            </LinearGradient>


        </SlidingUpPanel>
        <Queue visible={this.state.showQueue} onClose={() => this.setState({showQueue: false})}/>
        </View>

      );
      }

    return null;
    }
}

function mapStateToProps(state) {
  return {
    playlist: state.audioState.playlist,
    currentIndex: state.audioState.currentIndex,
    hasAudio: state.audioState.hasAudio,
    activePlatform: state.audioState.activePlatform,
    selectedSong: state.naviationState.selectedSong,
  }
};

const mapDispatchToProps = dispatch => ({
    selectSong: (song) => dispatch(selectSong(song)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Player)
