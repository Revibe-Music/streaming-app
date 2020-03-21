import React, { Component } from "react";
import {RefreshControl, Dimensions, View, Text,TouchableOpacity, ScrollView } from "react-native";
import PropTypes from 'prop-types';
import { RecyclerListView, DataProvider, LayoutProvider,BaseScrollView } from "recyclerlistview";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import SongItem from "./../listItems/songItem";
import AlbumItem from "./../listItems/albumItem";
import ArtistItem from "./../listItems/artistItem";
import PlaylistItem from "./../listItems/playlistItem";
import styles from "./styles";


const ViewTypes = {
    MEDIA: 0,
};


class List extends Component {

  constructor(props) {
      super(props);

      console.log(this.props.displayLogo);
      this.dataProvider = new DataProvider((r1, r2) => {
           return (r1.id !== r2.id);
      });

      this._layoutProvider = new LayoutProvider(
       index => {
            return ViewTypes.MEDIA;
        },
            (type, dim) => {
                switch (type) {
                    case ViewTypes.MEDIA:
                        dim.width =  wp("100%");
                        dim.height = hp("8%")
                        break;
                    default:
                        dim.width = 0;
                        dim.height = 0;
                        break
                }
            }
        );

        this._rowRenderer = this._rowRenderer.bind(this);
        this.state = {
            refreshing: false,
        };
    }

   _rowRenderer(type, data, index) {
     if(this.props.type === "Songs") {
       return (
         <SongItem
          song={data}
          playlist={this.props.data}
          source={this.props.source}
          displayImage={this.props.displayImage}
          displayType={this.props.displayType}
          displayLogo={this.props.displayLogo}
         />
       )
     }
     if(this.props.type === "Artists") {
       return (
         <ArtistItem
          artist={data}
          displayType={this.props.displayType}
          displayLogo={this.props.displayLogo}
          source={this.props.source}
          isLocal={this.props.isLocal}
          navigation={this.props.navigation}
         />
       )
     }
     if(this.props.type === "Albums" || this.props.type === "Singles" || this.props.type === "EPs"  || this.props.type === "Appears On") {
       return (
         <AlbumItem
          album={data}
          displayType={this.props.displayType}
          displayLogo={this.props.displayLogo}
          source={this.props.source}
          isLocal={this.props.isLocal}
          navigation={this.props.navigation}
         />
       )
     }
     if(this.props.type === "Playlists") {
       return (
         <PlaylistItem
          playlist={data}
          navigation={this.props.navigation}
         />
       )
     }
   }

   async refresh() {
     this.setState({refreshing: true})
     await this.props.onRefresh()
     this.setState({refreshing: false})
   }


  render() {


    if(this.props.data.length > 0) {
      var data = this.dataProvider.cloneWithRows(this.props.data)
      var scrollViewProps = {}
      if(this.props.allowRefresh) {
        scrollViewProps = {
          refreshControl: (
            <RefreshControl
            onRefresh={this.refresh}
            refreshing={this.state.refreshing}
            />
          )
        }
      }

      return (
        <RecyclerListView
          layoutProvider={this._layoutProvider}
          dataProvider={data}
          rowRenderer={this._rowRenderer}
          optimizeForInsertDeleteAnimations={true}
          extendedState={this.state}
          scrollViewProps={scrollViewProps}
        />
      )
    }
    return (
      <View style={styles.textContainer}>
        <Text style={styles.noDataText}>{this.props.noDataText}</Text>
      </View>
    )

  }
}

List.propTypes = {
  data: PropTypes.array.isRequired,
  noDataText: PropTypes.string,
  type: PropTypes.oneOfType(["Songs","Artists","Albums"]),
  displayType: PropTypes.bool,
  displayImage: PropTypes.bool,
  displayLogo: PropTypes.bool,
  allowRefresh: PropTypes.bool,
  isLocal: PropTypes.bool,
  source: PropTypes.string,
  onRefresh: PropTypes.func,
};

List.defaultProps = {
  allowRefresh: true,
  isLocal: false,
  onRefresh: () => console.log("Must pass function to onRefresh props in order for pull-to-refresh to do anything."),
  isLocal: false,
  displayType: false,
  displayImage: true,
  displayLogo: false,
  noDataText: "No Results."
};


export default List
