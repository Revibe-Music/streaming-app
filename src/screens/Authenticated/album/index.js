import React, { Component } from "react";
import {
  Container,
  Content,
  View,
  Button,
  Text,
  List,
  Icon,
  Header,
  Left,
  Right,
} from "native-base";
import { Image, TouchableOpacity ,Dimensions } from "react-native";
import ImageLoad from 'react-native-image-placeholder';
import { BarIndicator } from 'react-native-indicators';
import { connect } from 'react-redux';

import SongItem from "../../../components/listItems/songItem";
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
      songs: [],
    };
  }

  async componentDidMount() {
    if(this.props.navigation.state.params.songs.length < 1) {
      this.setState({ loading: true })
      var results = await this.props.navigation.state.params.platform.getAlbumTracks(this.props.navigation.state.params.album.id)
      for(var x=0; x<results.length; x++) {
        results[x].platform = this.props.navigation.state.params.platform.name
        results[x].Album = this.props.navigation.state.params.album
      }
      this.setState({ loading:false, songs: results })
    }
    else {
      this.setState({ songs: this.props.navigation.state.params.songs })
    }
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
                source={{uri:this.props.navigation.state.params.album.image}}
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
            <List
              dataArray={this.state.songs}
              renderRow={(song,index) =>
                <SongItem song={song} playlist={this.state.songs} platform={this.props.navigation.state.params.platform} navigation={this.props.navigation}/>
              }
            />
          }
          </View>
        </Content>
      </Container>
      </>
    );
  }
}

const mapDispatchToProps = dispatch => ({
    playSong: (index, playlist) => dispatch(playSong(index, playlist)),
});


export default connect(null, mapDispatchToProps)(Album)
