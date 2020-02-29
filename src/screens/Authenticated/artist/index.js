import React, { Component } from "react";
import {
  Container,
  Content,
  View,
  Button,
  Text,
  List,
  Card,
  Body,
  Icon,
  Header,
  Left,
  Right,
} from "native-base";
import { Image, TouchableNativeFeedback, ScrollView, Dimensions } from "react-native";
import ImageLoad from 'react-native-image-placeholder';
import { BarIndicator } from 'react-native-indicators';

import TouchableNativeFeed from "../../../components/TouchableNativeFeedback";
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
      content: {
        Albums: [],
        Singles: [],
        Eps: []
      }
    }

    this.renderItem = this.renderItem.bind(this)
    this.getArtistImage = this.getArtistImage.bind(this)
    this.getAlbumImage = this.getAlbumImage.bind(this)
    this.platform = getPlatform(this.props.navigation.state.params.artist.platform)
    this.artist = this.props.navigation.state.params.artist
  }

  async componentDidMount() {
    this.setState({loading: true})
    var results = await this.platform.fetchArtistAlbums(this.artist.id)

    if(this.artist.images.length < 1) {
      var artist = await this.platform.fetchArtist(this.artist.id)
      this.artist.images = artist.images
    }
    // need to get artist image here
    this.setState({
      content: {
        Albums: results.filter(x => x.type.toLowerCase() === "album"),
        Singles: results.filter(x => x.type.toLowerCase() === "single"),
        EPs: results.filter(x => x.type.toLowerCase() === "ep"),
      },
      loading:false
    })
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

  getArtistImage() {
    if(this.artist.largeImage) {
      return {uri: this.artist.largeImage}
    }
    this.artist.images = Object.keys(this.artist.images).map(x => this.artist.images[x])
    if(this.artist.images.length > 0) {
      var size=0
      var index = 0
      for(var x=0; x<this.artist.images.length; x++) {
        if(this.artist.images[x].height > size) {
          if(this.artist.images[x].height < 1000) {
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
    if(album.largeImage) {
      return album.largeImage
    }
    if(album.images.length > 0) {
      var size=0
      var index = 0
      for(var x=0; x<album.images.length; x++) {
        if(album.images[x].height > size) {
          size = album.images[x].height
          index = x
        }
      }
      return {uri: album.images[index].url}
    }
    return require("./../../../../assets/albumPlaceholder.png")
  }

  renderItem(item) {
    return(
      <TouchableNativeFeed
        onPress={() => this.goToAlbum(item)}
        background={TouchableNativeFeedback.Ripple("white")}
        delayPressIn={0}
        useForeground
      >
        <Card style={styles.card} noShadow={true}>
          <View style={{backgroundColor:"#22222"}}>
            <ImageLoad
              isShowActivity={false}
              style={[styles.cardImg]}
              placeholderStyle={styles.cardImgPlaceholder}
              source={this.getAlbumImage(item)}
              placeholderSource={require("./../../../../assets/albumPlaceholder.png")}
            />
          </View>
          <Body style={styles.cardItem}>
          <View style={styles.radioCardName}>
            <View style={{ flex: 0.5}}>
              <Text style={styles.text} lineBreakMode="tail" ellipsizeMode="tail" numberOfLines={1}>
                {item.name}
              </Text>
            </View>
            <View style={{ flex: 0.5}}>
            </View>
          </View>
        </Body>
      </Card>
    </TouchableNativeFeed>
    )

  }


  render() {
    return (
      <>
      <Header style={{backgroundColor: "#121212", borderBottomWidth: 0}} androidStatusBarColor="#222325" iosBarStyle="light-content">
        <Left>
          <Button
            transparent
            onPress={() => this.props.navigation.goBack()}>
            <Icon name="ios-arrow-back" style={{color:"white"}}/>
          </Button>
        </Left>
      </Header>
      <Container style={styles.container}>
        <Content>
          <View style={styles.center}>
              <Image
              style={styles.artistImgBlur}
              source={this.getArtistImage()}
              blurRadius={15}
              opacity={.5}
              />
            <View style={{backgroundColor:"#22222"}}>
              <ImageLoad
                isShowActivity={false}
                style={styles.artistImg}
                placeholderStyle={styles.artistPlaceholderImg}
                source={this.getArtistImage()}
                placeholderSource={require("./../../../../assets/userPlaceholder.png")}
              />
              </View>
              <View style={styles.artistNameView}>
                <Text style={styles.artistName}>{this.artist.name}</Text>
              </View>
            </View>
            {this.state.loading  ?
              <View style={styles.loadingIndicator}>
                <BarIndicator animationDuration={700} color='#7248bd' count={5} />
              </View>
              :
              <>
              {Object.keys(this.state.content).map(content => {
                if(this.state.content[content].length > 0) {
                  return (
                    <>
                      <View style={styles.heading}>
                        <Text style={styles.title}>
                          {content}
                        </Text>
                      </View>

                      <View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
                          <List
                            horizontal={true}
                            dataArray = {this.state.content[content]}
                            renderRow = {album => this.renderItem(album)}
                          />
                        </ScrollView>
                      </View>
                    </>
                  )
                }
                return null
              })}
              </>
            }
        </Content>
      </Container>
      </>
    );
  }
}

export default Artist;
