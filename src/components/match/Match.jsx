import React, { Component } from 'react';
import parseForm from '../../utils/parseForm';
import { notify } from '../../utils/alert';
import { withAllHOC } from '../../utils/allHOC';
import M from 'materialize-css'
import Map from './Map';

class Match extends Component {

  state = {
    matchs: []
  }

  fetchMatchs = () => {
    const { locales } = this.props;
    fetch("/api/matchs/").then(response => {
      if (response.ok) {
        response.json().then(json => {
          if (json.error) {
            notify('error', locales.idParser(json.error))
          } else {
            this.setState({ matchs: json.success })
          }
        }).catch(console.error);
      }
    })
    .catch(console.error);
  }

  componentWillMount = () => {
    this.fetchMatchs();
  }

  render() {
    const { matchs } = this.state;
    if (matchs.length == 0) return null;

    return (
      <div>
        <Map matchs={matchs} userLocation={"30;30"} />
        <h1>TEST</h1>
        {matchs.map(value => {
          return (
            <div>
              <div>{value.username}</div>
              <div>{value.location}</div>
              <div>{value.birthdate}</div>
              <div>{value.description}</div>
            </div>
            )
        })}
      </div>
    )
  }
}

export default withAllHOC(Match);
