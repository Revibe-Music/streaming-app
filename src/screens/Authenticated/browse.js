import React, { Component } from "react";
import { Container, Content, Card, Text, List, Header, Left, Body, Right,Icon,Footer, FooterTab } from "native-base";
import { ScrollView, View, Image, TouchableOpacity } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import styles from "./styles";

import AnimatedPopover from './../../components/animatedPopover/index';
import ArtistItem from "./../../components/listItems/ArtistItem";
import RevibeAPI from './../../api/Revibe'
import { connect } from 'react-redux';
import { compact } from 'lodash';


class Browse extends Component {

  static navigationOptions = {
    header: null
  };

  constructor(props) {
   super(props);
   this.state = {
     content: [],
     loading: false,
   }

   this.revibe = new RevibeAPI()
   this.renderContent = this.renderContent.bind(this);
   this.renderRow = this.renderRow.bind(this);
 }

 async componentDidMount() {
     if (this.props.connected) {
       // console.log(this.revibe);
       this.setState({loading: true})
       var browseContent = await this.revibe.fetchBrowseContent()
       this.setState({content:browseContent, loading: false})
     }
     else {
       // get from realm
     }
 }

 goToAlbum(album, songs=[]) {
   var key = album.name+"Remote"
   var navigationOptions = {
     key: key,
     routeName: "Album",
     params: {
       album: album,
       songs: songs,
     }
   }

   this.props.navigation.navigate(navigationOptions)
 }

 goToArtist(artist) {
   var key = artist.name+"Remote"
   var navigationOptions = {
     key: key,
     routeName: "Artist",
     params:{
       artist: artist,
     }
   }
   this.props.navigation.navigate(navigationOptions)
 }





  renderContent() {
    // console.log(this.state.content);
    if(this.state.content.length < 1) {
      return null
    }

    return (
      <>
      {this.state.content.map(content => {
        if(content.type === "artist") {
          return (
            <>
            <View>
              <Text style={styles.title}>
                {content.name}
              </Text>
            </View>
            <View>
              <ArtistItem
               artist={content.results}
               displayType={true}
               navigation={this.props.navigation}
              />
            </View>
            </>
          )
        }
        else if(content.results.length > 0) {
          return (
            <>
            <View>
              <Text style={styles.title}>
                {content.name}
              </Text>
            </View>
            <View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
                <List
                  horizontal={true}
                  dataArray = {content.results}
                  renderRow = {object => this.renderRow(object, content.type)}
                />
              </ScrollView>
            </View>
            </>
          )
          return null
        }
    })}
      </>
    )
  }

  getImage(images) {
    if(images.length > 0) {
      var minImage = images.reduce(function(prev, curr) {
          return prev.height < curr.height ? prev : curr;
      });
      var maxImage = images.reduce(function(prev, curr) {
          return prev.height > curr.height ? prev : curr;
      });
      var middleImage = images.filter(x=> x!== minImage && x!==maxImage).reduce(function(prev, curr) {
          return prev.height < curr.height ? prev : curr;
      });

      return {uri: middleImage.url}
    }
    return require("./../../../assets/albumPlaceholder.png")
  }

  setArtist(item) {
    var contributors = Object.keys(item.contributors).map(x => item.contributors[x])
    var contributorString = compact(contributors.map(function(x) {if(x.type === "Artist") return x.artist.name})).join(', ')
    return contributorString
  }

  renderRow(item, type) {
    if(type === "songs") {
      if(item.hasOwnProperty("icon")) {
        var image = require("./../../../assets/albumPlaceholder.png")
      }
      else {
        var image = this.getImage(item.album.images)
      }
      return (
        <TouchableOpacity
        style={{borderBottomWidth:0}}
        onPress={() => this.goToAlbum(item.album,[item])}
        delayPressIn={0} useForeground >
          <Card style={styles.card} noShadow={true}>
            <Image source={image} style={styles.cardImg} />
            <Body style={styles.cardItem}>
              <View style={styles.radioCardName}>
                <View style={{ flex: 0.5}}>
                  <Text style={styles.text}>
                    {item.name}
                  </Text>
                </View>
                <View style={{ flex: 0.5}}>
                  <Text note>
                    {this.setArtist(item)}
                  </Text>
                </View>
              </View>
            </Body>
          </Card>
        </TouchableOpacity>
      )
    }
    else if(type==="albums") {
      if(item.hasOwnProperty("icon")) {
        var image = require("./../../../assets/albumPlaceholder.png")
      }
      else {
        var image = this.getImage(item.images)
      }
      return (
        <TouchableOpacity
        onPress={() => this.goToAlbum(item)}
        delayPressIn={0} useForeground >
          <Card style={styles.card} noShadow={true}>
            <Image source={image} style={styles.cardImg} />
            <Body style={styles.cardItem}>
              <View style={styles.radioCardName}>
                <View style={{ flex: 0.5}}>
                  <Text style={styles.text}>
                    {item.name}
                  </Text>
                </View>
                <View style={{ flex: 0.5}}>
                  <Text note>
                    {this.setArtist(item)}
                  </Text>
                </View>
              </View>
            </Body>
          </Card>
        </TouchableOpacity>
      )
    }
    else if(type==="artists") {
      return(
        <TouchableOpacity
        onPress={() => this.goToArtist(item)}
        delayPressIn={0} useForeground >
          <Card style={styles.card} noShadow={true}>
            <Image source={this.getImage(item.images)} style={styles.artistCardImg} />
            <Body style={styles.cardItem}>
              <View style={styles.radioCardName}>
                <View style={{ flex: 0.5}}>
                  <Text style={styles.text}>
                    {item.name}
                  </Text>
                </View>
              </View>
            </Body>
          </Card>
        </TouchableOpacity>
      )
    }
    else if(type === "container") {

    }
  }

  render() {
      return (
        <>
        <AnimatedPopover type="Loading" show={this.state.loading} />
        <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        bounces={false}
        style={{marginTop: 0, paddingTop: 0}}>
          <LinearGradient
            style={{flex: 1}}
            start={{x: 0.0, y: 0}} end={{x: 0.2, y: .2}}
            colors={['#7248BD', '#53328f', '#121212']}
          >
            <View style={[styles.container, {backgroundColor: "transparent",paddingTop: "10%"}]}>
              <View style={{flexDirection: 'row'}}>
                <View style={{alignItems: "flex-start",width: "50%"}}>
                  <Text style={styles.pageTitle}> Browse </Text>
                </View>
              <View style={{alignItems: "flex-end", width: "50%", }}>
                <TouchableOpacity
                  style={styles.menuContainer}
                  activeOpacity={0.9}
                  onPress={()=> this.props.navigation.openDrawer()}
                >
                  <Icon type="Ionicons" name="md-menu" style={styles.menu} />
                </TouchableOpacity>
              </View>
              </View>
              <View style={{marginTop: "5%"}}>

                {this.renderContent()}
              </View>
            </View>
          </LinearGradient>
        </ScrollView>
        </>
      );
  }
}

function mapStateToProps(state) {
  return {
    connected: state.connectionState.connected,
  }
};

const mapDispatchToProps = dispatch => ({
});


export default connect(mapStateToProps, mapDispatchToProps)(Browse)
