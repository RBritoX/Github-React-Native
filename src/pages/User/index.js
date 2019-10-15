import React, { Component } from "react";
import { View } from "react-native";

// import { Container } from './styles';

export default class User extends Component {
  static navigationOpitions = ({ navigation }) => ({
    title: navigation.getParam("user").name
  });

  async componentDidMount() {}

  render() {
    return <View />;
  }
}
