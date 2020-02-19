import React, { Component } from "react";
import {RefreshControl, Dimensions, View, Text,TouchableOpacity } from "react-native";
import PropTypes from 'prop-types';
import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import SongItem from "./../listItems/SongItem";
import AlbumItem from "./../listItems/AlbumItem";
import ArtistItem from "./../listItems/ArtistItem";
import styles from "./styles";


const ViewTypes = {
    MEDIA: 0,
};

class List extends Component {

  constructor(props) {
      super(props);
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
     if(this.props.type === "Song") {
       return (
         <SongItem
          song={data}
          playlist={this.props.data}
          displayImage={this.props.displayImage}
          displayType={this.props.displayType}
         />
       )
     }
     if(this.props.type === "Artist") {
       return (
         <ArtistItem
          artist={data}
          displayType={this.props.displayType}
          navigation={this.props.navigation}
         />
       )
     }
     if(this.props.type === "Album") {
       return (
         <AlbumItem
          album={data}
          displayType={this.props.displayType}
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

      return (
        <RecyclerListView
          layoutProvider={this._layoutProvider}
          dataProvider={data}
          rowRenderer={this._rowRenderer}
          optimizeForInsertDeleteAnimations={true}
          extendedState={this.state}
          scrollViewProps={!this.props.allowRefresh ?
            null :
            {
            refreshControl: (
              <RefreshControl
              onRefresh={this.refresh}
              refreshing={this.state.refreshing}
              />
            )
          }}
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
  type: PropTypes.oneOfType(["Song","Artist","Album"]),
  displayType: PropTypes.bool,
  displayImage: PropTypes.bool,
  allowRefresh: PropTypes.bool,
  isLocal: PropTypes.bool,
  onRefresh: PropTypes.func,
};

List.defaultProps = {
  allowRefresh: true,
  isLocal: false,
  onRefresh: () => console.log("Must pass function to onRefresh props in order for pull-to-refresh to do anything."),
  displayType: false,
  displayImage: true,
  noDataText: "No Results."
};


export default List
