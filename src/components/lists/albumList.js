import React, { Component } from "react";
import {RefreshControl, Dimensions, View } from "react-native";
import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import Loading from "./../loading/index";
import AlbumItem from "./../listItems/albumItem";
import { updatePlatformData } from './../../redux/audio/actions';

import { connect } from 'react-redux';
import styles from "./styles";


const ViewTypes = {
    ALBUM: 0,
};

class AlbumList extends Component {

  constructor(props) {
       super(props);

       this.dataProvider = new DataProvider((r1, r2) => {
           return (r1.id !== r2.id);
       });

        this._layoutProvider = new LayoutProvider(
            index => {
                return ViewTypes.ALBUM;
            },
            (type, dim) => {
                switch (type) {
                    case ViewTypes.ALBUM:
                        dim.width = wp("95%");
                        dim.height = hp("8%");
                        break;
                    default:
                        dim.width = 0;
                        dim.height = 0;
                        break
                }
            }
        );

        this._rowRenderer = this._rowRenderer.bind(this);
    }

   _rowRenderer(type, data) {
       switch (type) {
           case ViewTypes.ALBUM:
               return (
                 <AlbumItem album={data} displaySavedSongs={this.props.displaySavedSongs} platform={this.props.platform} navigation={this.props.navigation}/>
               )
       }
   }

  render() {
    const data = this.dataProvider.cloneWithRows(this.props.albums)
    return (
      <RecyclerListView
        layoutProvider={this._layoutProvider}
        dataProvider={data}
        rowRenderer={this._rowRenderer}
      />
    )
  }
}

export default AlbumList
