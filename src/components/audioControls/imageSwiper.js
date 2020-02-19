import React, { Component, PureComponent } from "react";
import { Dimensions, Image, View, Text, Animated } from "react-native";
import ImageLoad from 'react-native-image-placeholder';
import { RecyclerListView, DataProvider, LayoutProvider, BaseItemAnimator } from "recyclerlistview";
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

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

  render() {
    return (
      <View style={styles.albumArtContainer}>
          <ImageLoad
              isShowActivity={false}
              style={styles.albumArt}
              placeholderStyle={styles.albumArtPlaceholder}
              source={{ uri: this.props.album}}
              placeholderSource={require("./../../../assets/albumArtPlaceholder.png")}
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

    _rowRenderer(type, data) {
      if(Array.isArray(data.album.images)) {
        var image = data.album.images.length > 0 ? data.album.images[0].url : null
      }
      else {
        var image = Object.keys(data.album.images).length ? data.album.images["0"].url : null
      }
        switch (type) {
            case ViewTypes.SONG:
                return (
                  <AlbumArt album={image} />
                )
        }
    }

    componentDidUpdate(prevProps) {
        // Check if song has been changed and if so, swipe to new album image
        if (this.props.currentIndex+1 === prevProps.currentIndex) {
          this._swiper.scrollToIndex(this.props.currentIndex, true)
        }

        if (this.props.currentIndex-1 === prevProps.currentIndex) {
          this._swiper.scrollToIndex(this.props.currentIndex, true)
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

    var data = this.dataProvider.cloneWithRows(this.props.playlist)

    return (
      <RecyclerListView
        ref={(swiper) => {this._swiper = swiper;}}
        layoutProvider={this._layoutProvider}
        dataProvider={data}
        rowRenderer={this._rowRenderer}
        isHorizontal={true}
        initialRenderIndex={this.props.currentIndex}
        scrollViewProps={{
          pagingEnabled: true,
          onMomentumScrollEnd: this.handleSongChange,
        }}
      />
    );
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
