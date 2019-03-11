import React, { Component } from 'react';
import { withAllHOC } from '../utils/allHOC';
import { notify } from '../utils/alert';
import '../css/user.css';
import Map from './user/Map';
import httpBuildQuery from 'http-build-query';

class User extends Component {

  state = {
    user : undefined,
    pictures: [],
    mainPic: {},
    tags: [],
    liked: false,
    online: false
  }

  getUser = (id) => {
    fetch('/api/user/' + id, {
      headers: {'CSRF-Token' : localStorage.getItem('csrf')}
    })
    .then(response => {
      if (response.ok) {
        response.json().then(json => {
          if (json.success) {
            this.setState({ user: json.success }, () => {
              document.title = this.state.user.username;
            });
          } else if (json.error) {
            notify('error', this.props.locales.idParser(json.error));
          }
        });
      } else { console.error(new Error(response.statusText)); }
    })
  }

  getPictures = (id) => {
    fetch('/api/pictures/get/' + id, {
      headers: {'CSRF-Token' : localStorage.getItem('csrf')}
    })
    .then(response => {
      if (response.ok) {
        response.json().then(json => {
          if (json.error == null && json.success !== this.state.pictures) {
            let pictures = json.success;
            for (var i in pictures) {
              if (pictures[i].main) {
                this.setState({ mainPic: pictures[i] });
                delete pictures[i];
              }
            }
            this.setState({ pictures: pictures });
          } else if (json.error) {
            notify('error', this.props.locales.idParser(json.error));
          }
        });
      } else console.error(new Error(response.statusText));
    });
  }

  getTags = (id) => {
    const { locales } = this.props;
    fetch('/api/tags/' + id, {
      headers: {'CSRF-Token' : localStorage.getItem('csrf')}
    }).then(response => {
      if (response.ok) {
        response.json().then(json => {
          if (json.success) {
            this.setState({tags: json.success});
          } else {
            notify('error', locales.idParser(json.error))
          }
        });
      } else console.error(new Error(response.statusText));
    });
  }

  getLike = (id) => {
    fetch('/api/likes/has_like/' + id, {
      headers: {'CSRF-Token' : localStorage.getItem('csrf')}
    }).then(response => {
      if (response.ok) {
        response.json().then(json => {
          if (json.success != undefined) {
            if (json.success === true) {
              this.setState({liked: true});
            }
          } else {
            notify('error', this.props.locales.idParser(json.error));
          }
        });
      } else console.error(new Error(response.statusText));
    });
  }

  handleLike = () => {
    const str = httpBuildQuery({target : this.props.match.params.id});
    fetch('/api/likes/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'CSRF-Token' : localStorage.getItem('csrf')
      },
      body: str
    }).then(response => {
      if (response.ok) {
        response.json().then(json => {
          if (json.success) {
            this.setState({liked: true});
          } else
            notify('error', this.props.locales.idParser(json.error));
        });
      } else console.error(new Error(response.statusText));
    });
  }

  handleUnlike = (id) => {
    const str = httpBuildQuery({target : this.props.match.params.id});
    fetch('/api/likes/remove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'CSRF-Token' : localStorage.getItem('csrf')
      },
      body: str
    }).then(response => {
      if (response.ok) {
        response.json().then(json => {
          if (json.success) {
            this.setState({liked: false});
          } else
            notify('error', this.props.locales.idParser(json.error));
        });
      } else console.error(new Error(response.statusText));
    });
  }

  isOnline = (id) => {
    const { socket } = this.props;
    socket.emit('is_online', {userId: id});
    socket.on('is_online', data => {
      if (this.state.online !== data)
        this.setState({online: data});
    });
  }

  handleBlock = () => {

  }

  handleReport = () => {

  }

  getInfos = (id) => {
    this.setState({
      user : undefined,
      pictures: [],
      mainPic: {},
      tags: [],
      liked: false,
      online: false
    });
    this.getTags(id);
    this.getUser(id);
    this.getPictures(id);
    this.getLike(id);
    this.isOnline(id);
  }

  componentWillMount() {
    this.getInfos(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id != nextProps.match.params.id)
      this.getInfos(nextProps.match.params.id);
  }

  render() {
    if (!this.state.user) return null;
    const { locale } = this.props.locales;
    const { username, sex, description, location, firstname, lastname, wanted, birthdate} = this.state.user;
    return (
      <React.Fragment>
        <h4 className="center">{username}</h4>
        <div className="row">
          <div className="col xl6 m8 offset-xl3 offset-m2 s12">
            <div className="picture picture-main" style={{backgroundImage: 'url("/pictures/user/' + this.state.mainPic.picture + '")'}}></div>
          </div>
        </div>
        {this.props.match.params.id != this.props.currentUser.id &&
          <div className="row">
            {this.state.liked && <a className="waves-effect waves-light btn-small mt-5" onClick={this.handleUnlike}><i className="material-icons left">favorite</i>{locale.user.unlike}</a>}
            {!this.state.liked && <a className="waves-effect waves-light btn-small mt-5" onClick={this.handleLike}><i className="material-icons left">favorite</i>{locale.user.like}</a>}
            <a className="waves-effect waves-light btn-small red right ml-5 mt-5" onClick={this.handleBlock}><i className="material-icons left">block</i>{locale.user.block}</a>
            <a className="waves-effect waves-light btn-small red right mt-5" onClick={this.handleReport}><i className="material-icons left">flag</i>{locale.user.report}</a>
          </div>
        }
        {this.state.tags && <h6>Tags</h6>}
        {this.state.tags.map(tag => {
          return (<div class="chip">{tag.tag}</div>);
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
            <b>{this.state.online ? locale.user.online : 'offline'}</b>
          </div>
        </div>
        <Map location={location} />
        {this.state.pictures.length > 1 ? <h6>More pics</h6> : ''}
        {this.state.pictures.map(pic => {
          return (
            <div className="picture" style={{backgroundImage: 'url("/pictures/user/' + pic.picture + '")'}}></div>
          );
        })}
      </React.Fragment>
    )
  }
}
export default withAllHOC(User);
