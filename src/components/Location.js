/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { DeviceEventEmitter } from 'react-native'
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Beacons from 'react-native-beacons-manager';
import { BluetoothStatus } from 'react-native-bluetooth-status'
import  DeviceInfo from 'react-native-device-info'

const UUID = "B9407F30-F5F8-466E-AFF9-25556B57FE6D";
const IDENTIFIER = "22cea0e005fa2679ed611e44a7484914";

export default class Location extends Component {

  // will be set as a reference to "regionDidEnter" event:
  regionDidEnterEvent = null;
  // will be set as a reference to "regionDidExit" event:
  regionDidExitEvent = null;

  state = {
    uuid : UUID,
    identifier: IDENTIFIER,
    bluetoothState: '',
    message: '',
    data_name: '',
    data_identifier: '',
  };

  componentWillMount() {
    const {identifier, uuid } = this.state;

    console.log("identifier: ", identifier);
    console.log("uuid: ", uuid);

    // MANDATORY: you have to request ALWAYS Authorization (not only when in use) when monitoring
    // you also have to add "Privacy - Location Always Usage Description" in your "Info.plist" file
    // otherwise monitoring won't work
    Beacons.requestAlwaysAuthorization();
    Beacons.shouldDropEmptyRanges(true);

    const region = { identifier, uuid };

    Beacons.startMonitoringForRegion(region);
    Beacons.startRangingBeaconsInRegion(region);

    // update location to ba able to monitor:
    Beacons.startUpdatingLocation();
  }

  componentDidMount() {
    console.log(Beacons);
    // monitoring events
    this.regionDidEnterEvent = DeviceEventEmitter.addListener(
      'regionDidEnter',
      (data) => {
        console.log('monitoring - regionDidEnter data: ', data);
        const time = moment().format(TIME_FORMAT);
        this.setState({ data_name: data.name, data_identifier: data.identifier });
      }
    );
    this.updateBluetoothStatus();
  }

  async updateBluetoothStatus() {
    try{
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
        <Text style={styles.instructions}>
          Device info is: { DeviceInfo.getDeviceName() }
        </Text>
        <Text style={styles.instructions}>
          detected name: {this.state.data_name}
        </Text>
        <Text style={styles.instructions}>
          detected identifier: {this.state.data_identifier}
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
