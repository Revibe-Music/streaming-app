import React, { Component } from "react";
import { Container, View, Button, Text, Icon, Header, Left, Body, Right } from "native-base";

import List from "../../../components/lists/List";
import OptionsMenu from "../../../components/OptionsMenu/index";
import styles from "./styles";


class ViewAll extends Component {

  static navigationOptions = {
    header:  null
  };

  constructor(props) {
     super(props);
     this.data = this.props.navigation.state.params.data
     this.type = this.props.navigation.state.params.type
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
          <Text style={styles.pageTitle}>{this.type}</Text>
        </Body>
        <Right></Right>
      </Header>

      <Container style={styles.container}>
        <List
          data={this.data}
          type={this.type}
          isLocal={false}
          allowRefresh={false}
          noDataText="No Results"
          navigation={this.props.navigation}
        />
        <OptionsMenu navigation={this.props.navigation} />
      </Container>
      </>
    );
  }
}

export default ViewAll
