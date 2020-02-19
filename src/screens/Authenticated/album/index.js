import React, { Component } from "react";
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
import { Image, TouchableOpacity ,Dimensions } from "react-native";
import ImageLoad from 'react-native-image-placeholder';
import { BarIndicator } from 'react-native-indicators';
import { connect } from 'react-redux';

import List from "../../../components/lists/List";
import OptionsMenu from "../../../components/OptionsMenu/index";
import { getPlatform } from '../../../api/utils';
import { playSong } from './../../../redux/audio/actions'
import styles from "./styles";


class Album extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      following: false,
      songs: this.props.navigation.state.params.songs,
    };
    this.getImage = this.getImage.bind(this)
    this.platform = getPlatform(this.props.navigation.state.params.album.platform)
    this.album = this.props.navigation.state.params.album
    console.log(this.album);
    this.songs = this.props.navigation.state.params.songs
  }

  async componentDidMount() {
    if(this.state.songs.length < 1) {
      this.setState({ loading: true })
      var results = await this.platform.fetchAlbumSongs(this.album.id)
      this.setState({ loading:false, songs: results })
    }
  }

  getImage() {
    if(this.album.images.length > 0) {
      return this.album.mediumImage ? {uri: this.album.mediumImage} : {uri: this.album.images[2].url}
    }
    return require("./../../../../assets/albumArtPlaceholder.png")
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

          }}
          >
            <Icon name="md-more" style={{color:"white"}}/>
          </Button>
        </Right>
      </Header>

      <Container style={styles.container}>
        <Content>
          <View style={styles.center}>
          <View style={{backgroundColor:"#22222"}}>
            <ImageLoad
                isShowActivity={false}
                style={styles.albumImg}
                placeholderStyle={styles.albumImgPlaceholderImg}
                source={this.getImage()}
                placeholderSource={require("./../../../../assets/albumArtPlaceholder.png")}
            />
            </View>
            <View style={styles.albumNameView}>
              <Text style={styles.albumName}>{this.props.navigation.state.params.album.name}</Text>
            </View>

            <View style={{marginVertical: 5}}>
              <Button
              rounded
              large
              onPress={() => this.props.playSong(0, this.state.songs)}
              style={styles.shuffleBtn}>
                <Text uppercase style={styles.shuffle}>Listen</Text>
              </Button>
            </View>
          </View>
          <View>
          {this.state.loading  ?
            <View style={styles.loadingIndicator}>
              <BarIndicator animationDuration={700} color='#7248bd' count={5} />
            </View>
            :
            <View style={{minHeight: 1,}}>
              <List
                data={this.state.songs}
                type={"Song"}
                displayImage={false}
                allowRefresh={false}
                noDataText="This album is empty."
                navigation={this.props.navigation}
              />
            </View>
          }
          </View>
        </Content>
        <OptionsMenu navigation={this.props.navigation}/>
      </Container>
      </>
    );
  }
}

const mapDispatchToProps = dispatch => ({
    playSong: (index, playlist) => dispatch(playSong(index, playlist)),
});


export default connect(null, mapDispatchToProps)(Album)
