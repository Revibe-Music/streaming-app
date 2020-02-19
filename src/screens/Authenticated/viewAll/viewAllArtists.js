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
  Right
} from "native-base";
import { FlatList } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

// import ArtistItem from "../../../components/listItems/artistItem";

import styles from "./styles";

class ViewAllArtists extends Component {

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
          <Text style={styles.pageTitle}> Artists </Text>
        </Body>
        <Right></Right>
      </Header>

      <Container style={styles.container}>
        <Content>
        <FlatList
          data={this.props.navigation.state.params.artists}
          renderItem={ ({item, index}) => {
            return( <ArtistItem artist={item} platform={this.props.navigation.state.params.platform} navigation={this.props.navigation}/> )
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

export default ViewAllArtists
