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
    this.platform = getPlatform(this.props.navigation.state.params.artist.platform)
    this.artist = this.props.navigation.state.params.artist
  }

  async componentDidMount() {
    this.setState({loading: true})
    var results = await this.platform.fetchArtistAlbums(this.artist.id)
    // need to get artist image here
    this.setState({
      artistImg: results.artistImg,
      content: {
        Albums: results.filter(x => x.type === "Album"),
        Singles: results.filter(x => x.type === "Single"),
        EPs: results.filter(x => x.type === "EP"),
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
              source={{uri: item.mediumImage ? item.mediumImage : item.images[2].url}}
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
        <Right>
          <Button
          transparent
          onPress={() => {
            console.log("Should give artist options");
          }}
          >
            <Icon name="md-more" style={{color:"white"}}/>
          </Button>
        </Right>
      </Header>
      <Container style={styles.container}>
        <Content>
          <View style={styles.center}>
              <Image
              style={styles.artistImgBlur}
              source={{uri: this.state.artistImg}}
              blurRadius={15}
              opacity={.5}
              />
            <View style={{backgroundColor:"#22222"}}>
              <ImageLoad
                isShowActivity={false}
                style={styles.artistImg}
                placeholderStyle={styles.artistPlaceholderImg}
                source={{uri: this.state.artistImg}}
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
