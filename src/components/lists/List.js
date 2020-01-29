import React, { Component } from "react";
import {RefreshControl, Dimensions, View } from "react-native";
import PropTypes from 'prop-types';
import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import Loading from "./../loading/index";
import SongItem from "./../listItems/songItem";
import { updatePlatformData } from './../../redux/platform/actions';

import { connect } from 'react-redux';
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

      var dimensions = this._getDimensions()

      this._layoutProvider = new LayoutProvider(
       index => {
            return ViewTypes.MEDIA;
        },
            (type, dim) => {
                switch (type) {
                    case ViewTypes.MEDIA:
                        dim.width = dimensions.width;
                        dim.height = dimensions.height;
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

  _getDimensions() {
    var layout = {}
    if(this.props.type === "song") {
      layout.height = wp("100%")
      layout.width = hp("8%")
    }
    else {
      layout.height = wp("50%")
      layout.width = hp("20%")
    }
    return layout
  }



   _rowRenderer(type, data) {
       switch (type) {
           case ViewTypes.SONG:
               return (
                 <SongItem song={data} playlist={this.props.filtering ? this.props.songs : this.props.platform.library} platform={this.props.platform} searchResult={false} navigation={this.props.navigation}/>
               )
       }
   }

   async refresh() {
     this.setState({refreshing: true})
     await this.props.onRefresh()
     this.setState({refreshing: false})
   }


  render() {
    var data = this.dataProvider.cloneWithRows(this.props.songs)

    return (
      <RecyclerListView
        layoutProvider={this._layoutProvider}
        dataProvider={data}
        rowRenderer={this._rowRenderer}
        optimizeForInsertDeleteAnimations={true}
        extendedState={this.state}
        scrollViewProps={this.props.allowRefresh ?
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
}

List.propTypes = {
  data: PropTypes.array.isRequired,
  type: PropTypes.oneOfType(["song","artist","album"]),
  platform: PropTypes.object.isRequired,                   // this object "owns" the contributions (will be an album or song most likely)
  allowRefresh: PropTypes.bool,                   // this object "owns" the contributions (will be an album or song most likely)
  onRefresh: PropTypes.func,            // function that is called whenever a tag is added
};

List.defaultProps = {
  allowRefresh: true,
  onRefresh: () => console.log("Must pass function to onRefresh props in order for pull-to-refresh to do anything.");
};

export default List
