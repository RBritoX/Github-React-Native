import React, { Component } from "react";
import PropTypes from "prop-types";
import { Keyboard, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import Icon from "react-native-vector-icons/FontAwesome5";

import api from "../../services/api";

import {
  Container,
  Form,
  Input,
  SubmitButton,
  List,
  User,
  Avatar,
  Name,
  Login,
  Bio,
  Infos,
  Repos,
  Followers,
  Following,
  ProfileButton,
  ProfileButtonText
} from "./styles";

export default class Home extends Component {
  static navigationOptions = {
    title: "Usuários"
  };

  static PropTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func
    }).isRequired
  };

  state = {
    newUser: "",
    users: [],
    loading: false
  };

  async componentDidMount() {
    const users = await AsyncStorage.getItem("users");

    if (users) {
      this.setState({ users: JSON.parse(users) });
    }
  }

  componentDidUpdate(_, prevState) {
    const { users } = this.state;

    if (prevState.users !== users) {
      AsyncStorage.setItem("users", JSON.stringify(users));
    }
  }

  addUser = async () => {
    const { users, newUser } = this.state;

    this.setState({ loading: true });

    const response = await api.get(`/users/${newUser}`);

    const data = {
      name: response.data.name,
      login: response.data.login,
      bio: response.data.bio,
      avatar: response.data.avatar_url,
      repos: response.data.public_repos,
      followers: response.data.followers,
      following: response.data.following
    };

    this.setState({
      users: [...users, data],
      newUser: "",
      loading: false
    });
    Keyboard.dismiss();
  };

  goNavigate = user => {
    const { navigation } = this.props;

    navigation.navigate("User", { user });
  };

  render() {
    const { users, newUser, loading } = this.state;

    return (
      <Container>
        <Form>
          <Input
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Adicionar usuário"
            value={newUser}
            onChangeText={text => this.setState({ newUser: text })}
            returnKeyType="send"
            onSubmitEditing={this.addUser}
          />
          <SubmitButton loading={loading} onPress={this.addUser}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Icon name="github" size={20} color="#fff" />
            )}
          </SubmitButton>
        </Form>

        <List
          data={users}
          keyExtractor={user => user.login}
          renderItem={({ item }) => (
            <User>
              <Avatar source={{ uri: item.avatar }} />
              <Name>{item.name}</Name>
              <Login>{item.login}</Login>
              <Bio>{item.bio}</Bio>

              <Infos>
                <Repos>
                  <Icon name="folder" size={13} color="#333" /> Repos:
                  {item.repos}
                </Repos>
                <Followers>
                  <Icon name="users" size={13} color="#333" /> Followers:
                  {item.followers}
                </Followers>
                <Following>
                  <Icon name="user-friends" size={13} color="#333" /> Following:
                  {item.following}
                </Following>
              </Infos>

              <ProfileButton onPress={() => this.goNavigate(item)}>
                <ProfileButtonText>Ver Perfil</ProfileButtonText>
              </ProfileButton>
            </User>
          )}
        />
      </Container>
    );
  }
}
