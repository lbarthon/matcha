import React, { Component } from 'react';
import { GoogleApiWrapper, Map, Marker } from "google-maps-react";
import { alert } from '../../utils/alert';

export class UpdateMap extends Component {
  state = {
    userLocation: {
      lat: 30,
      lng: 30
    },
    loading: true
  };

  componentDidMount = () => {
    const { location } = this.props;
    if (location != undefined) {
      // Use DB saved location
      const latLng = location.split(";");
      this.setState({
        userLocation: {
          lat: latLng[0],
          lng: latLng[1]
        },
        loading: false
      });
    } else {
      navigator.geolocation.getCurrentPosition(position => {
        // Get position if he agreed
        const { latitude, longitude } = position.coords;
        this.setState({
          userLocation: {
            lat: latitude,
            lng: longitude
          },
          loading: false
        }, () => {
          this.updateProps();
        });
      }, () => {
        fetch("http://ip-api.com/json/")
        .then(response => {
          if (response.ok) {
            response.json().then(json => {
              this.setState({
                userLocation: {
                  lat: json.lat,
                  lng: json.lon
                },
                loading: false
              }, () => {
                this.updateProps();
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
  }

  updateProps = () => {
    // Calls parent module function onChange if exists
    const { onChange } = this.props;
    if (onChange) {
      onChange(this.state.userLocation);
    }
  }

  updateCoords = (coord) => {
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();
    console.log("lat", lat, "lng", lng);
    if (lat >= -85 && lat <= 85 && lng >= -180 && lng <= 180) {
      this.setState({
        userLocation: {
          lat: lat,
          lng: lng
        }
      }, () => {
        this.updateProps();
      });
    }
  }

  render() {
    const { loading, userLocation } = this.state;
    const { google } = this.props;

    if (loading) return null;

    return (
      <div style={{position: 'relative', height: '500px'}}>
        <Map onClick={(t, map, coord) => this.updateCoords(coord)}
          google={google}
          initialCenter={userLocation}
          zoom={10}
          >

          <Marker onDragend={(t, map, coord) => this.updateCoords(coord)}
            name={'Current location'}
            position={userLocation}
            draggable={true} />
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
    apiKey: "AIzaSyCQwOn1Z6oev0SFXRHTxM9tKOqKi9pCMAU"
})(UpdateMap);
