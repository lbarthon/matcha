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
        },
        () => {
            this.setState({ loading: false });
        }
        );
    }

    mapClicked(coord) {
        const { latLng } = coord;
        const lat = latLng.lat();
        const lng = latLng.lng();
        this.setState({
            userLocation: {
                lat: lat,
                lng: lng
            }
        }, () => {
            console.log(this.state.userLocation);
        });
    }

    onMarkerDragEnd(coord) {
        const { latLng } = coord;
        const lat = latLng.lat();
        const lng = latLng.lng();
        this.setState({
            userLocation: {
                lat: lat,
                lng: lng
            }
        }, () => {
            console.log(this.state.userLocation);
        })
    }

    render() {
        const { loading, userLocation } = this.state;
        const { google } = this.props;

        if (loading) return null;

        return (
            <Map onClick={(t, map, coord) => this.mapClicked(coord)} google={google} initialCenter={userLocation} zoom={10}>
                <Marker onDragend={(t, map, coord) => this.onMarkerDragEnd(coord)}
                    name={'Current location'}
                    position={userLocation}
                    draggable={true} />
            </Map>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: "AIzaSyCQwOn1Z6oev0SFXRHTxM9tKOqKi9pCMAU"
})(MapContainer);