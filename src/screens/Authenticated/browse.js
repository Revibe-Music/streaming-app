import React, { Component } from "react";
import { Container, Content, Text, List, Icon } from "native-base";
import { ScrollView, View, TouchableOpacity } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import styles from "./styles";

import AnimatedPopover from './../../components/animatedPopover/index';
import ArtistItem from "./../../components/listItems/artistItem";
import SongCard from "./../../components/cards/songCard";
import AlbumCard from "./../../components/cards/albumCard";
import ArtistCard from "./../../components/cards/artistCard";
import RevibeAPI from './../../api/revibe'
import { connect } from 'react-redux';

import {goToViewAll} from "./../../redux/navigation/actions";


const shuffle = (array) => {
  let currentIndex = array.length, temp, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temp = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temp;
  }
  return array;
};


class Browse extends Component {

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
       this.setState({loading: true})
       var browseContent = await this.revibe.fetchAllBrowseContent()
       if(Array.isArray(browseContent)) {
         this.setState({content:browseContent, loading: false})
       }
       else {
         this.setState({loading: false})
       }
     }
     else {
       // get from realm
     }
 }

  renderContent() {
    if(this.state.content.length < 1) {
      return null
    }
    return (
      <>
      {this.state.content.map(content => {
        if(content.type === "artist") {
          return (
            <>
            <View style={{marginTop: 10}}>
              <Text style={styles.title}>
                {content.name}
              </Text>
            </View>
            <View>
              <ArtistItem
               artist={content.results}
               displayType={true}
               displayLogo={true}
               navigation={this.props.navigation}
              />
            </View>
            </>
          )
        }
        else if(content.results.length > 0) {
          return (
            <>
            <View style={[styles.titleHeader, {paddingTop: 20}]}>
              <Text style={styles.title}>
                {content.name}
              </Text>
              <TouchableOpacity onPress={() => this.props.goToViewAll([], content.type, content.name, content.endpoint)}>
                <Text style={styles.viewAll}>
                  View All
                </Text>
              </TouchableOpacity>
            </View>

            <View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
                <List
                  horizontal={true}
                  dataArray = {shuffle(content.results)}
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

  renderRow(item, type) {
    if(type === "songs") {
      var image = item.hasOwnProperty("icon") ? require("./../../../assets/albumPlaceholder.png") : this.getImage(item.album.images)
      return <SongCard song={item} image={image} />
    }
    else if(type==="albums") {
      var image = item.hasOwnProperty("icon") ? require("./../../../assets/albumPlaceholder.png") : this.getImage(item.images)
      return <AlbumCard album={item} image={image} />
    }
    else if(type==="artists") {
      return(
        <ArtistCard artist={item} image={this.getImage(item.images)} />
      )
    }
    else if(type === "container") {

    }
  }

  render() {
      return (
        <>

        <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}
        bounces={false}
        style={{marginTop: 0, paddingTop: 0}}>
          <LinearGradient
            style={{flex: 1}}
            start={{x: 0.0, y: 0}} end={{x: 0.2, y: .2}}
            colors={['#7248BD', '#53328f', '#121212']}
          >
          <AnimatedPopover type="Loading" show={this.state.loading} />
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
    goToViewAll: (data, type, title, endpoint, platform) => dispatch(goToViewAll(data, type, title, endpoint, platform)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Browse)
