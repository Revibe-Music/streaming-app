import React, { Component } from "react";
import { View, Text, TouchableOpacity, SectionList } from "react-native";
import { Container, Content,Tab, } from "native-base";
import PropTypes from 'prop-types';

import AnimatedPopover from "./../animatedPopover/index";
import SongItem from "./../listItems/songItem";
import AlbumItem from "./../listItems/albumItem";
import ArtistItem from "./../listItems/artistItem";
import ViewAllItem from "./../listItems/ViewAllItem";
import styles from "./styles";


class SearchTabs extends Component {

  constructor(props) {
      super(props);
      this.state = {
          didSearch: false,
          loading: false,
          results: {},
          numResults: 0
      };

      this.setSections = this.setSections.bind(this)
      this.search = this.search.bind(this)
  }

  async componentDidMount() {
    await this.search()
  }

  async componentDidUpdate(prevProps) {
    if(prevProps.query !== this.props.query) {
      await this.search()
    }
  }

  async search() {
    this.setState({loading: true})
    var results = await this.props.platform.search(this.props.query)
    this.setState({
      loading: false,
      didSearch: true,
      results: results,
      numResults: results.songs.length + results.artists.length + results.albums.length
    })
  }

  setSections() {
    var sections = []
    if(this.state.results["songs"].length > 0) {
      sections.push({title: "Songs", data: this.state.results["songs"].slice(0,5)})
    }
    if(this.state.results["albums"].length > 0) {
      sections.push({title: "Albums", data: this.state.results["albums"].slice(0,5)})
    }
    if(this.state.results["artists"].length > 0) {
      sections.push({title: "Artists", data: this.state.results["artists"].slice(0,5)})
    }
    return sections
  }


   _rowRenderer(item, section) {
     if(section.title === "Songs") {
       return (
         <SongItem
          song={item}
          playlist={this.state.results["songs"]}
          displayImage={true}
          displayType={true}
          source="Search"
         />
       )
     }
     if(section.title === "Artists") {
       return (
         <ArtistItem
          artist={item}
          displayType={true}
          isLocal={false}
          source="Search"
          navigation={this.props.navigation}
         />
       )
     }
     if(section.title === "Albums") {
       return (
         <AlbumItem
          album={item}
          displayType={true}
          isLocal={false}
          source="Search"
          navigation={this.props.navigation}
         />
       )
     }
   }

  render() {
    if(this.state.loading) {
      return <AnimatedPopover type="Loading" show={true} text=""/>
    }
    if(this.state.numResults > 0) {
      return (
        <View style={styles.container} >
            <SectionList
              sections={this.setSections()}
              renderItem={({item, section}) => this._rowRenderer(item, section)}
              renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
              renderSectionFooter={({section}) => {
                if(this.state.results[section.title.toLowerCase()].length > 5) {
                  return (
                    <ViewAllItem
                      type={section.title}
                      data={this.state.results[section.title.toLowerCase()]}
                      navigation={this.props.navigation}
                    />
                  )
                }
                return null
              }}
              keyExtractor={(item, index) => index}
            />
      </View>
      )
    }
    return (
      <View style={styles.container} >
      <View style={styles.noDataTextContainer}>
        <Text style={styles.noDataText}>No Results.</Text>
        </View>
      </View>
    )
  }
}

SearchTabs.propTypes = {
  platform: PropTypes.object,
  query: PropTypes.string
};

export default SearchTabs
