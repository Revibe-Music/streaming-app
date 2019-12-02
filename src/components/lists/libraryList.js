import React, { Component } from "react";
import {RefreshControl, Dimensions, View } from "react-native";
import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import Loading from "./../loading/index";
import SongItem from "./../listItems/songItem";
import { updatePlatformData } from './../../redux/platform/actions';

import { connect } from 'react-redux';
import styles from "./styles";


const ViewTypes = {
    SONG: 0,
};

class LibraryList extends Component {

  constructor(props) {
       super(props);
       this.updateSongs = this.updateSongs.bind(this);

       this.dataProvider = new DataProvider((r1, r2) => {
           return (r1.id !== r2.id);
       });


        this._layoutProvider = new LayoutProvider(
            index => {
                return ViewTypes.SONG;
            },
            (type, dim) => {
                switch (type) {
                    case ViewTypes.SONG:
                        dim.width = wp("100%");
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

        this.state = {
            updatingSongs: false,
        };
    }

   _rowRenderer(type, data) {
       switch (type) {
           case ViewTypes.SONG:
               return (
                 <SongItem song={data} playlist={this.props.filtering ? this.props.songs : this.props.platform.library} platform={this.props.platform} searchResult={false} navigation={this.props.navigation}/>
               )
       }
   }

  async updateSongs() {
    this.setState({ updatingSongs: true });
    if(this.props.connected) {
      try {
        this.props.platform.library = await this.props.platform.refreshSongs()
        this.props.updatePlatformData(this.props.platform)
        this.setState({ updatingSongs: false });
        this.forceUpdate();
      }
      catch(error) {
        console.log(error);
        this.setState({ updatingSongs: false });
      }
    }
    else {
      this.setState({ updatingSongs: false });
    }
  }

  render() {
    var data
    if(this.props.filtering) {
      data = this.dataProvider.cloneWithRows(this.props.songs)
    }
    else {
      data = this.dataProvider.cloneWithRows(JSON.parse(JSON.stringify(this.props.platform.getSongs())))
    }

    return (
      <RecyclerListView
        layoutProvider={this._layoutProvider}
        dataProvider={data}
        rowRenderer={this._rowRenderer}
        optimizeForInsertDeleteAnimations={true}
        extendedState={this.state}
        scrollViewProps={this.props.filtering ?
          null :
          {
          refreshControl: (
            <RefreshControl
            onRefresh={this.updateSongs}
            refreshing={this.state.updatingSongs}
            />
          )
        }}
      />
    )
  }
}

function mapStateToProps(state) {
  return {
    connected: state.connectionState.connected,
  }
};

const mapDispatchToProps = dispatch => ({
    updatePlatformData: (platform) => dispatch(updatePlatformData(platform)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LibraryList)
