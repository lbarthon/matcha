import React, { Component } from 'react';
import { notify } from '../../utils/alert';
import { withAllHOC } from '../../utils/allHOC';
import Map from './Map';
import MatchUser from './MatchUser';
import noUiSlider from 'materialize-css/extras/noUiSlider/nouislider';
import 'materialize-css/extras/noUiSlider/nouislider.css'

class Match extends Component {

  state = {
    matchs: [],
    user: [],
    sorted: [],
    key: ''
  }

  sorts = [
    {
      key: 'default',
      function: () => {
        var loc = this.sorts[1].function();
        var pop = this.sorts[3].function();
        var tag = this.sorts[4].function();
        return this.state.matchs.map(value => {
          value.score = loc.indexOf(value) + pop.indexOf(value) + tag.indexOf(value);
          return value;
        }).sort((a, b) => {
          return a.score - b.score;
        });
      }
    },
    {
      key: 'location',
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
       return this.state.matchs.sort((a, b) => {
          var a_split = a.location.split(";");
          var b_split = b.location.split(";");
          return getDistanceFromLatLon(lat, lng, a_split[0], a_split[1]) - getDistanceFromLatLon(lat, lng, b_split[0], b_split[1]);
        })
      }
    },
    {
      key: 'age',
      function: () => {
        return this.state.matchs.sort((a, b) => {
            var a_split = a.birthdate.split("/");
            var b_split = b.birthdate.split("/");
            return Number(a_split[2] + a_split[1] + a_split[0]) - Number(b_split[2] + b_split[1] + b_split[0]);
        })
      }
    },
    {
      key: 'popularity',
      function: () => {
        return this.state.matchs.sort((a, b) => b.popularity - a.popularity);
      }
    },
    {
      key: 'tags',
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
        return this.state.matchs.map(value => {
          value.commonTags = compare(value.tags);
          return value;
        }).sort((a, b) => {
          return b.commonTags - a.commonTags;
        })
      }
    }
  ]

  sort = (value, button) => {
    const { locale } = this.props.locales;
    let icon = document.querySelector('.sortbtn > i');
    if (icon && icon.parentElement.childNodes[0].data != locale.match.sort[value.key])
      icon.parentElement.removeChild(icon);
    if (value.key != this.state.key) {
      this.setState({ sorted: value.function(), key: value.key }, () => {
        let newIcon = document.createElement('i');
        newIcon.className = 'material-icons left';
        newIcon.innerHTML = 'arrow_drop_down';
        button.appendChild(newIcon);
      });
    } else {
      this.setState({ sorted: [...this.state.sorted].reverse()}, () => {
        icon.innerHTML = (icon.innerHTML == 'arrow_drop_down' ? 'arrow_drop_up' : 'arrow_drop_down');
      });
    }
  }

  fetchMatchs = () => {
    const { locales } = this.props;
    fetch("/api/matchs/", {
      headers: {
        'CSRF-Token' : localStorage.getItem('csrf')
      }
    }).then(response => {
      if (response.ok) {
        response.json().then(json => {
          if (json.error) {
            notify('error', locales.idParser(json.error))
          } else {
            this.setState({ matchs: json.success }, () => {
              this.initSlider();
            });
          }
        }).catch(console.error);
      }
    })
    .catch(console.error);
  }

  fetchUser = () => {
    const { locales } = this.props;
    fetch("/api/user/current", {
      headers: {
        'CSRF-Token' : localStorage.getItem('csrf')
      }
    }).then(response => {
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
    fetch("/api/tags/", {
      headers: {
        'CSRF-Token' : localStorage.getItem('csrf')
      }
    }).then(response => {
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

  initSlider = () => {
    let elems = document.querySelectorAll("input[type=range]");
    M.Range.init(elems);

    let slider = document.getElementById('test-slider');
    noUiSlider.create(slider, {
      start: [20, 80],
      connect: true,
      step: 1,
      range: {
        'min': 0,
        'max': 100
      },
      format: wNumb({
        decimals: 0
      })
    });
    elems = document.querySelectorAll("#test-slider");
    //M.Slider.init(slider);
  }

  componentWillMount = () => {
    this.fetchUser();
    this.fetchTags();
    this.fetchMatchs();
  }


  render() {
    const { sorted, matchs } = this.state;
    const { locale } = this.props.locales;
    if (matchs.length == 0) return null;
    return (
      <div>
        <Map matchs={matchs} userLocation={this.state.user.location} />
        <div className="row">
          <div className="col s12">
            {this.sorts.map(value => {
              return <button onClick={(e) => { this.sort(value, e.target) }} className="waves-effect waves-light btn-small mr-5 mt-5 sortbtn">{locale.match.sort[value.key]}</button>
            })}
          </div>
        </div>
        <div className="row">
          <label>Range</label>
          <div id="test-slider"></div>
          <p class="range-field">
            <input type="range" id="test5" min="0" max="100" />
          </p>
        </div>
        <div className="row">
          {sorted.map(value => {
            return <MatchUser key={value.id} user={value} />
          })}
        </div>
      </div>
    )
  }
}

export default withAllHOC(Match);
