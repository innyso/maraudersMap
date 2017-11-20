/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BluetoothStatus } from 'react-native-bluetooth-status'

export default class Location extends Component {

  state = {
    bluetoothState: ''
  };

  componentDidMount() {
    this.updateBluetoothStatus();
  }

  async updateBluetoothStatus() {
    try{
      console.log("lollolololololololo");
      console.log(BluetoothStatus);
      const isEnabled = await BluetoothStatus.state();
      console.log("isEnabled ", isEnabled);
      this.setState({ bluetoothState: (isEnabled) ? 'On' : 'Off' });
    } catch(err) {
      console.error(error);
    }

  }

  render() {
    const { input } = this.props.navigation.state.params;
    return (
      <View style={styles.container}>
        <Text>{ input }</Text>
        <Text style={styles.instructions}>
          Bluetooth is: { this.state.bluetoothState }
        </Text>
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
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
