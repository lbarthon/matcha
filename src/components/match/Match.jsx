import React, { Component } from 'react';
import parseForm from '../../utils/parseForm';
import { notify } from '../../utils/alert';
import { withAllHOC } from '../../utils/allHOC';
import M from 'materialize-css'
import Map from './Map';

class Match extends Component {

  state = {
    matchs: [],
    user: [],
    sorted: []
  }

  sorts = [
    {
      key: 'matchs.sorts.default',
      function: this.defaultSort
    },
    {
      key: 'matchs.sorts.location',
      function: () => {
        const deg2rad = (deg) => {
          return deg * (Math.PI/180)
        }

        const getDistanceFromLatLon = (lat1,lon1,lat2,lon2) => {
          var dLat = deg2rad(lat2 - lat1);
          var dLon = deg2rad(lon2 - lon1); 
          var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2); 
          var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
          return c;
        }

        var user_split = this.state.user.location.split(";");
        var lat = user_split[0];
        var lng = user_split[1];
        this.setState({ sorted: this.state.matchs.sort((a, b) => {
          var a_split = a.location.split(";");
          var b_split = b.location.split(";");
          return getDistanceFromLatLon(lat, lng, a_split[0], a_split[1]) - getDistanceFromLatLon(lat, lng, b_split[0], b_split[1]);
        })
      })}
    },
    {
      key: 'matchs.sorts.age',
      function: () => {
        this.setState({ sorted: this.state.matchs.sort((a, b) => {
            var a_split = a.birthdate.split("/");
            var b_split = b.birthdate.split("/");
            return Number(a_split[2] + a_split[1] + a_split[0]) - Number(b_split[2] + b_split[1] + b_split[0]);
        })
      })}
    },
    {
      key: 'matchs.sorts.popularity',
      function: () => {
        this.setState({ sorted: this.state.matchs.sort((a, b) => b.popularity - a.popularity) });
      }
    },
    {
      key: 'matchs.sorts.tags',
      function: () => {
        const compare = arr => {
          var userTags = this.state.user.tags;
          var count = 0;
          arr.forEach(elem => {
            if (userTags.includes(elem)) {
              count++;
            }
          });
          return count;
        }
        this.setState({ sorted: this.state.matchs.sort((a, b) => {
          return compare(b.tags) - compare(a.tags);
        })
      })}
    }
  ]

  fetchMatchs = () => {
    const { locales } = this.props;
    fetch("/api/matchs/").then(response => {
      if (response.ok) {
        response.json().then(json => {
          if (json.error) {
            notify('error', locales.idParser(json.error))
          } else {
            this.setState({ matchs: json.success });
          }
        }).catch(console.error);
      }
    })
    .catch(console.error);
  }

  fetchUser = () => {
    const { locales } = this.props;
    fetch("/api/user/current").then(response => {
      if (response.ok) {
        response.json().then(json => {
          if (json.error) {
            notify('error', locales.idParser(json.error))
          } else {
            this.setState({ user: json.success });
          }
        }).catch(console.error);
      }
    })
    .catch(console.error);
  }

  fetchTags = () => {
    const { locales } = this.props;
    fetch("/api/tags/").then(response => {
      if (response.ok) {
        response.json().then(json => {
          if (json.error) {
            notify('error', locales.idParser(json.error))
          } else {
            var tags = json.success.map(value => { return value.tag; });
            this.setState({
              user: {
                ...this.state.user,
                tags: tags
              }
            });
          }
        }).catch(console.error);
      }
    })
    .catch(console.error);
  }

  componentWillMount = () => {
    this.fetchUser();
    this.fetchTags();
    this.fetchMatchs();
  }

  render() {
    const { sorted, matchs } = this.state;

    if (matchs.length == 0) return null;

    return (
      <div>
        {console.log(this.state.user)}
        <Map matchs={matchs} userLocation={this.state.user.location} />
        {this.sorts.map(value => {
            return (<button onClick={value.function}>{value.key}</button>)
        })}
        {sorted.map(value => {
          return (
            <div>
              <div>{value.username}</div>
              <div>{value.popularity}</div>
              <div>{value.location}</div>
              <div>{value.birthdate}</div>
              <div>{value.description}</div>
              <div>{value.tags.join(", ")}</div>
            </div>
            )
        })}
      </div>
    )
  }
}

export default withAllHOC(Match);
