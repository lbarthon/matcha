import React, { Component } from 'react';
import { withAllHOC } from '../utils/allHOC';
import { notify } from '../utils/alert';
import '../css/user.css';
import DisplayMap from './DisplayMap';
import httpBuildQuery from 'http-build-query';

class User extends Component {

  state = {
    user : undefined,
    pictures: [],
    mainPic: {},
    tags: [],
    liked: false
  }

  getUser = () => {
    const { id } = this.props.match.params;
    fetch('/api/user/' + id)
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

  getPictures = () => {
    const { id } = this.props.match.params;
    fetch('/api/pictures/get/' + id)
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
          } else if (json.error)
            notify('error', this.props.locales.idParser(json.error));
        });
      } else console.error(new Error(response.statusText));
    });
  }

  getTags = () => {
    const { id } = this.props.match.params;
    const { locales } = this.props;
    fetch('/api/tags/' + id)
    .then(response => {
      if (response.ok) {
        response.json().then(json => {
          if (json.success) {
            this.setState({tags: json.success});
          } else
            notify('error', locales.idParser(json.error))
        });
      } else console.error(new Error(response.statusText));
    });
  }

  getLike = () => {
    fetch('/api/likes/has_like/' + this.props.match.params).then(response => {
      if (response.ok) {
        response.json().then(json => {
          if (json.success) {
            if (json.success === true)
              this.setState({liked: true});
          } else
            notify('error', locales.idParser(json.error));
        });
      } else console.error(new Error(response.statusText));
    });
  }

  handleLike = () => {
    const str = httpBuildQuery({target : this.props.match.params});
    fetch('/api/likes/add', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
      body: str
    }).then(response => {
      if (response.ok) {
        response.json().then(json => {
          if (json.success) {
            this.setState({liked: true});
          } else
            notify('error', locales.idParser(json.error));
        });
      } else console.error(new Error(response.statusText));
    });
  }

  handleUnlike = () => {
    const str = httpBuildQuery({target : this.props.match.params});
    fetch('/api/likes/remove', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
      body: str
    }).then(response => {
      if (response.ok) {
        response.json().then(json => {
          if (json.success) {
            this.setState({liked: false});
          } else
            notify('error', locales.idParser(json.error));
        });
      } else console.error(new Error(response.statusText));
    });
  }

  handleBlock = () => {

  }

  handleReport = () => {

  }

  componentWillMount() {
    this.getTags();
    this.getUser();
    this.getPictures();
    this.getLike();
  }

  render() {
    if (!this.state.user) return null;
    const { locale } = this.props.locales;
    const { username, sex, description, location } = this.state.user;
    return (
      <React.Fragment>
        <h4>{username}</h4>
        <div className="row">
          <div className="col xl10 s12">
            <div className="picture picture-main" style={{backgroundImage: 'url("/pictures/user/' + this.state.mainPic.picture + '")'}}></div>
          </div>
        </div>
        <div className="row">
          <div className="col s12 m4">
            {this.state.liked && <a className="waves-effect waves-light btn-small" onClick={this.handleUnlike}><i className="material-icons left">favorite</i>{locale.user.unlike}</a>}
            {!this.state.liked && <a className="waves-effect waves-light btn-small" onClick={this.handleLike}><i className="material-icons left">favorite</i>{locale.user.like}</a>}
          </div>
          <div className="col s12 m8">
            <a className="waves-effect waves-light btn-small red right ml-5" onClick={this.handleBlock}><i className="material-icons left">block</i>{locale.user.block}</a>
            <a className="waves-effect waves-light btn-small red right" onClick={this.handleReport}><i className="material-icons left">flag</i>{locale.user.report}</a>
          </div>
        </div>
        {this.state.tags && <h6>Tags</h6>}
        {this.state.tags.map(tag => {
          return (<div class="chip">{tag.tag}</div>);
        })}
        <h6>Description</h6>
        <p>{description}</p>
        <h6>Gender</h6>
        <p>{sex}</p>
        <DisplayMap location={location} />
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
