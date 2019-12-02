import React, { Component } from "react";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Form,
  Item,
  Label,
  Input,
  Icon,
  Text,
  Left,
  Body,
  Right,
  View
} from "native-base";
import styles from "./styles";
import { Image } from "react-native";


class ForgotPassword extends Component {

    render() {
      return (
        <Container style={styles.container}>

          <Content contentContainerStyle={styles.content} scrollEnabled={false}>

            <Form style={styles.form}>
              <Text style={{color: "white", textAlign:"center", marginBottom: 10, marginTop: 15}}> Please enter the email associated with your Revibe account, then we will email you a temporary password. </Text>
              <Item floatingLabel style={{ marginRight: 15}}>
                <Label style={styles.label}>Email</Label>
                <Input style={{color: "white"}} />
              </Item>
            </Form>

            <Button style={styles.signInButton}
            block
            onPress={() => this.props.navigation.navigate("Authenticated")}
            >
              <Text>Submit</Text>
            </Button>

          </Content>
        </Container>
      );
    }
  }

export default ForgotPassword;
