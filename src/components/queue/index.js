/*
* All accounts that require authentication will be tested to ensure
* the user has signed in before rendering the account tabs and all
* public platform tabs (YouTube) will automatically render
*/
import React, { Component } from "react";
import { TouchableOpacity, View, Text,ScrollView, Image } from 'react-native'
import { Container,Content, Button, ListItem, Icon, Header, Left, Body, Right } from "native-base";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import ImageLoad from 'react-native-image-placeholder';
import PropTypes from 'prop-types';
import Modal from "react-native-modal";
import { BlurView } from "@react-native-community/blur";
import { connect } from 'react-redux';
import { compact } from 'lodash';

import List from "./../../components/lists/List";
import DraggableList from "./../../components/lists/DraggableList";
import { updateQueue,removeFromQueue } from './../../redux/audio/actions'
import styles from "./styles";

const feedbackOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false
};

class Queue extends Component {

  static navigationOptions = {
    header: null
  };

  constructor(props) {
     super(props);
     this.state = {
       allowScroll: true
     }

     this.setArtist = this.setArtist.bind(this)
   }

   setArtist(song) {
     var contributors = Object.keys(song.contributors).map(x => song.contributors[x])
     var contributorString = compact(contributors.map(function(x) {if(x.type === "Artist") return x.artist.name})).join(', ')
     return contributorString
   }

   getImage(song) {
     song.album.images = Object.keys(song.album.images).map(x => song.album.images[x])
     if(song.album.images.length > 0) {
       var image = song.album.images.reduce(function(prev, curr) {
           return prev.height < curr.height ? prev : curr;
       });
       return {uri: image.url}
     }
     return require("./../../../assets/albumArtPlaceholder.png")
   }

   displayPlatform(song) {
     if(song.platform.toLowerCase() === "spotify") {
       var platformIcon = <Icon type="FontAwesome5" name="spotify" style={[styles.logo, {color: "#1DB954"}]} />
     }
     else if(song.platform.toLowerCase() === "youtube") {
       var platformIcon = <Icon type="FontAwesome5" name="youtube" style={[styles.logo, {color: "red"}]} />
     }
     else {
       var platformIcon = <Image source={require('./../../../assets/revibe_logo.png')} style={{height: hp("2"), width: hp("2")}} />
     }
     return platformIcon
   }

   renderItem = ({ item, index, move, moveEnd, isActive }) => {
    return (
      <ListItem noBorder style={[styles.libraryItem,{backgroundColor: isActive ? "#202020" : "#121212"}]}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{width:wp("6%"),justifyContent: "flex-start"}}
          onPress={() => this.props.removeFromQueue(index)}
        >
        <Icon type="MaterialIcons" name="close" style={[styles.listIcon, {color: "red"}]} />
        </TouchableOpacity>
        <View style={styles.libraryItemText}>
          <View>
            <Text style={[styles.songText,{color:"white"}]} numberOfLines={1}>{item.name}</Text>
          </View>
          <View style={{flexDirection: "row"}}>
            <View style={styles.logoContainer}>
             {this.displayPlatform(item)}
            </View>
            <View>
              <Text numberOfLines={1} note style={styles.noteText}>{this.setArtist(item)}</Text>
            </View>
          </View>
          <View>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{flex:wp("6%"), alignItems:"center"}}
          onLongPress={() => {
              ReactNativeHapticFeedback.trigger("impactLight", {enableVibrateFallback: true,ignoreAndroidSystemSettings: false});
              move()
            }
          }
          onPressOut={moveEnd}
        >
        <Icon type="MaterialIcons" name="drag-handle" style={styles.listIcon} />
        </TouchableOpacity>
      </ListItem>

    )
  }

  render() {
    return (
      <Modal
        animationType="slide"
        visible={this.props.visible}
        supportedOrientations={["portrait"]}
        style={{margin: 0, padding: 0}}
      >
      <BlurView
        style={styles.container}
        blurType="dark"
        blurAmount={30}
      >
          <View style={styles.closeButtonContainer} >
            <Button style={styles.closeButton} transparent onPress={() => this.props.onClose()}>
              <Icon transparent={false} name="md-close" style={styles.closeButtonIcon}/>
            </Button>
          </View>
          <Content scrollEnabled={this.state.allowScroll} >

          <View style={{alignItems: "flex-start",width: "50%"}}>
            <Text style={styles.title}> In Queue: </Text>
          </View>
          <>
          {this.props.queue.length > 0 ?
            <DraggableList
              data={this.props.queue}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => `draggable-item-${item.id}${index}`}
              scrollPercent={5}
              onMoveBegin={() => this.setState({allowScroll: false})}
              onMoveEnd={({ data }) => {
                this.props.updateQueue(data)
                this.setState({allowScroll: true})
              }}
            />
          :
            <Text style={styles.emptyQueueText}>Your queue is empty.</Text>
          }
          <View style={{height: 20}} />
          <View style={{alignItems: "flex-start",width: "50%"}}>
            <Text style={styles.title}> Up Next: </Text>
          </View>
          {this.props.playlist.slice(this.props.currentIndex+1,50).map(song => (
            <ListItem noBorder style={styles.listItem}>
              <TouchableOpacity disabled={true}>
                <View style={{flexDirection: "row"}}>
                    <ImageLoad
                        isShowActivity={false}
                        style={styles.image} // rounded or na?
                        placeholderStyle={styles.image}
                        source={this.getImage(song)}
                        placeholderSource={require("./../../../assets/albumArtPlaceholder.png")}
                    />
                  <View style={styles.textContainer}>
                   <View>
                     <Text style={styles.mainText} numberOfLines={1}>{song.name}</Text>
                   </View>
                   <View style={{flexDirection: "row"}}>
                     <View style={styles.logoContainer}>
                      {this.displayPlatform(song)}
                     </View>
                     <View>
                       <Text numberOfLines={1} note style={styles.noteText}>{this.setArtist(song)}</Text>
                     </View>
                   </View>
                 </View>
               </View>
              </TouchableOpacity>
            </ListItem>
          ))}
          </>
        </Content >
      </BlurView>
    </Modal>
    );
  }
}

Queue.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func.isRequired
};

Queue.defaultProps = {
  visible: false,
};

function mapStateToProps(state) {
  return {
    queue: state.audioState.queue,
    playlist: state.audioState.playlist,
    currentIndex: state.audioState.currentIndex,
  }
};

const mapDispatchToProps = dispatch => ({
    removeFromQueue: (index) => dispatch(removeFromQueue(index)),
    updateQueue: (queue) => dispatch(updateQueue(queue)),
});

export default connect(mapStateToProps,mapDispatchToProps)(Queue)
