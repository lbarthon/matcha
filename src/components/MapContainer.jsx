import React, { Component } from 'react';
import {GoogleApiWrapper, Map, Marker} from "google-maps-react";

export class MapContainer extends Component {
  state = {
    userLocation: {
      lat: 32,
      lng: 32
    },
    loading: true
  };

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      this.setState({
        userLocation: { 
          lat: latitude, 
          lng: longitude 
        },
        loading: false
      });
    }, () => {
      fetch("http://ip-api.com/json/", {
        method: 'GET'
      })
      .then(response => {
        if (response.ok) {
          response.json().then(json => {
            this.setState({
              userLocation: { 
                lat: json.lat, 
                lng: json.lon 
              },
              loading: false
            });
          })
          .catch(() => {
            this.setState({ loading: false });
          });
        } else {
          this.setState({ loading: false });
        }
      }).catch(() => {
        this.setState({ loading: false });
      })
    });
  }

  updateCoords(coord) {
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();
    this.setState({
      userLocation: {
        lat: lat,
        lng: lng
      }
    });
  }

  render() {
    const { loading, userLocation } = this.state;
    const { google } = this.props;

    if (loading) return null;

    return (
      <Map onClick={(t, map, coord) => this.updateCoords(coord)}
        google={google}
        initialCenter={userLocation}
        zoom={10}>

        <Marker onDragend={(t, map, coord) => this.updateCoords(coord)}
          name={'Current location'}
          position={userLocation}
          draggable={true} />
      </Map>
    );
  }
}

export default GoogleApiWrapper({
    apiKey: "AIzaSyCQwOn1Z6oev0SFXRHTxM9tKOqKi9pCMAU"
})(MapContainer);f