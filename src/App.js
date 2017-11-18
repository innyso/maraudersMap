/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';
import { Card, ListItem, Button, FormInput, FormLabel } from 'react-native-elements'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state={
      input: "",
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Card
          containerStyle={styles.card}
          title='Purveyors of Aids to Magical Mischief-Makers are proud to present'
          image={require('../images/marauders-map.jpg')}>
          <FormLabel>Enter your name to activate the Homonculous Charm</FormLabel>
          <FormInput
            ref={input => this.input = input}
            onChangeText={input => this.setState({input})}
            autoFocus
          />
          <Button
            backgroundColor='#03A9F4'
            fontFamily='Arial'
            buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
            title='ENTER'
            onPress={() => console.log(this.state.input)}/>
        </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  card: {
    marginTop: 30,
    marginBottom: 30,
    flex: 1,
  }
});
