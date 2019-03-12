import React, { Component } from 'react';
import { withAllHOC } from '../utils/allHOC';
import { notify } from '../utils/alert';
import '../css/user.css';
import Map from './user/Map';
import Actions from './user/Actions';
import req from '../utils/req';

class User extends Component {

  state = {
    user : {
      id: undefined
    },
    pictures: [],
    mainPic: {},
    tags: [],
    online: false
  }

  getUser = (id) => {
    req('/api/user/' + id)
    .then(res => {
      this.setState({ user: res }, () => {
        document.title = this.state.user.username;
      });
    })
    .catch(err => {
      notify('error', this.props.locales.idParser(err));
    })
  }

  getPictures = (id) => {
    req('/api/pictures/get/' + id)
    .then(res => {
      let pictures = res;
      for (var i in pictures) {
        if (pictures[i].main) {
          this.setState({ mainPic: pictures[i] });
          delete pictures[i];
        }
      }
      this.setState({ pictures: pictures });
    })
    .catch(err => {
      notify('error', this.props.locales.idParser(err));
    })
  }

  getTags = (id) => {
    req('/api/tags/' + id)
    .then(res => {
      this.setState({tags: res});
    })
    .catch(err => {
      notify('error', this.props.locales.idParser(err));
    })
  }

  isOnline = (id) => {
    const { socket } = this.props;
    socket.emit('is_online', {userId: id});
    socket.on('is_online', data => {
      if (this.state.online !== data)
        this.setState({online: data});
    });
  }

  getInfos = (id) => {
    this.setState({
      user : {
        id: undefined
      },
      pictures: [],
      mainPic: {},
      tags: [],
      online: false
    });
    this.getTags(id);
    this.getUser(id);
    this.getPictures(id);
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
    if (!this.state.user.id) return null;
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
        <Actions id={this.state.user.id}/>
        {this.state.tags && <h6>Tags</h6>}
        {this.state.tags.map(tag => {
          return (<div className="chip">{tag.tag}</div>);
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
