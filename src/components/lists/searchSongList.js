import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Icon } from "native-base";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import SongItem from "./../listItems/songItem";
import ArtistItem from "./../listItems/artistItem";
import styles from "./styles";

class SearchSongList extends Component {

  constructor(props) {
       super(props);
       this.state = {results: this.props.results.slice(0,3)}
  }


  renderFooter() {
    return (
    //Footer View with Load More button
      <View>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={this.toggleResults}
          style={styles.footer}
          onPress={() => this.props.navigation.navigate(
            {
              key: "ViewAllSongs",
              routeName: "ViewAllSongs",
              params: {
                songs: this.props.results,
                platform: this.props.platform,
              }
            }
          )}
        >
          <Text style={styles.showHideText}> View All</Text>
        </TouchableOpacity>
      </View>
    );
  }


  render() {
        return (
          <FlatList
            scrollEnabled={false}
            data={this.state.results}
            renderItem={ ({item, index}) => {
                  return( <SongItem song={item} playlist={this.props.results} platform={this.props.platform} searchResult={true} navigation={this.props.navigation}/> )
              }
            }

            initialNumToRender={20}
            updateCellsBatchingPeriod={20}
            maxToRenderPerBatch={10}
            windowSize={15}
            removeClippedSubviews={true}
            getItemLayout={(data, index) => (
              {length: 30, offset: hp("8%") * index, index}
            )}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={this.renderFooter.bind(this)}
            //Adding Load More button as footer component
          />
        )
    }
}

export default SearchSongList;
