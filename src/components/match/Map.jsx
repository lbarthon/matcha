import React, { Component } from 'react';
import { Link, BrowserRouter } from 'react-router-dom';
import {GoogleApiWrapper, Map, Marker, InfoWindow} from "google-maps-react";
import { withAllHOC } from '../../utils/allHOC';

export class MatchMap extends Component {
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
    length: undefined,
    markers: []
  };

  createMarkersFromUsers = (matchs) => {
    var mapped = matchs.map(value => {
      let latLng = value.location.split(";");
      return {
        username: value.username,
        id: value.id,
        lat: latLng[0],
        lng: latLng[1]
      };
    });
    return mapped.map((match, i) => {
      return (
        <Marker key={i} match={match}
          position={{ lat: match.lat, lng: match.lng }}
          onClick={this.onMarkerClick} />
      );
    });
  }

  componentDidMount = () => {
    const { userLocation, matchs, length } = this.props;

    this.setState({
      markers: this.createMarkersFromUsers(matchs),
      length: length
    });
    let latLng = userLocation.split(";");
    this.setState({
      userLocation: {
        lat: latLng[0],
        lng: latLng[1]
      }
    });
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      markers: this.createMarkersFromUsers(nextProps.matchs),
      length: nextProps.length
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
    const { userLocation, markers, length } = this.state;

    if (userLocation.lat === undefined || length === undefined || markers.length === 0) return null;

    return (
      <div style={{position: 'relative', height: '500px'}}>
        <Map google={google}
          initialCenter={userLocation}
          zoom={6}>

          <Marker position={userLocation}/>
          {markers.map((value, i) => {
            return i >= length ? null : value;
          })}
          <InfoWindow marker={this.state.infoWindow.marker}
            visible={this.state.infoWindow.display}>
            <BrowserRouter>
              <Link to={"/user/" + this.state.infoWindow.match.id}>
                {this.state.infoWindow.match.username}
              </Link>
            </BrowserRouter>
          </InfoWindow>
        </Map>
      </div>
    );
  }
}

export default withAllHOC(GoogleApiWrapper({
    apiKey: "AIzaSyCQwOn1Z6oev0SFXRHTxM9tKOqKi9pCMAU"
})(MatchMap));
