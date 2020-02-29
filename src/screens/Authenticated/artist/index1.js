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
import {
  StyleSheet,
  Image,
  ImageBackground,
  Platform,
  TouchableNativeFeedback,
  ScrollView,
  Dimensions
} from "react-native";
import { Block, theme } from "galio-framework";

import ImageLoad from 'react-native-image-placeholder';
import { BarIndicator } from 'react-native-indicators';

import TouchableNativeFeed from "../../../components/TouchableNativeFeedback";
import { getPlatform } from '../../../api/utils';
import styles from "./styles";

const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

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
      <Block flex style={styles1.profile}>
        <Block flex>
          <ImageBackground
            source={this.getArtistImage()}
            style={styles1.profileContainer}
            imageStyle={styles1.profileBackground}
          >
          <Button
            transparent
            style={{marginTop: 30}}
            onPress={() => this.props.navigation.goBack()}>
            <Icon name="ios-arrow-back" style={{color:"white"}}/>
          </Button>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ width, marginTop: "25%" }}
            >
              <Block flex style={styles1.profileCard}>
                <Block middle style={styles1.avatarContainer}>
                  <Image
                    source={ this.getArtistImage() }
                    style={styles1.avatar}
                  />
                </Block>

                <Block flex>
                  <Block middle style={styles1.nameInfo}>
                    <Text style={styles.artistName} size={28} color="#32325D">
                      {this.artist.name}
                    </Text>
                  </Block>
                  <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                    <Block style={styles1.divider} />
                  </Block>

                  <Block
                    row
                    style={{ paddingVertical: 14 }}
                    space="between"
                  >
                    <Text bold size={16} color="#525F7F" style={{ marginTop: 3 }}>
                      Album
                    </Text>
                    <Button
                      small
                      color="transparent"
                      textStyle={{ color: "#5E72E4", fontSize: 14 }}
                    >
                    <Text bold size={16} color="#525F7F" style={{ marginTop: 3 }}>
                      View all
                      </Text>

                    </Button>
                  </Block>
                  <Block style={{ paddingBottom: 20 }}>
                    <Block row space="between" style={{ flexWrap: "wrap" }}>

                    </Block>
                  </Block>
                </Block>
              </Block>
              <Block style={{ marginBottom: 25 }}/>
            </ScrollView>
          </ImageBackground>
        </Block>
      </Block>

      </>
    );
  }
}
const styles1 = StyleSheet.create({
  profile: {
    marginTop: Platform.OS === "android" ? 20 : 0,
    // marginBottom: -HeaderHeight * 2,
    flex: 1
  },
  profileContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: 1
  },
  profileBackground: {
    width: width,
    height: height / 2
  },
  profileCard: {
    // position: "relative",
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: 65,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: "#121212",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2
  },
  info: {
    paddingHorizontal: 40
  },
  avatarContainer: {
    position: "relative",
    marginTop: -80
  },
  avatar: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 0
  },
  nameInfo: {
    marginTop: 35
  },
  divider: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#E9ECEF"
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure
  }
});

export default Artist;

// <Container style={styles.container}>
//   <Content>
//     <View style={styles.center}>
//         <Image
//         style={styles.artistImgBlur}
//         source={this.getArtistImage()}
//         blurRadius={15}
//         opacity={.5}
//         />
//       <View style={{backgroundColor:"#22222"}}>
//         <ImageLoad
//           isShowActivity={false}
//           style={styles.artistImg}
//           placeholderStyle={styles.artistPlaceholderImg}
//           source={this.getArtistImage()}
//           placeholderSource={require("./../../../../assets/userPlaceholder.png")}
//         />
//         </View>
//         <View style={styles.artistNameView}>
//           <Text style={styles.artistName}>{this.artist.name}</Text>
//         </View>
//       </View>
//       {this.state.loading  ?
//         <View style={styles.loadingIndicator}>
//           <BarIndicator animationDuration={700} color='#7248bd' count={5} />
//         </View>
//         :
//         <>
//         {Object.keys(this.state.content).map(content => {
//           if(this.state.content[content].length > 0) {
//             return (
//               <>
//                 <View style={styles.heading}>
//                   <Text style={styles.title}>
//                     {content}
//                   </Text>
//                 </View>
//
//                 <View>
//                   <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
//                     <List
//                       horizontal={true}
//                       dataArray = {this.state.content[content]}
//                       renderRow = {album => this.renderItem(album)}
//                     />
//                   </ScrollView>
//                 </View>
//               </>
//             )
//           }
//           return null
//         })}
//         </>
//       }
//   </Content>
// </Container>
