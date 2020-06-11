import React, { Component, PureComponent } from "react";
import { Dimensions, Image, View, Text, Animated } from "react-native";
import ImageLoad from 'react-native-image-placeholder';
import { RecyclerListView, DataProvider, LayoutProvider, BaseItemAnimator } from "recyclerlistview";
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import FastImage from "./../images/fastImage";
import { nextSong, prevSong  } from './../../redux/audio/actions';
import { connect } from 'react-redux';
import styles from "./styles";


const ViewTypes = {
    SONG: 0,
};

class AlbumArt extends PureComponent {
  // PureComponent that will be rendering in recyclerlistview

  constructor(props) {
   super(props);
 }

 getImage() {
   if(this.props.images.length > 0) {
     var images = this.props.images.filter(x => x.height < 1000)
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
   return require("./../../../assets/albumArtPlaceholder.png")
 }


  render() {
    return (
      <View style={this.props.playerVisible ? styles.albumArtContainer : null}>
        <FastImage
          style={this.props.playerVisible ? styles.albumArt : styles.minAlbumArt} // rounded or na?
          source={this.getImage()}
          placeholder={require("./../../../assets/albumArtPlaceholder.png")}
        />
      </View>
    )
  }
}

class ImageSwiper extends Component{

    constructor(props) {
      super(props);

      var deviceHeight = Dimensions.get("window").height;
      var deviceWidth = Dimensions.get("window").width;

      this.dataProvider = new DataProvider((r1, r2) => {
          return (r1.uri !== r2.uri);
      });

      this._layoutProvider = new LayoutProvider(
          index => {
              return ViewTypes.SONG;
          },
          (type, dim) => {
              switch (type) {
                  case ViewTypes.SONG:
                      dim.width = deviceWidth;
                      dim.height = deviceHeight;
                      break;
                  default:
                      dim.width = 0;
                      dim.height = 0;
                      break
              }
          }
      );

      this._rowRenderer = this._rowRenderer.bind(this);
      this.handleSongChange = this.handleSongChange.bind(this);
    }

    _rowRenderer = (type, data) => {
        switch (type) {
            case ViewTypes.SONG:
                return (
                  <AlbumArt images={data.album.images} playerVisible={this.props.playerVisible}/>
                )
        }
    }

    componentDidUpdate(prevProps) {
        // Check if song has been changed and if so, swipe to new album image
        if(this.props.playerVisible) {
          if (this.props.currentIndex+1 === prevProps.currentIndex) {
            this._swiper.scrollToIndex(this.props.currentIndex, this.props.playerVisible)
          }

          if (this.props.currentIndex-1 === prevProps.currentIndex) {
            this._swiper.scrollToIndex(this.props.currentIndex, this.props.playerVisible)
          }
        }
    }


  handleSongChange(event) {
      var currentOffset = event.nativeEvent.contentOffset.x;

      var playNextOffset = this.props.currentIndex * wp("100%") + wp("100%")/2;
      var playPrevOffset = this.props.currentIndex * wp("100%") - wp("100%")/2;

      if(currentOffset > playNextOffset) {
        this.props.nextSong()
      }
      else if(currentOffset < playPrevOffset){
        this.props.prevSong()
      }
  }

  render() {
    if(this.props.playerVisible) {
      var data = this.dataProvider.cloneWithRows(this.props.playlist)
      return (
        <RecyclerListView
          ref={(swiper) => {this._swiper = swiper;}}
          layoutProvider={this._layoutProvider}
          dataProvider={data}
          rowRenderer={this._rowRenderer}
          isHorizontal={true}
          initialRenderIndex={this.props.currentIndex}
          canChangeSize={true}
          scrollViewProps={{
            pagingEnabled: true,
            onMomentumScrollEnd: this.handleSongChange,
            showsHorizontalScrollIndicator:false
          }}
        />
      );
    }
    return (
      <AlbumArt images={this.props.playlist[this.props.currentIndex].album.images} playerVisible={this.props.playerVisible}/>
    )

  }
}


function mapStateToProps(state) {
  return {
    playlist: state.audioState.playlist,
    currentIndex: state.audioState.currentIndex,
  }
};

const mapDispatchToProps = dispatch => ({
  nextSong: () => dispatch(nextSong()),
  prevSong: () => dispatch(prevSong()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ImageSwiper)
