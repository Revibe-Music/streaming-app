import React, { Component } from 'react';
import {
  StatusBar,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TouchableNativeFeedback
} from 'react-native';
import {
  Container,
  Content,
  View,
  Button,
  Text,
  Card,
  Body,
  Icon,
  Header,
  Left,
  Right,
  List
} from "native-base";
import * as Animatable from 'react-native-animatable';
import { getColorFromURL } from 'rn-dominant-color';

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
import ImageLoad from 'react-native-image-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import ViewMoreText from 'react-native-view-more-text';

import { BarIndicator } from 'react-native-indicators';
import { compact } from 'lodash';
import { connect } from 'react-redux';

import TouchableNativeFeed from "../../../components/TouchableNativeFeedback";
import OptionsMenu from "../../../components/OptionsMenu/index";
import SongItem from "../../../components/listItems/SongItem";
import AlbumItem from "../../../components/listItems/AlbumItem";
import ViewAllItem from "../../../components/listItems/ViewAllItem";

import { playSong } from './../../../redux/audio/actions'
import { getPlatform } from '../../../api/utils';
import styles from "./styles";




class Artist extends Component {

  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      artistImage: null,
      primaryColor: "#121212",
      secondaryColor: "#121212",
      topSongs: [],
      singles: [],
      albums: [],
      eps: [],
      appearsOn: [],
      songs: []
    }

    this.renderItem = this.renderItem.bind(this)
    this.getArtistImage = this.getArtistImage.bind(this)
    this.getAlbumImage = this.getAlbumImage.bind(this)
    this.displayLogo = this.displayLogo.bind(this)
    this.platform = getPlatform(this.props.navigation.state.params.artist.platform)
    this.artist = this.props.navigation.state.params.artist
  }

  async componentDidMount() {
    this.setState({loading: true})
    var contentList = []
    contentList.push(this.platform.fetchArtistTopSongs(this.artist.id))
    contentList.push(this.platform.fetchArtistAlbums(this.artist.id))
    if(this.artist.images.length < 1) {
      // fetch artist images if none exist
      var artist = await this.platform.fetchArtist(this.artist.id)
      this.artist.images = artist.images
      var color = await getColorFromURL(this.artist.images[1].url)
      this.setState({primaryColor: color.primary,secondaryColor: color.secondary})
    }
    else {
      contentList.push(getColorFromURL(this.artist.images[1].url))
    }

    var content = await Promise.all(contentList)
    if(content.length > 2) {
      this.setState({
          topSongs: content[0],
          albums: content[1].filter(x => x.type.toLowerCase() === "album"),
          singles: content[1].filter(x => x.type.toLowerCase() === "single"),
          eps: content[1].filter(x => x.type.toLowerCase() === "ep"),
          appearsOn: content[1].filter(x => x.type.toLowerCase() === "appears_on"),
          primaryColor: content[2].primary,
          secondaryColor: content[2].secondary,
          loading:false
      })
    }
    else {
      this.setState({
          topSongs: content[0],
          albums: content[1].filter(x => x.type.toLowerCase() === "album"),
          singles: content[1].filter(x => x.type.toLowerCase() === "single"),
          eps: content[1].filter(x => x.type.toLowerCase() === "ep"),
          appearsOn: content[1].filter(x => x.type.toLowerCase() === "appears_on"),
          loading:false
      })
    }
  }

  goToAlbum(album) {
    this.props.navigation.navigate(
      {
        key: "Album",
        routeName: "Album",
        params: {
          album: album,
          songs: [],
        }
      }
    )
  }

  goToViewAll(data, type) {
    var navigationOptions = {
      key: "ViewAll"+type,
      routeName: "ViewAll",
      params: {
        data: data,
        type: type
      }
    }
    this.props.navigation.navigate(navigationOptions)
  }

  getArtistImage() {
    this.artist.images = Object.keys(this.artist.images).map(x => this.artist.images[x])
    if(this.artist.images.length > 0) {
      var size=0
      var index = 0
      for(var x=0; x<this.artist.images.length; x++) {
        if(this.artist.images[x].height < 1000) {
          if(this.artist.images[x].height > size) {
            size = this.artist.images[x].height
            index = x
          }
        }
      }
      return {uri: this.artist.images[index].url}
    }
    return require("./../../../../assets/userPlaceholder.png")
  }

  getAlbumImage(album) {
    album.images = Object.keys(album.images).map(x => album.images[x])
    if(album.images.length > 0) {
      var size=0
      var index = 0
      for(var x=0; x<album.images.length; x++) {
        if(album.images[x].height < 1000) {
          if(album.images[x].height > size) {
            size = album.images[x].height
            index = x
          }
        }
      }
      return {uri: album.images[index].url}
    }
    return require("./../../../../assets/albumPlaceholder.png")
  }

  displayLogo() {
    if(this.artist.platform.toLowerCase() === "spotify") {
      var platformIcon = <Icon type="FontAwesome5" name="spotify" style={[styles.logo, {color: "#1DB954"}]} />
    }
    else if(this.artist.platform.toLowerCase() === "youtube") {
      var platformIcon = <Icon type="FontAwesome5" name="youtube" style={[styles.logo, {color: "red"}]} />
    }
    else {
      var platformIcon = <Image source={require('./../../../../assets/revibe_logo.png')}/>
    }
    return platformIcon
  }

  renderViewMore(onPress){
      return(
        <Text style={[styles.text, {color:"#7248bd", marginLeft: hp("2.5%")}]} onPress={onPress}>View more</Text>
      )
  }

  renderViewLess(onPress){
    return(
      <Text style={[styles.text, {color:"#7248bd", marginLeft: hp("2.5%")}]} onPress={onPress}>View less</Text>
    )
  }


  renderItem(item) {
    return(
      <TouchableOpacity
      onPress={() => this.goToAlbum(item)}
      delayPressIn={0} useForeground >
        <Card style={styles.card} noShadow={false}>
          <ImageLoad
            isShowActivity={false}
            style={styles.cardImg}
            borderRadius={10}
            placeholderStyle={styles.cardImgPlaceholder}
            source={this.getAlbumImage(item)}
            placeholderSource={require("./../../../../assets/albumPlaceholder.png")}
          />
          <Body style={styles.cardItem}>
            <View style={styles.radioCardName}>
              <View style={{ flex: 0.6}}>
                <Text numberOfLines={1} style={styles.text}>
                  {item.name}
                </Text>
              </View>
            </View>
          </Body>
        </Card>
      </TouchableOpacity>
    )

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
            <ImageLoad
              isShowActivity={false}
              style={styles.artistImg}
              placeholderStyle={styles.artistImg}
              source={this.getArtistImage()}
              placeholderSource={require("./../../../../assets/userPlaceholder.png")}
            />
            </LinearGradient>

          )}
          renderFixedForeground={() => (
            <Animatable.View
              style={styles.navTitleView}
              ref={navTitleView => {
                this.navTitleView = navTitleView;
              }}
            >
              <Text style={styles.navTitle}>{this.artist.name}</Text>
            </Animatable.View>
          )}
          renderForeground={() => (
            <>
            <View style={styles.titleContainer}>
              <Text style={styles.imageTitle}>{this.artist.name}</Text>
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
              <View style={{padding: 10}}>
              {this.displayLogo()}
              </View>
            </View>
            </>
          )}
        >

          <TriggeringView
            style={styles.section}
            onHide={() => this.navTitleView.fadeInUp(200)}
            onDisplay={() => this.navTitleView.fadeOut(100)}
          >
          </TriggeringView>

          <View style={styles.container}>

            {this.state.loading  ?
              <View style={styles.loadingIndicator}>
                <BarIndicator animationDuration={700} color='#7248bd' count={5} />
              </View>
            :
              <>
              {this.state.topSongs.length > 0 ?
                <View style={{flex: 1, minHeight: 1}}>
                <View style={styles.heading}>
                  <Text style={styles.title}>
                    Top Songs
                  </Text>
                </View>
                {this.state.topSongs.slice(0,3).map(song => (
                  <SongItem
                   song={song}
                   playlist={this.state.topSongs}
                   displayImage={false}
                   displayType={false}
                   source={this.source}
                  />
                ))}
                </View>
              :
                null
              }

              {this.state.albums.length > 0 ?
                <View style={{flex: 1, minHeight: 1, marginTop: hp("2%")}}>
                  <View style={styles.titleHeader}>
                    <Text style={styles.title}>
                      Albums
                    </Text>
                    <TouchableOpacity onPress={() => this.goToViewAll(this.state.albums, "Albums")}>
                      <Text style={styles.viewAll}>
                        View All
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
                      <List
                        horizontal={true}
                        dataArray = {this.state.albums.slice(0,5)}
                        renderRow = {album => this.renderItem(album)}
                      />
                    </ScrollView>
                  </View>
                  </View>
                :
                  null
              }
              {this.state.singles.length > 0 ?
                <View style={{flex: 1, minHeight: 1, marginTop: hp("2%")}}>
                  <View style={styles.heading}>
                    <Text style={styles.title}>
                      Singles
                    </Text>
                  </View>
                  {this.state.singles.slice(0,5).map(album => (
                    <AlbumItem
                     album={album}
                     isLocal={false}
                     source="Artist"
                     navigation={this.props.navigation}
                    />
                  ))}
                  <ViewAllItem
                    type="Singles"
                    data={this.state.singles}
                    navigation={this.props.navigation}
                  />
                  </View>
              :
                null
              }
              {this.state.eps.length > 0 ?
                <View style={{flex: 1, minHeight: 1, marginTop: hp("2%")}}>
                  <View style={styles.titleHeader}>
                    <Text style={styles.title}>
                      EPs
                    </Text>
                    <TouchableOpacity onPress={() => this.goToViewAll(this.state.eps, "EPs")}>
                      <Text style={styles.viewAll}>
                        View All
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
                      <List
                        horizontal={true}
                        dataArray = {this.state.eps.slice(0,5)}
                        renderRow = {ep => this.renderItem(ep)}
                      />
                    </ScrollView>
                  </View>
                </View>
              :
                  null
              }
              {this.state.appearsOn.length > 0 ?
                <View style={{flex: 1, minHeight: 1, marginTop: hp("2%")}}>
                  <View style={styles.titleHeader}>
                    <Text style={styles.title}>
                      Appears On
                    </Text>
                    <TouchableOpacity onPress={() => this.goToViewAll(this.state.appearsOn, "Appears On")}>
                      <Text style={styles.viewAll}>
                        View All
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
                      <List
                        horizontal={true}
                        dataArray = {this.state.appearsOn.slice(0,5)}
                        renderRow = {ep => this.renderItem(ep)}
                      />
                    </ScrollView>
                  </View>
                </View>
              :
                null
              }
              {this.artist.bio ?
                <View style={{flex: 1, minHeight: 1, marginTop: hp("2%"), marginBottom: hp("3%")}}>
                  <View style={styles.heading}>
                    <Text style={styles.title}>
                      About {this.artist.name}
                    </Text>
                  </View>
                  <ViewMoreText
                    numberOfLines={2}
                    renderViewMore={this.renderViewMore}
                    renderViewLess={this.renderViewLess}
                    textStyle={styles.textContainer}
                  >
                      <Text style={styles.text}>{this.artist.bio}</Text>
                  </ViewMoreText>
                  </View>
                :
                  null
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

export default Artist;
