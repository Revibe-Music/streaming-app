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
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
import ImageLoad from 'react-native-image-placeholder';
import { BarIndicator } from 'react-native-indicators';
import { compact } from 'lodash';
import { connect } from 'react-redux';

import OptionsMenu from "../../../components/OptionsMenu/index";
import SongItem from "../../../components/listItems/SongItem";

import { playSong } from './../../../redux/audio/actions'
import { getPlatform } from '../../../api/utils';
import styles from "./styles";


class Album extends Component {

  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      following: false,
      songs: this.props.navigation.state.params.songs.length > 0 ? this.props.navigation.state.params.songs : [],
    };
    this.getImage = this.getImage.bind(this)
    this.setArtist = this.setArtist.bind(this)
    this.platform = getPlatform(this.props.navigation.state.params.album.platform)
    this.album = this.props.navigation.state.params.album
  }

  async componentDidMount() {
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
      this.setState({ loading:false, songs: results })
    }
  }

  setArtist() {
    if(this.album.contributors) {
      var contributors = Object.keys(this.album.contributors).map(x => this.album.contributors[x])
      var contributorString = compact(contributors.map(function(x) {if(x.type === "Artist") return x.artist.name})).join(', ')
      return  `Album • ${contributorString}`
    }
    return  ""


  }

  getImage() {
    if(this.album.largeImage) {
      return {uri: this.album.largeImage}
    }
    this.album.images = Object.keys(this.album.images).map(x => this.album.images[x])
    if(this.album.images.length > 0) {
      var size=0
      var index = 0
      for(var x=0; x<this.album.images.length; x++) {
        if(this.album.images[x].height > size) {
          size = this.album.images[x].height
          index = x
        }
      }
      return {uri: this.album.images[index].url}
    }
    return require("./../../../../assets/albumPlaceholder.png")
  }


  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />
        <HeaderImageScrollView
          maxHeight={hp("30")}
          minHeight={hp("10")}
          maxOverlayOpacity={0.6}
          minOverlayOpacity={0.3}
          fadeOutForeground
          scrollViewBackgroundColor="#121212"
          renderHeader={() => (
            <ImageLoad
              isShowActivity={false}
              style={styles.image}
              placeholderStyle={styles.image}
              source={this.getImage()}
              placeholderSource={require("./../../../../assets/albumArtPlaceholder.png")}
            />
          )}
          renderFixedForeground={() => (
            <Animatable.View
              style={styles.navTitleView}
              ref={navTitleView => {
                this.navTitleView = navTitleView;
              }}
            >
              <Text style={styles.navTitle}>{this.props.navigation.state.params.album.name}</Text>
            </Animatable.View>
          )}
          renderForeground={() => (
            <View style={styles.titleContainer}>
              <Text style={styles.imageTitle}>{this.props.navigation.state.params.album.name}</Text>
            </View>
          )}
          renderTouchableFixedForeground={() => (
            <View style={styles.backArrowContainer}>
              <Button
                transparent
                title=""
                onPress={() => this.props.navigation.goBack()}>
                <Icon name="ios-arrow-back" style={{color:"white", fontSize: 30}}/>
              </Button>
            </View>
          )}
        >

          <TriggeringView
            style={styles.section}
            onHide={() => this.navTitleView.fadeInUp(200)}
            onDisplay={() => this.navTitleView.fadeOut(100)}
          >
            <View style={styles.title}>
              <Text style={styles.title}>{this.setArtist()}</Text>
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
                  />
                ))}
                </View>
              :
              <View style={styles.textContainer}>
                <Text style={styles.noDataText}>There are no songs in this album.</Text>
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


export default connect(null, mapDispatchToProps)(Album)
