// React native and others libraries imports
import React, { Component } from 'react';
import { Alert, ImageBackground, TextInput, Dimensions, StyleSheet, Image, AsyncStorage, TouchableOpacity } from 'react-native';
import { Container, Content, View, Text, Button, Left, Right, Body, Title, List, Item, Thumbnail, Grid, Col } from 'native-base';
import { Actions } from 'react-native-router-flux';
import URL from '../../component/server'
import { RippleLoader } from 'react-native-indicator';
import { Card, Icon, SocialIcon } from 'react-native-elements'

import color from '../../component/color'



export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      username: '',
      loading: false,
      password: '',
    };
  }


  componentDidMount() {
    AsyncStorage.getItem('type').then((value) => {
      value == '' ? this.setState({ type: "null" }) : this.setState({ type: value })
    })


  }
  currencyFormat(n) {
    return n.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  }


  loginRequest() {
    const { password, username } = this.state

    if (password == "" || username == "") {
      Alert.alert('Validation failed', 'Phone field cannot be empty', [{ text: 'Okay' }])
      return
    } else {

    }
    this.setState({ loading: true })
    fetch(URL.url + 'profile/login/', {
      method: 'POST', headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }, body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then(this.processResponse)
      .then(res => {
        this.setState({ loading: false })
        const { statusCode, data } = res;
        if (statusCode === 200) {
          AsyncStorage.setItem('data',  JSON.stringify(data.data) );
          AsyncStorage.setItem('balance', this.currencyFormat(data.data.balance));
          AsyncStorage.setItem('step', 'one');
          //Actions.otp();
          Actions.home({type: 'replace'});
        } else {
          Alert.alert('Operarion failed', data.non_field_errors[0], [{ text: 'Okay' }])
        }
      })
      .catch((error) => {
        console.log("Api call error");
        console.warn(error);
        alert(error.message);
        this.setState({ loading: false })
      });


  }
  processResponse(response) {
    const statusCode = response.status;
    const data = response.json();
    return Promise.all([statusCode, data]).then(res => ({
      statusCode: res[0],
      data: res[1]
    }));
  }
  render() {


    if (this.state.loading) {
      return (
        <View
          style={styles.backgroundImage}
        >
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={styles.welcome}>
              <RippleLoader color={color.slide_color_dark} size={50} />
            </View>
            <Text style={{ color: color.slide_color_dark }}>login in... </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.backgroundImage}>


        <View style={{ flex: 1 }}>


          <View style={{ margin: 30, marginTop: 45 }}>
            <Text style={styles.title}>Welcome  back. </Text>
            <Text style={styles.information}> Login into your account</Text>

          </View>

          <View style={styles.inputView}>
            <TextInput
              placeholder="Enter Email"
              placeholderTextColor={color.primary_color}
              returnKeyType="next"
              onSubmitEditing={() => this.passwordInput.focus()}
              keyboardType='email-address'
              autoCapitalize="none"
              autoCorrect={false}
              inlineImageLeft='ios-call'
              style={{ flex: 1 }}
              onChangeText={text => this.setState({ username: text })}
            />


          </View>
          <View style={styles.inputView}>
            <TextInput
              placeholder="Password"
              placeholderTextColor={color.primary_color}
              returnKeyType="next"
              onSubmitEditing={() => this.loginRequest()}
              keyboardType='password'
              autoCapitalize="none"
              autoCorrect={false}
              inlineImageLeft='ios-call'
              style={{ flex: 1 }}
              onChangeText={text => this.setState({ password: text })}
              ref={(input) => this.passwordInput = input}
            />

            <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', marginRight: 20 }}>
              <Icon
                active
                name="ios-eye"
                type='ionicon'
                color='#000'
              />
            </TouchableOpacity>
          </View>



          <Button onPress={() => this.loginRequest()} style={styles.buttonContainer} block iconLeft>

            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '200' }}>Login </Text>
          </Button>

          <View style={{ margin: 30, marginTop: 19, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 20, }}>
            <Text style={{ color: color.primary_colo, fontSize: 14, fontWeight: '200' }}>Forget password? </Text>
            <TouchableOpacity onPress={() => Actions.forgetpass()}>
              <Text style={{ color: color.primary_colo, fontSize: 14, fontWeight: '400' }}>Reset  </Text>
            </TouchableOpacity>
          </View>

        </View>

        <View style={{ margin: 30, marginTop: 45, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, backgroundColor: color.primary_color }}>
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '200' }}>Already register? </Text>
          <TouchableOpacity onPress={() => Actions.reg()}>
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '400' }}>Sign Up </Text>
          </TouchableOpacity>
        </View>

      </View>

    );
  }
  itemClicked(item) {
    Actions.product();
  }

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  backgroundImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  inputView: {
    height: 50,
    flexDirection: 'row',
    color: color.primary_color,
    marginLeft: 30,
    marginRight: 30,
    backgroundColor: "#d1d1d1",
    fontSize: 14,
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 10,
    justifyContent: 'center',

  },
  buttonContainer: {
    height: 50,
    backgroundColor: color.secondary_color,
    marginLeft: 30,
    marginRight: 30,
    borderRadius: 5,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center'

  },


  title: {
    marginTop: 7,
    marginBottom: 15,
    marginRight: 13,
    fontSize: 22,
    color: color.primary_color,
    textAlign: 'left',
    fontWeight: '900'
  },
});

