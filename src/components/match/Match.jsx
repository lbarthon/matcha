import React, { Component } from 'react';
import parseForm from '../../utils/parseForm';
import { notify } from '../../utils/alert';
import { withAllHOC } from '../../utils/allHOC';
import M from 'materialize-css'
import Map from './Map';

class Match extends Component {

  state = {
    matchs: [],
    sorted: []
  }

  fetchMatchs = () => {
    const { locales } = this.props;
    fetch("/api/matchs/").then(response => {
      if (response.ok) {
        response.json().then(json => {
          if (json.error) {
            notify('error', locales.idParser(json.error))
          } else {
            this.setState({ matchs: json.success }, this.popularitySort);
          }
        }).catch(console.error);
      }
    })
    .catch(console.error);
  }

  // Tous ces sorts doivent pouvoir prendre des limites genre dans this.state.limits pour l'âge, la location etc.
  // On va bien se marrer mon pote

  defaultSort = () => {
    // Ce sort c'est un mix de location + tags + popularité
  }

  reverseSort = () => {
    this.setState({ sorted: this.state.sorted.reverse() });
    // Ça reverse le sort pris en param
    // En gros, si sort par location la plus proche, ça sortira le plus loin en premier.
    // Juste ça reverse l'array bien sort
  }

  locationSort = () => {
    // Faire des calculs avec lat & lng pr sort le plus proche puis le 2e plus proche etc.
  }

  ageSort = () => {
    // Calculs sur birthdate
  }

  popularitySort = () => {
    this.setState({ sorted: this.state.matchs.sort((a, b) => a.popularity - b.popularity) });
    // Popularité reverse
  }

  commonTagsSort = () => {
    // Sort en fonction du nombre de tags en commun
  }

  componentWillMount = () => {
    this.fetchMatchs();
  }

  render() {
    const { sorted, matchs } = this.state;

    if (matchs.length == 0) return null;

    return (
      <div>
        <Map matchs={matchs} userLocation={"30;30"} />
        {sorted.map(value => {
          return (
            <div>
              <div>{value.username}</div>
              <div>{value.popularity}</div>
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
