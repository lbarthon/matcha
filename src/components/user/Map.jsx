import React, { Component } from 'react';
import {GoogleApiWrapper, Map, Marker} from "google-maps-react";

export class DisplayMap extends Component {
  state = {
    userLocation: {
      lat: undefined,
      lng: undefined
    }
  };

  componentDidMount = () => {
    if (this.props.location != undefined) {
      const latLng = this.props.location.split(";");
      this.setState({
        userLocation: {
          lat: latLng[0],
          lng: latLng[1]
        }
      });
    }
  }

  render() {
    if (this.state.userLocation.lat == undefined) return null;

    const { userLocation } = this.state;
    const { google } = this.props;

    return (
      <div style={{position: 'relative', height: '500px'}}>
        <Map google={google}
          initialCenter={userLocation}
          zoom={10}>

          <Marker name={'User location'}
            position={userLocation} />
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
    apiKey: "AIzaSyCQwOn1Z6oev0SFXRHTxM9tKOqKi9pCMAU"
})(DisplayMap);
