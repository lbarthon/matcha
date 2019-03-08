import React, { Component } from 'react';
import {GoogleApiWrapper, Map, Marker, InfoWindow} from "google-maps-react";

export class DisplayMap extends Component {
  state = {
    infoWindow: {
      display: false,
      marker: {},
      match: {}
    },
    userLocation: {
        lat: undefined,
        lng: undefined
    },
    matchs: []
  };

  componentDidMount = () => {
    const { userLocation, matchs } = this.props;
    
    var mapped = matchs.map(value => {
      let latLng = value.location.split(";");
      return {
        username: username,
        id: id,
        lat: latLng[0],
        lng: latLng[1]
      };
    });
    this.setState({ matchs: mapped });
    let latLng = userLocation.split(";");    
    this.setState({
      userLocation: {
        lat: latLng[0],
        lng: latLng[1]
      }
    });
  }

  onMarkerClick = (props, marker, e) => {
    this.setState({
      infoWindow: {
        display: true,
        marker: marker,
        match: props.match
      }
    })
  }

  render() {
    const { google } = this.props;
    const { userLocation, matchs } = this.state;

    if (matchs.length == 0) return null;

    return (
      <div style={{position: 'relative', height: '500px'}}>
        <Map google={google}
          initialCenter={userLocation}
          zoom={10}>

          <Marker position={userLocation}/>
          {this.state.matchs.map(match => {
            return (
              <Marker match={match}
                position={{ lat: match.lat, lng: match.lng }}
                onClick={this.onMarkerClick} />
            );
          })};
          <InfoWindow marker={this.state.infoWindow.marker}
            visible={this.state.infoWindow.display}>
            <Link to={"/user/" + this.state.infoWindow.match.id}>
              {this.state.infoWindow.match.username}
            </Link>
          </InfoWindow>
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
    apiKey: "AIzaSyCQwOn1Z6oev0SFXRHTxM9tKOqKi9pCMAU"
})(DisplayMap);
