import React, { Component } from "react";
import { View, Text, Alert, Image, Dimensions, Animated} from "react-native";
import Modal from "react-native-modal";
import { Container,Content,Header,Left,Right,Body,Button,Icon,Footer, FooterTab } from "native-base";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { throttle } from 'lodash';

import TouchableNativeFeed from "../../components/TouchableNativeFeedback";
import PreviousButton from "./../audioControls/previousButton.js";
import NextButton from "./../audioControls/nextButton";
import PlayButton from "./../audioControls/playButton";
import SongInfo from "./../audioControls/songInfo";
import Scrubber from "./../audioControls/scrubber";
import ImageSwiper from "./../audioControls/imageSwiper";
import VideoPlayer from "./../audioControls/videoPlayer";
import SlidingUpPanel from 'rn-sliding-up-panel';
import OfflineNotice from './../offlineNotice/index';
import styles from "./styles";
import { continuousTimeUpdate } from './../../redux/audio/actions';
import { connect } from 'react-redux';


class Player extends Component {

    static navigationOptions = {
      header:  null
    };

    constructor(props){
        super(props);
        this.state = {
          playerVisible:false, // are the contents of the player visible (they can be visible while dragging up from minimized position)
          playerOpen: false,  // is the state of the player minimized or maximized
        }
        this.animatedValue = new Animated.Value(0)
        this.togglePlayerModal = this.togglePlayerModal.bind(this);
        this.onAnimatedValueChange = this.onAnimatedValueChange.bind(this);
        this.listener = this.animatedValue.addListener(throttle(this.onAnimatedValueChange, 100)) //need to throttle bc if not show/hide animation is slow
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
          this.setState({playerOpen: false})
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
      var platformIconName = this.props.activePlatform.toLowerCase()
      var platformIconColor = platformIconName === "spotify" ? "#1DB954" : "red"

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
              <Body style={styles.headerBody}>
              <OfflineNotice />
              </Body>
              <Right>
              <View style={styles.logoContainer}>
              <Icon type="FontAwesome5" name={platformIconName} style={[styles.logo, {color: platformIconColor}]} />
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
          draggableRange={{top:hp("93%"),bottom:0}} // top is 93% because it starts 7% up bc of tab bar bottom
          backdropOpacity={1}
          animatedValue={this.animatedValue}
          minimumVelocityThreshold={.75}
          minimumDistanceThreshold={.18}
          friction={.75}
          onDragEnd={(value) => this.handlePlayerDrag(value)}
          onMomentumDragEnd={(value) => this.handlePlayerDrag(value)}
        >
        <Container style={{backgroundColor:"#0E0E0E"}} >

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
                  <SongInfo playerVisible={this.state.playerVisible}/>
                  </View>
                    {playerControls}

                  </>
                  :
                    <>
                    <SongInfo playerVisible={this.state.playerVisible}/>
                    <View style={{flex: 0.2, alignItems: "center"}}>
                      <PlayButton size={hp("3.5%")}/>
                    </View>
                    </>
                }
              </View>
            </TouchableNativeFeed>
            </Content>
          </Container>

        </SlidingUpPanel>
        </View>

      );
      }

    return null;
    }
}

function mapStateToProps(state) {
  return {
    hasAudio: state.audioState.hasAudio,
    activePlatform: state.audioState.activePlatform,
  }
};

export default connect(mapStateToProps)(Player)
