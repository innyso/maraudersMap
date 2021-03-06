/* eslint-disable */


import React, {
 Component
}                             from 'react';
import {
 AppRegistry,
 StyleSheet,
 View,
 Text,
 ListView,
 DeviceEventEmitter
}                             from 'react-native';
import Beacons                from 'react-native-beacons-manager';
import { BluetoothStatus } from 'react-native-bluetooth-status';
import { updateLocationApi } from '../redux/location';
import moment from 'moment';
import { connect } from 'react-redux';

/**
* uuid of YOUR BEACON (change to yours)
* @type {String} uuid
*/
const UUID = '11A29583-9A74-4EDC-91B3-0A06A45DC539';
const IDENTIFIER = 'Slytherin common room';

const OTHER_UUID = '87814C62-2219-46F7-95BA-58E745BEE995';
const OTHER_IDENTIFIER = 'sloth';

const WAIT_TIME = 1;

class Location extends Component {
  // will be set as a reference to "beaconsDidRange" event:
  beaconsDidRangeEvent = null;

  state = {
   // region information
   uuid: UUID,
   identifier: IDENTIFIER,

   otherUUID: OTHER_UUID,
   otherIdentifier: OTHER_IDENTIFIER,

   // list of desired UUID to range (Note: these will be section headers in the listview rendered):
   rangedBeaconsUUIDMap: {
     [UUID.toUpperCase()]: [],
     [OTHER_UUID.toUpperCase()]: []
   },
   // React Native ListViews datasources initialization
   rangingDataSource: new ListView.DataSource({
     rowHasChanged: (r1, r2) => r1 !== r2,
     sectionHeaderHasChanged: (s1, s2) => s1 !== s2
   }).cloneWithRows([]),

   // check bluetooth state:
   bluetoothState: '',
   beaconLastUpdate: {},
  };


   componentWillMount(){
     const { identifier, uuid } = this.state;
     const { otherIdentifier, otherUUID } = this.state;
     const currentTime = moment().format();
     const initialTime = moment(currentTime).add(WAIT_TIME, 'seconds');

     // initial to be more than wait duration to make sure data will
     // get send when app first launch
     this.state.beaconLastUpdate[uuid] = initialTime;
     this.state.beaconLastUpdate[otherUUID] = initialTime;
     Beacons.requestAlwaysAuthorization();

     const region = { identifier, uuid };
     const anotherRegion = { identifier: otherIdentifier, uuid: otherUUID };

     // Range for beacons inside the region
     Beacons
     .startRangingBeaconsInRegion(region) // or like  < v1.0.7: .startRangingBeaconsInRegion(identifier, uuid)
     .then(() => console.log('Beacons ranging started succesfully'))
     .catch(error => console.log(`Beacons ranging not started, error: ${error}`));
     // Range for beacons inside the other region
     Beacons
     .startRangingBeaconsInRegion(anotherRegion) // or like  < v1.0.7: .startRangingBeaconsInRegion(identifier, uuid)
     .then(() => console.log('Beacons ranging started succesfully'))
     .catch(error => console.log(`Beacons ranging not started, error: ${error}`));

     // update location to ba able to monitor:
     Beacons.startUpdatingLocation();
   }

   componentDidMount() {
     //
     // component state aware here - attach events
     //

     Beacons.allowsBackgroundLocationUpdates(true);
     // Ranging: Listen for beacon changes
     this.beaconsDidRangeEvent = Beacons.BeaconsEventEmitter.addListener(
       'beaconsDidRange',
       (data) => {
         const { beacons } = data;
         const { identifier } = data.region;
         const { rangingDataSource } = this.state;
         const currentTime = moment().format();

         const timeDifference = moment(currentTime).diff(this.state.beaconLastUpdate[data.region.uuid]);
         const parseTimeDifference = parseInt(moment(timeDifference).format('ss'));

         if (parseTimeDifference >= WAIT_TIME) {
           const singleBeacon = data.beacons[0];
           console.log('beaconsDidRange data: ', data);
           this.state.beaconLastUpdate[data.region.uuid] = currentTime;

           if (data.beacons.length > 0 ) {

             var currentLocation = singleBeacon;
             currentLocation.Name = this.props.wizardName;
             currentLocation.RegionName = identifier;
             console.log('inside if case', currentLocation);
             fetch('http://192.168.8.101:1234/updateLocation/',{
               method: 'post',
               body: JSON.stringify(currentLocation)
             }).then(res => res.json())
               .catch(err => console.log(err));
           }
         }
         this.setState({
           rangingDataSource: rangingDataSource.cloneWithRowsAndSections(this.convertRangingArrayToMap(beacons))
         });
       }
     );

    this.updateBluetoothStatus();
   }

  async updateBluetoothStatus() {
    try {
      console.log(BluetoothStatus);
      const isEnabled = await BluetoothStatus.state();
      console.log('isEnabled', isEnabled);
      this.setState({ bluetoothState: (isEnabled) ? 'On' : 'Off' });
    } catch (err) {
      console.error(err);
    }
  }
  
   componentWillUnMount(){
     const { identifier, uuid } = this.state;
     const { otherIdentifier, otherUUID } = this.state;

     const region = { identifier, uuid };
     const regionAlternate = { identifier: otherIdentifier, uuid: otherUUID };

     // stop ranging beacons:
     Beacons
     .stopRangingBeaconsInRegion(region)
     .then(() => console.log('Beacons ranging stopped succesfully'))
     .catch(error => console.log(`Beacons ranging not stopped, error: ${error}`));

     Beacons
     .stopRangingBeaconsInRegion(regionAlternate)
     .then(() => console.log('Beacons ranging stopped succesfully'))
     .catch(error => console.log(`Beacons ranging not stopped, error: ${error}`));

     // remove ranging event we registered at componentDidMount
     this.beaconsDidRangeEvent.remove();
   }

   render() {
     const { bluetoothState, rangingDataSource } =  this.state;

     return (
       <View style={styles.container}>
        <Text style={styles.btleConnectionStatus}>
          wizard name is: {this.props.wizardName}
       </Text>
         <Text style={styles.btleConnectionStatus}>
           Bluetooth connection status: { bluetoothState ? bluetoothState  : 'NA' }
         </Text>
         <Text style={styles.headline}>
           ranging beacons:
         </Text>
         <ListView
           dataSource={ rangingDataSource }
           enableEmptySections={ true }
           renderRow={this.renderRangingRow}
           renderSectionHeader={this.renderRangingSectionHeader}
         />
       </View>
     );
   }

   renderRangingSectionHeader = (sectionData, uuid) => (
     <Text>
        {uuid}
      </Text>
    );

   renderRangingRow = (rowData) => (
     <View style={styles.row}>
       <Text style={styles.smallText}>
         UUID: {rowData.uuid ? rowData.uuid  : 'NA'}
       </Text>
       <Text style={styles.smallText}>
         Major: {rowData.major ? rowData.major : 'NA'}
       </Text>
       <Text style={styles.smallText}>
         Minor: {rowData.minor ? rowData.minor : 'NA'}
       </Text>
       <Text>
         RSSI: {rowData.rssi ? rowData.rssi : 'NA'}
       </Text>
       <Text>
         Proximity: {rowData.proximity ? rowData.proximity : 'NA'}
       </Text>
       <Text>
         Distance: {rowData.accuracy ? rowData.accuracy.toFixed(2) : 'NA'}m
       </Text>
     </View>
   );

   convertRangingArrayToMap = (rangedBeacon) => {
      const { rangedBeaconsUUIDMap } = this.state;

      rangedBeacon.forEach(
        (beacon) => {
          if (beacon.uuid.length > 0) {
            const uuid = beacon.uuid.toUpperCase();
            const rangedBeacons = rangedBeaconsUUIDMap[uuid].filter(rangedBeac => rangedBeac === uuid);

            rangedBeaconsUUIDMap[uuid] = [...rangedBeacons, beacon];
          }
      });
      this.setState({ rangedBeaconsUUIDMap });
      return rangedBeaconsUUIDMap;
    }

}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   paddingTop: 60,
   margin: 5,
   backgroundColor: '#F5FCFF',
 },
 contentContainer: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
 },
 btleConnectionStatus: {
   fontSize: 20,
   paddingTop: 20
 },
 headline: {
   fontSize: 20,
   paddingTop: 20,
   marginBottom: 20
 },
 row: {
   padding: 8,
   paddingBottom: 16
 },
   smallText: {
   fontSize: 11
 },
});

const mapStateToProps = state => ({
  wizardName: state.newWizard.wizard,
});

const mapDispatchToProps = dispatch => ({
  dispatchUploadLocation: location => dispatch(updateLocationApi(location))
});

export default connect(mapStateToProps, mapDispatchToProps)(Location);
