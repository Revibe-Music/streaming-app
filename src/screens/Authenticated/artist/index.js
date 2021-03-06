import React, { Component } from 'react';
import { TouchableOpacity, ScrollView, Image } from 'react-native';
import { View,Button,Text,Icon,List } from "native-base";
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
import ViewMoreText from 'react-native-view-more-text';
import { BarIndicator } from 'react-native-indicators';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { connect } from 'react-redux';

import ParalaxContainer from "../../../components/containers/paralaxContainer";
import SongItem from "../../../components/listItems/songItem";
import AlbumCard from "../../../components/cards/albumCard";
import AlbumItem from "../../../components/listItems/albumItem";
import ViewAllItem from "../../../components/listItems/ViewAllItem";
import DonationModal from "../../../components/modals/donationModal";
import TipJar from '../../../../assets/tip_jar.svg'
import { playSong } from './../../../redux/audio/actions'
import { goToViewAll } from "./../../../redux/navigation/actions";
import { getPlatform } from '../../../api/utils';
import { createBranchUniversalObject } from '../../../navigation/branch'

import styles from "./styles";


class Artist extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      artistImage: null,
      topSongs: [],
      singles: [],
      albums: [],
      eps: [],
      appearsOn: [],
      songs: [],
      showTipJar: false,
      showDonationModal: false,
      branchUniversalObject: null
    }

    this.renderItem = this.renderItem.bind(this)
    this.getArtistImage = this.getArtistImage.bind(this)
    this.getAlbumImage = this.getAlbumImage.bind(this)
    if(this.props.navigation.state.params.artist) {
      this.artist = this.props.navigation.state.params.artist
      this.platform = getPlatform(this.props.navigation.state.params.artist.platform)
    }
    else if(this.props.navigation.state.params.id){
      this.artist = {
        id: this.props.navigation.state.params.id,
        images: []
      }
      this.platform = getPlatform(this.props.navigation.state.params.platform)
    }
  }

  async componentDidMount() {
    this.setState({loading: true})
    var contentList = []
    contentList.push(this.platform.fetchArtistTopSongs(this.artist.id))
    contentList.push(this.platform.fetchArtistAlbums(this.artist.id))
    this.artist = await this.platform.fetchArtist(this.artist.id)
    if(this.artist["venmo"]) {
      this.setState({showTipJar: true})
    }
    if(this.artist["cashApp"]) {
      this.setState({showTipJar: true})
    }

    var content = await Promise.all(contentList)
    this.setState({
        topSongs: content[0],
        albums: content[1].filter(x => x.type.toLowerCase() === "album"),
        singles: content[1].filter(x => x.type.toLowerCase() === "single"),
        eps: content[1].filter(x => x.type.toLowerCase() === "ep"),
        appearsOn: content[1].filter(x => x.type.toLowerCase() === "appears_on"),
        loading:false
    })
    var object = await createBranchUniversalObject(this.artist.name, "Revibe Artist", this.artist.images[1].url, this.artist.platform, "artist", this.artist.id)
    this.setState({branchUniversalObject: object})
  }

  componentWillUnmount() {
    if(this.state.branchUniversalObject !== null) {
      this.state.branchUniversalObject.release()
    }
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
      <AlbumCard album={item} image={this.getAlbumImage(item)} />
    )
  }

  render() {
    return (
      <>
      <ParalaxContainer
        platform={this.platform.name}
        placeholderImage={require("./../../../../assets/userPlaceholder.png")}
        title={this.artist.name}
        allowDonations={true}
        images={this.getArtistImage()}
        branchUniversalObject={this.state.branchUniversalObject}
      >
      {this.state.showTipJar ?
        <Button style={styles.donationButton} onPress={() => this.setState({showDonationModal: true})}>
          <Image source={require("./../../../../assets/tip_jar.png")} style={{height:hp("6"), width: hp(5)}}/>
        </Button>
      :
        null
      }
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
                  <TouchableOpacity onPress={() => this.props.goToViewAll(this.state.albums, "Albums")}>
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
                  <TouchableOpacity onPress={() => this.props.goToViewAll(this.state.eps, "EPs")}>
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
                  <TouchableOpacity onPress={() => this.props.goToViewAll(this.state.appearsOn, "Appears On")}>
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
      </ParalaxContainer>
      <DonationModal
        isVisible={this.state.showDonationModal}
        onClose={() => this.setState({showDonationModal: false})}
        artist={this.artist}
        venmoHandle={this.artist["venmo"]}
        cashAppHandle={this.artist["cashApp"]}
      />
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
    goToViewAll: (data, type) => dispatch(goToViewAll(data, type)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Artist)
