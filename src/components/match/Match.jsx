import React, { Component } from 'react';
import { alert } from '../../utils/alert';
import { withAllHOC } from '../../utils/allHOC';
import Map from './Map';
import MatchUser from './MatchUser';
import noUiSlider from 'materialize-css/extras/noUiSlider/nouislider';
import req from '../../utils/req';
import 'materialize-css/extras/noUiSlider/nouislider.css'

class Match extends Component {

  _isMounted = false;

  constructor(props) {
    super(props);

    window.onscroll = () => {
      const { isLoading } = this.state;
      if (isLoading) return;
      if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
        this.setStateCheck({ isLoading: true }, () => {
          this.setStateCheck({
            length: this.state.length + 20,
            isLoading: false
          });
        });
      }
    }
  }

  state = {
    matchs: [],
    user: [],
    sorted: [],
    limits: {},
    key: '',
    length: 20,
    isLoading: false
  }

  sorts = [
    {
      key: 'default',
      function: () => {
        var loc = this.sorts[1].function();
        var pop = this.sorts[3].function();
        var tag = this.sorts[4].function();
        return this.state.matchs.map(value => {
          value.score = loc.iOf(value) + pop.iOf(value) + tag.iOf(value);
          return value;
        }).sort((a, b) => {
          return a.score - b.score;
        });
      }
    },
    {
      key: 'distance',
      function: () => {
        return this.state.matchs.sort((a, b) => {
          return a.distance - b.distance;
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
        return this.state.matchs.sort((a, b) => {
          return b.tags - a.tags;
        })
      }
    }
  ]

  /**
   * Returns the number of tags in common with the logged user.
   */
  getCommonTags = (tags) => {
    var userTags = this.state.user.tags;
    var count = 0;
    tags.forEach(elem => {
      if (userTags.includes(elem)) {
        count++;
      }
    });
    return count;
  }

  /**
   * Returns age of birthdate, whose format is DD/MM/YYYY
   */
  getAge = (birthdate) => {
    let now = new Date();
    let split = birthdate.split("/");
    let years = now.getFullYear() - split[2];
    if (split[1] >= now.getMonth() + 1) {
      if (split[1] == now.getMonth() + 1) {
        if (split[0] > now.getDate()) {
          years--;
        }
      } else {
        years--;
      }
    }
    return years;
  }

  /**
   * Degrees to radians
   */
  deg2rad = (deg) => {
    return deg * (Math.PI / 180)
  }

  /**
   * Distance from logged user lat lng and params latLon (array containing lat and lon)
   */
  getDistanceFromUser = (latLon) => {
    var lat1 = latLon[0];
    var lon1 = latLon[1];
    var userSplit = this.state.user.location.split(";");
    var lat2 = userSplit[0];
    var lon2 = userSplit[1];

    var dLat = this.deg2rad(lat2 - lat1);
    var dLon = this.deg2rad(lon2 - lon1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return c * 6371;
  }

  sort = (value, button) => {
    const { locale } = this.props.locales;
    let icon = document.querySelector('.sortbtn > i');
    if (icon && icon.parentElement.childNodes[0].data != locale.match.sort[value.key])
      icon.parentElement.removeChild(icon);
    if (value.key != this.state.key) {
      this.setStateCheck({
        sorted: value.function(),
        key: value.key,
        length: 20
      }, () => {
        let newIcon = document.createElement('i');
        newIcon.className = 'material-icons left';
        newIcon.innerHTML = 'arrow_drop_down';
        button.appendChild(newIcon);
      });
    } else {
      this.setStateCheck({
        sorted: [...this.state.sorted].reverse(),
        length: 20
      }, () => {
        icon.innerHTML = (icon.innerHTML == 'arrow_drop_down' ? 'arrow_drop_up' : 'arrow_drop_down');
      });
    }
  }

  fetchMatchs = () => {
    const { locales } = this.props;
    req('/api/matchs')
    .then(response => {
      this.setStateCheck({
        matchs: response.map(value => {
          value.age = this.getAge(value.birthdate);
          value.tags = this.getCommonTags(value.tags);
          value.distance = this.getDistanceFromUser(value.location.split(";"));
          return value;
        })
      });
    })
    .catch(err => {
      alert('error', locales.idParser(err));
    });
  }

  fetchUser = () => {
    const { locales } = this.props;
    req('/api/user/current')
    .then(response => {
      this.setStateCheck({ user: response }, () => {
        this.fetchTags();
      });
    })
    .catch(err => {
      alert('error', locales.idParser(err));
    })
  }

  fetchTags = () => {
    const { locales } = this.props;
    req('/api/tags')
    .then(response => {
      var tags = response.map(value => { return value.tag; });
      this.setStateCheck({
        user: {
          ...this.state.user,
          tags: tags
        }
      }, () => {
        this.fetchMatchs();
      });
    })
    .catch(err => {
      alert('error', locales.idParser(err));
    });
  }

  initSlider = (infos) => {
    if (infos.key == 'default') return;
    let slider = document.getElementById(infos.key + '-slider');
    if (slider && !slider.noUiSlider) {
      let min = this.state.matchs.reduce((min, p) => p[infos.key] < min ? p[infos.key] : min, this.state.matchs[0][infos.key]);
      let max = this.state.matchs.reduce((max, p) => p[infos.key] > max ? p[infos.key] : max, this.state.matchs[0][infos.key]);
      if (min == max) {
        let elem = document.getElementById(infos.key);
        if (elem) elem.remove();
        let btn = document.getElementById(infos.key + '-btn');
        if (btn) btn.remove();
      } else {
        noUiSlider.create(slider, {
          start: [min, max],
          connect: true,
          step: 1,
          range: {
            min: min,
            max: max
          },
          format: wNumb({
            decimals: 0
          })
        });
        slider.noUiSlider.on('change', slider => {
          let { limits } = this.state;
          limits[infos.key] = {
            min: slider[0],
            max: slider[1]
          }
          this.setStateCheck({ limits: limits });
        });
      }
    }
  }

  componentDidUpdate() {
    this.sorts.forEach(this.initSlider);
  }

  componentWillMount() {
    this.fetchUser();
    document.title = 'Match';
  }

  _isMounted = false;
  setStateCheck = (state, callback) => {
    if (this._isMounted)
      this.setState(state, callback);
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { sorted, matchs, limits, length, user } = this.state;
    const { locale } = this.props.locales;

    if (matchs.length === 0) return null;
    if (sorted.length === 0) {
      this.setStateCheck({ sorted: this.sorts[0].function() });
    }

    var to_display = sorted.filter(value => {
      for (let i = 0; i < this.sorts.length; i++) {
        let key = this.sorts[i].key;
        if (limits[key] && limits[key].min && limits[key].max) {
          if (value[key] < limits[key].min || value[key] > limits[key].max) {
            return false;
          }
        }
      }
      return true;
    });

    return (
      <div>
        <Map length={length} matchs={to_display} userLocation={user.location} />
        <div className="row">
          <div className="col s12">
            {this.sorts.map((value, i) => {
              if (value.key == 'default') return null;
              return <button key={i} id={value.key + '-btn'} onClick={(e) => { this.sort(value, e.target) }} className="waves-effect waves-light btn-small mr-5 mt-5 sortbtn">{locale.match.sort[value.key]}</button>
            })}
          </div>
        </div>
        {this.sorts.map((value, i) => {
          if (value.key == 'default') return null;
          return (
            <div key={i} id={value.key} className="row">
              <label>{locale.match.sort[value.key]}</label>
              <div id={value.key + "-slider"}></div>
            </div>
          )
        })}
        <div className="row">
          {to_display.map((value, i) => {
            if (i >= length) return null;
            return <MatchUser key={value.id} user={value} />
          })}
        </div>
      </div>
    )
  }
}

export default withAllHOC(Match);
