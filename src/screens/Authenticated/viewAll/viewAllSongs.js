import React, { Component } from "react";
import {
  Container,
  Content,
  View,
  Button,
  Text,
  List,
  Icon,
  Header,
  Left,
  Body,
  Right,
} from "native-base";
import { FlatList } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

// import SongItem from "../../../components/listItems/songItem";

import styles from "./styles";

class ViewAllSongs extends Component {

  static navigationOptions = {
    header:  null
  };

  constructor(props) {
     super(props);
   }

  render() {

    return (
      <>
      <Header style={styles.libraryHeader} androidStatusBarColor="#222325" iosBarStyle="light-content">
        <Left>
          <Button
            transparent
            onPress={() => this.props.navigation.goBack()}>
            <Icon name="ios-arrow-back" style={{color:"white"}}/>
          </Button>
        </Left>
        <Body>
          <Text style={styles.pageTitle}> Songs </Text>
        </Body>
        <Right></Right>
      </Header>

      <Container style={styles.container}>
        <Content>
        <FlatList
          data={this.props.navigation.state.params.songs}
          renderItem={ ({item, index}) => {
              return (<SongItem song={item} playlist={this.props.navigation.state.params.songs} platform={this.props.navigation.state.params.platform} searchResult={true} navigation={this.props.navigation}/>)
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
          //Adding Load More button as footer component
        />

        </Content>
      </Container>
      </>
    );
  }
}

export default ViewAllSongs
