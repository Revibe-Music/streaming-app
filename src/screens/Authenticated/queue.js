/*
* All accounts that require authentication will be tested to ensure
* the user has signed in before rendering the account tabs and all
* public platform tabs (YouTube) will automatically render
*/
import React, { Component } from "react";
import { TouchableOpacity, TouchableWithoutFeedback,Vibration, View, Text } from 'react-native'
import { Container,ListItem, Icon, Header, Left, Body, Right } from "native-base";
import DraggableFlatList from 'react-native-draggable-dynamic-flatlist'
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { connect } from 'react-redux';

import OptionsMenu from "./../../components/OptionsMenu/index";
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
   }

   renderItem = ({ item, index, move, moveEnd, isActive }) => {
    return (
      <ListItem noBorder style={[styles.libraryItem,{backgroundColor: isActive ? "#202020" : "#121212"}]}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{flex:.15, alignItems:"flex-start"}}
          onPress={() => this.props.removeFromQueue(index)}
        >
        <Icon type="MaterialIcons" name="close" style={[styles.songOptions, {color: "red"}]} />
        </TouchableOpacity>
        <View style={styles.libraryItemText}>
          <View>
            <Text style={[styles.songText,{color:"white"}]} numberOfLines={1}>{item.name}</Text>
          </View>
          <View>
            <Text numberOfLines={1} note style={[styles.artistText,{color:"grey"}]}>{this.props.searchResult ? "Song • " : ""}{item.contributors[0].artist.name}</Text>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{flex:.15, alignItems:"flex-end"}}
          onLongPress={() => {
              ReactNativeHapticFeedback.trigger("impactLight", {enableVibrateFallback: true,ignoreAndroidSystemSettings: false});
              move()
            }
          }
          onPressOut={moveEnd}
        >
        <Icon type="MaterialIcons" name="drag-handle" style={styles.songOptions} />
        </TouchableOpacity>
      </ListItem>

    )
  }

  render() {
    return (
      <>
      <Header style={styles.libraryHeader} androidStatusBarColor="#222325" iosBarStyle="light-content">
        <Left>
        <Text style={styles.pageTitle}> Queue </Text>
        </Left>
        <Body>
        </Body>
        <Right></Right>
      </Header>
      <Container style={styles.container}>

      {this.props.queue.length > 0 ?
        <DraggableList
          data={this.props.queue}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => `draggable-item-${item.id}${index}`}
          scrollPercent={5}
          onMoveEnd={({ data }) => this.props.updateQueue(data)}
        />
      :
      <Text style={styles.emptyQueueText}>Your queue is empty.</Text>
      }
      <OptionsMenu navigation={this.props.navigation} />
      </Container>
      </>
    );
  }
}
function mapStateToProps(state) {
  return {
    queue: state.audioState.queue,
    playlist: state.audioState.playlist,
    platforms: state.platformState.platforms,
  }
};

const mapDispatchToProps = dispatch => ({
    removeFromQueue: (index) => dispatch(removeFromQueue(index)),
    updateQueue: (queue) => dispatch(updateQueue(queue)),
});

export default connect(mapStateToProps,mapDispatchToProps)(Queue)
