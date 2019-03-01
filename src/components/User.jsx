import React, { Component } from 'react';
import { withAllHOC } from '../utils/allHOC';
import { notify } from '../utils/alert';
import '../css/user.css';

class User extends Component {

  state = {
    username: '',
    description: '',
    gender: '',
    pictures: [],
    mainPic: {},
    tags: [],
  }

  getUser = () => {
    const { id } = this.props.match.params;
    fetch('/api/user/' + id)
    .then(response => {
      if (response.ok) {
        response.json().then(json => {
          json = json.response;
          this.setState({
            username: json.username,
            description: json.description,
            gender: json.sex
          })
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
          if (json['error'] == null && json['success'] !== this.state.pictures) {
            let pictures = json.success;
            for (var i in pictures) {
              if (pictures[i].main) {
                this.setState({ mainPic: pictures[i] });
                delete pictures[i];
              }
            }
            this.setState({ pictures: pictures });
          } else if (json['error'])
            notify('error', this.props.locales.idParser(json['error']));
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

  componentWillMount() {
    this.getTags();
    this.getUser();
    this.getPictures();
  }

  componentDidMount() {
    document.title = this.state.username;
  }

  render() {
    const { locale } = this.props.locales;
    return (
      <React.Fragment>
        <h4>{this.state.username}</h4>
        <div className="row">
          <div className="col xl10 s12">
            <div className="picture picture-main" style={{backgroundImage: 'url("/pictures/user/' + this.state.mainPic.picture + '")'}}></div>
          </div>
        </div>
        <div className="row">
          <div className="col s12 m4">
            <a className="waves-effect waves-light btn-small"><i className="material-icons left">favorite</i>{locale.user.like}</a>
          </div>
          <div className="col s12 m8">
            <a className="waves-effect waves-light btn-small red right ml-5"><i className="material-icons left">block</i>{locale.user.block}</a>
            <a className="waves-effect waves-light btn-small red right"><i className="material-icons left">priority_high</i>{locale.user.report}</a>
          </div>
        </div>
        {this.state.tags && <h6>Tags</h6>}
        {this.state.tags.map(tag => {
          return (<div class="chip">{tag.tag}</div>);
        })}
        <h6>Description</h6>
        <p>{this.state.description}</p>
        <h6>Gender</h6>
        <p>{this.state.gender}</p>
        <h6>More pics</h6>
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
