import React, { Component,useState } from 'react';
import { Dimensions, Platform, StyleSheet, Text, View, Button, Alert } from 'react-native';
import MapView, {
  Marker,
  AnimatedRegion,
  Polyline,
  PROVIDER_GOOGLE
} from "react-native-maps";
import { Callout } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from "react-native-geolocation-service";
import {requestMultiple, PERMISSIONS} from 'react-native-permissions';
// import * as Location from 'expo-location';
// import * as Permissions from 'expo-permissions';

import locationData from './locations.json';
import Picker1 from './Picker.js';
import Picker2 from './PickerDestination.js';
import Picker3 from './PickerMultiple.js';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 29.0350;
const LONGITUDE = -81.3032;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


const GOOGLE_MAPS_APIKEY = 'YOUR_API_KEY';

import { NativeModules } from 'react-native';
const reactNativeVersion = NativeModules.PlatformConstants.reactNativeVersion;
const reactNativeVersionString = reactNativeVersion ? `${reactNativeVersion.major}.${reactNativeVersion.minor}.${reactNativeVersion.patch}${reactNativeVersion.prerelease ? ' pre-release' : ''}` : '';

const reactNativeMapsVersion = require('./node_modules/react-native-maps/package.json').version;
const reactNativeMapsDirectionsVersion = require('./node_modules/react-native-maps-directions/package.json').version;

export default class App extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      names: [locationData.name],
      positions: [locationData.position],
      latitude: 0,
      longitude: 0,
      markerCoordinates: [],
      coordinates: [
      ],
      eta: 0,
      distance: 0,
    };
    
    this.mapView = null;
    
  }

  componentDidMount(){
    requestMultiple([PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION, PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]).then(
      (statuses) => {
        console.log('Coarse', statuses[PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION]);
        console.log('Fine', statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]);
      },
    );
    Geolocation.getCurrentPosition(
      position => {
        this.setState({coordinates: []});
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          coordinates: this.state.coordinates.concat({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }),
          markerCoordinates: this.state.markerCoordinates.concat({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        });
      },
      error => {
        Alert.alert(error.message.toString());
      },
      {
        showLocationDialog: true,
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0
      }
    );
  }
  onChange = (itemValue, itemIndex) => {  
    // Set the state here and update as required
  }

  onMapPress = (e) => {
    this.setState({
      coordinates: [
        e.nativeEvent.coordinate,,
        this.state.coordinates[1]
      ],
    });
  }

  onReady = (result) => {
    console.log(`Distance: ${result.distance} km`)
    console.log(`Duration: ${result.duration} min.`)
    var eta = result.duration.toFixed(0);
    var distance = (result.distance * .62137).toFixed(2);
    this.setState({eta: eta,
    distance: distance})
    this.mapView.fitToCoordinates(result.coordinates, {
      edgePadding: {
        right: (width / 10),
        bottom: (height / 10),
        left: (width / 10),
        top: (height / 10),
      },
    });
  }

  onError = (errorMessage) => {
    console.log(errorMessage); // eslint-disable-line no-console
  }

  setDistance(distance, duration_in_traffic) {
    // console.log('setDistance');
    this.setState({
      distance: parseFloat(distance),
      durationInTraffic: parseInt(duration_in_traffic)
    });
  }

  myFunction() {
    console.log(this.state.currency);
  }

  callback = (currency) => {
    this.state.coordinates[0] = currency;
    this.forceUpdate();
  }


  callback2 = (currency) => {
    this.state.coordinates[1] = currency;
    this.forceUpdate();
  }

  callback3 = (currency) => {
    this.state.coordinates[this.state.coordinates.length] = currency;
    this.forceUpdate();
  }

  buttonCallback = () => {
    Geolocation.getCurrentPosition(
      position => {
        this.setState({coordinates: []});
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          coordinates: this.state.coordinates.concat({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }),
        
        });
      },
      error => {
        Alert.alert(error.message.toString());
      },
      {
        showLocationDialog: true,
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0
      }
    );
    this.forceUpdate();
  }

  render() {
    console.disableYellowBox = true;

    return (
      
      <View style={StyleSheet.absoluteFill}>
      
      <MapView
         style={{ flex: 1 }}
         provider={PROVIDER_GOOGLE}
         showsUserLocation
         initialRegion={{
         latitude: this.state.latitude,
         longitude: this.state.latitude,
         latitudeDelta: LATITUDE_DELTA,
         longitudeDelta: LONGITUDE_DELTA}}
         style={StyleSheet.absoluteFill}
          ref={c => this.mapView = c} // eslint-disable-line react/jsx-no-bind
          onPress={this.onMapPress}
          >
            <MapViewDirections
            origin={this.state.coordinates[0]}
            destination={this.state.coordinates[this.state.coordinates.length-1]}
            waypoints={this.state.coordinates.slice(1,-1)}
            mode='WALKING'
            apikey={GOOGLE_MAPS_APIKEY}
            language='en'
            strokeWidth={4}
            strokeColor="black"
            onStart={(params) => {
              console.log(`Started routing between "${params.origin}" and "${params.destination}"${(params.waypoints.length ? " using waypoints: " + params.waypoints.join(', ') : "")}`);
            }}
            onReady={this.onReady}
            onError={(errorMessage) => {
              console.log(errorMessage);
            }}
            resetOnChange={false}
          />
          {/* {!!this.state.coordinates[1] && <MapView.Marker
         coordinate={this.state.coordinate[this.state.coordinates.length - 1],this.state.coordinate[this.state.coordinates.length - 1]}
       />} */}
        </MapView>
        <Callout>
        <View style={styles.picker}>
        <Picker1 parentCallBack={this.callback}/>
        {/* <Picker2 parentCallBack={this.callback2}/> */}
        <Picker3 parentCallBack={this.callback3}/>
        </View>
        </Callout>
        <View style={styles.bottom}>
          <Text style={styles.timeText}>
            Estimated Travel Time : {this.state.eta} minutes
          </Text>
          <Text style={styles.timeText}>
            Total Distance : {this.state.distance} miles
          </Text>
        <Button
        onPress={this.buttonCallback}
        title="Reset path"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
        />
        </View>
        <View style={styles.versionBox}>
          <Text style={styles.versionText}>RN {reactNativeVersionString}, RNM: {reactNativeMapsVersion}, RNMD: {reactNativeMapsDirectionsVersion}</Text>
        </View> 
        </View>
    );
  }
}
const styles = StyleSheet.create({
  versionBox: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  timeText: {
    fontSize: 20,
    color: '#000',

  },
  versionText: {
    padding: 4,
    backgroundColor: '#FFF',
    color: '#000',
  },
  picker: {
    backgroundColor: '#778899',
    opacity: .8
  },
  container: {
    flex: 1,
    alignItems: 'center'
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 36
  }
});
