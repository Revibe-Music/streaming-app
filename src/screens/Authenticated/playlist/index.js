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

import OptionsMenu from "../../../components/OptionsMenu/index";
import SongItem from "../../../components/listItems/songItem";

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
      songs: this.props.navigation.state.params.songs,
    };

    this.playlist = this.props.navigation.state.params.playlist,
    this.getImage = this.getImage.bind(this)
  }

  async componentDidMount() {

    // var colorRequest = getColorFromURL(this.playlist.images[1].url)
    // this.setState({ primaryColor: color.primary, secondaryColor: color.secondary})

  }


  getImage() {
    return require("./../../../../assets/albumPlaceholder.png")
  }



  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />
        <HeaderImageScrollView
          maxHeight={hp("40")}
          minHeight={hp("10")}
          maxOverlayOpacity={0.5}
          minOverlayOpacity={0}
          overlayColor="#121212"
          fadeOutForeground
          scrollViewBackgroundColor="#121212"
          renderHeader={() => (
            <LinearGradient
              style={{flex:1}}
              locations={[0,0.4,0.65]}
              colors={[this.state.primaryColor, this.state.secondaryColor, '#121212']}
            >
            <View style={{top: hp("10%")}}>
            <ImageLoad
              isShowActivity={false}
              style={styles.albumImg}
              placeholderStyle={styles.albumImg}
              source={this.getImage()}
              placeholderSource={require("./../../../../assets/albumArtPlaceholder.png")}
            />
            </View>
            </LinearGradient>

          )}
          renderFixedForeground={() => (
            <Animatable.View
              style={styles.navTitleView}
              ref={navTitleView => {
                this.navTitleView = navTitleView;
              }}
            >
              <Text style={styles.navTitle}>{this.playlist.name}</Text>
            </Animatable.View>
          )}
          renderForeground={() => (
            <>
            <View style={styles.titleContainer}>
              <Text style={styles.imageTitle}>{this.playlist.name}</Text>
            </View>

            </>

          )}
          renderTouchableFixedForeground={() => (
            <>
            <View style={styles.headerContainer}>
              <Button
                transparent
                title=""
                onPress={() => this.props.navigation.goBack()}>
                <Icon name="ios-arrow-back" style={{color:"white", fontSize: 30, textAlign: "left"}}/>
              </Button>
            </View>
            </>
          )}
        >

          <TriggeringView
            style={styles.section}
            onHide={() => this.navTitleView.fadeInUp(200)}
            onDisplay={() => this.navTitleView.fadeOut(100)}
          >
          <View style={styles.title}>
            <Text note style={{textAlign: "center"}}>{this.state.songs.length} {this.state.songs.length > 1 ? "Songs" : this.state.songs.length ===0  ? "Songs" : "Song"}</Text>
          </View>

          <View style={styles.center}>
            <Button
            rounded
            large
            onPress={() => this.props.playSong(0, this.state.songs)}
            style={styles.shuffleBtn}>
            <View style={styles.center}>
              <Text uppercase style={styles.shuffle}>Listen</Text>
            </View>

            </Button>
          </View>
          </TriggeringView>

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
        </HeaderImageScrollView>
        <OptionsMenu navigation={this.props.navigation}/>
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => ({
    playSong: (index, playlist) => dispatch(playSong(index, playlist)),
});


export default connect(null, mapDispatchToProps)(Playlist)
