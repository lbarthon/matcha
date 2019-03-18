import React, { Component } from 'react';
import { withAllHOC } from '../../utils/allHOC';
import { alert } from '../../utils/alert';
import '../../css/user.css';
import Map from './Map';
import Actions from './Actions';
import req from '../../utils/req';
import dateFormat from 'dateformat';

class User extends Component {

  state = {
    user : {
      id: undefined
    },
    pictures: [],
    mainPic: {},
    tags: [],
    online: false,
    popularity: 0,
    likeMe: false,
    matchMe: false,
  }

  getPopularity = (id) => {
    req('/api/likes/get/' + id)
    .then(res => {
      this.setStateCheck({popularity: Math.round(res)});
    })
    .catch(err => {
      alert('error', this.props.locales.idParser(err));
    })
  }

  getUser = (id) => {
    req('/api/user/' + id)
    .then(res => {
      this.setStateCheck({ user: res }, () => {
        document.title = this.state.user.username;
        this.getPictures(id);
        this.isOnline(id);
        this.getPopularity(id);
        this.getTags(id);
        this.getMatchMe(id);
        this.getLikeMe(id);
      });
    })
    .catch(err => {
      alert('error', this.props.locales.idParser(err));
    })
  }

  getPictures = (id) => {
    req('/api/pictures/get/' + id)
    .then(res => {
      let pictures = res;
      for (var i in pictures) {
        if (pictures[i].main) {
          this.setStateCheck({ mainPic: pictures[i] });
          delete pictures[i];
        }
      }
      this.setStateCheck({ pictures: pictures });
    })
    .catch(err => {
      alert('error', this.props.locales.idParser(err));
    })
  }

  getTags = (id) => {
    req('/api/tags/' + id)
    .then(res => {
      this.setStateCheck({tags: res});
    })
    .catch(err => {
      alert('error', this.props.locales.idParser(err));
    })
  }

  isOnline = (id) => {
    const { socket } = this.props;
    socket.emit('is_online', {userId: id});
    socket.on('is_online', data => {
      if (this.state.online !== data)
        this.setStateCheck({online: data});
    });
  }

  getLikeMe = (id) => {
    req('/api/likes/has_like_reverse/' + id)
    .then(res => {
      if (res === true) {
        this.setStateCheck({likeMe: true});
      }
    })
    .catch(err => {
      alert('error', this.props.locales.idParser(err));
    })
  }

  getMatchMe = (id) => {
    req('/api/likes/match/' + id)
    .then(res => {
      if (res === true) {
        this.setStateCheck({matchMe: true});
      }
    })
    .catch(err => {
      alert('error', this.props.locales.idParser(err));
    })
  }

  getInfos = (id) => {
    this.setStateCheck({
      user : {
        id: undefined
      },
      pictures: [],
      mainPic: {},
      tags: [],
      online: false,
      popularity: 0,
      likeMe: false,
      matchMe: false
    }, () => {
      this.getUser(id);
    });
  }

  toggleMatch = () => {
    if (this.state.likeMe == true)
      this.setStateCheck({matchMe: !this.state.matchMe});
  }

  componentWillMount() {
    this._isMounted = true;
    this.getInfos(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id != nextProps.match.params.id)
      this.getInfos(nextProps.match.params.id);
  }

  _isMounted = false;
  setStateCheck = (state, callback) => {
    if (this._isMounted)
      this.setState(state, callback);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    if (this.state.user.id === undefined) return null;
    const { locale } = this.props.locales;
    const { username, sex, description, location, firstname, lastname, wanted, birthdate, last_seen} = this.state.user;
    return (
      <React.Fragment>
        <h4 className="center">{username}</h4>
        <div className="row">
          <div className="col xl6 m8 offset-xl3 offset-m2 s12">
            <div className="picture picture-main" style={{backgroundImage: 'url("/pictures/user/' + this.state.mainPic.picture + '")'}}></div>
          </div>
        </div>
        <Actions id={this.state.user.id} toggleMatch={this.toggleMatch}/>
        <div className="row">
          {this.state.likeMe && <div><i className="material-icons blue-text" style={{verticalAlign:'sub'}}>favorite</i> This user likes you</div>}
          {this.state.matchMe && <div><i className="material-icons amber-text" style={{verticalAlign:'sub'}}>star</i> This user match with you</div>}
        </div>
        {this.state.tags && <h6>Tags</h6>}
        {this.state.tags.map((tag, i) => {
          return (<div className="chip" key={i}>{tag.tag}</div>);
        })}
        <h6>Description</h6>
        <p>{description}</p>
        <h6>Informations</h6>
        <div className="row">
          <div className="col s12 m6 mt-10">
            <span>{locale.firstname} </span>
            <b>{firstname}</b>
          </div>
          <div className="col s12 m6 mt-10">
            <span>{locale.lastname} </span>
            <b>{lastname}</b>
          </div>
          <div className="col s12 m6 mt-10">
            <span>{locale.register.gender} </span>
            <b>{locale.gender[sex.toLowerCase()]}</b>
          </div>
          <div className="col s12 m6 mt-10">
            <span>{locale.register.lookingfor} </span>
            <b>{locale.gender[wanted.toLowerCase()]}</b>
          </div>
          <div className="col s12 m6 mt-10">
            <span>{locale.register.birthdate} </span>
            <b>{birthdate}</b>
          </div>
          <div className="col s12 m6 mt-10">
            <span>{locale.user.last_connection} </span>
            <b>{this.state.online ? locale.user.online : dateFormat(new Date(last_seen), 'd/mm/yyyy HH:MM')}</b>
          </div>
          <div className="col s12 m6 mt-10">
            <span>{locale.user.popularity} </span>
            <b>{this.state.popularity}/10</b>
          </div>
        </div>
        <Map location={location} />
        {this.state.pictures.length > 1 ? <h6>More pics</h6> : ''}
        {this.state.pictures.map((pic, i) => {
          return (
            <div key={i} className="picture" style={{backgroundImage: 'url("/pictures/user/' + pic.picture + '")'}}></div>
          );
        })}
      </React.Fragment>
    )
  }
}
export default withAllHOC(User);
