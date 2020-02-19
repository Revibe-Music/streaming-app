import React, { Component } from "react";
import {RefreshControl, Dimensions, View, Text } from "react-native";
import PropTypes from 'prop-types';
import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { compact } from 'lodash';

import Loading from "./../loading/index";
import ListItem from "./../listItems/ListItem";
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

      this.dimensions = this._getDimensions()

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

  _getDimensions() {
    var layout = {}
    if(this.props.type === "Song") {
      layout.height = wp("100%")
      layout.width = hp("8%")
    }
    else {
      layout.height = wp("50%")
      layout.width = hp("20%")
    }
    return layout
  }

   _rowRenderer(index, data) {
     if(this.props.type === "Song") {
       if(data.contributors.length > 1) {
         var contributors = compact(data.contributors.map(function(x) {if(x.type === "Artist") return x}))
         contributors = this.props.isSearchResult ? "Song" + contributors.join(", ") : contributors.join(", ")
       }
       else {
         var contributors = data.contributors[0]
       }
       contributors = this.props.isSearchResult ? "Album" + contributors : contributors
       var isActive = false
       if(!!this.props.activePlatform) {
         isActive = this.props.currentplaylist[this.props.currentIndex].id === song.id
       }
       return ( <ListItem
                  object={data}
                  isActive={isActive}
                  type="Song"
                  text={data.name}
                  note={contributors}
                  image={data.album.images.length > 0 ? data.album.images[0].url : ""}
                  onClick={() => this.props.onClick}
                  navigation={this.props.navigation}
                />
              )
     }
     else if(this.props.type === "Album") {
       if(data.contributors.length > 1) {
         var contributors = compact(data.contributors.map(function(x) {if(x.type === "Artist") return x}))
         contributors = contributors.join(", ")
       }
       else {
         var contributors = data.contributors[0]
       }
       contributors = this.props.isSearchResult ? "Album" + contributors[0] : contributors[0]
       return ( <ListItem
                  object={data}
                  type="Album"
                  text={data.name}
                  note={contributors}
                  image={data.images.length > 0 ? data.images[0].url : ""}
                  onClick={() => this.props.onClick}
                />
              )
     }
     return (
       <ListItem
        object={data}
        type="Artist"
        text={data.name}
        note={this.props.isSearchResult ? "Artist" : ""}
        image={data.images.length > 0 ? data.images[0].url : ""}
        imageShape="circle"
        onClick={() => this.props.onClick}
       />
     )
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
    return (<Text style={styles.noDataText}>{this.props.noDataText}</Text>)

  }
}

List.propTypes = {
  data: PropTypes.array.isRequired,
  type: PropTypes.oneOfType(["Song","Artist","Album"]),
  allowRefresh: PropTypes.bool,                   // this object "owns" the contributions (will be an album or song most likely)
  onRefresh: PropTypes.func,            // function that is called whenever a tag is added
  isSearchResult: PropTypes.bool,
  noDataText: PropTypes.string
};

List.defaultProps = {
  allowRefresh: true,
  onRefresh: () => console.log("Must pass function to onRefresh props in order for pull-to-refresh to do anything."),
  isSearchResult: false,
  noDataText: "No Results."
};


function mapStateToProps(state) {
  return {
    currentIndex: state.audioState.currentIndex,
    currentplaylist: state.audioState.playlist,
    activePlatform: state.audioState.activePlatform
  }
};

export default connect(mapStateToProps)(List)
