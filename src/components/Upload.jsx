import React, { Component } from 'react';
import { withAllHOC } from '../utils/allHOC';
import parseForm from '../utils/parseForm';
import { notify } from '../utils/alert';

class Upload extends Component {

  state = {
    pictures: [],
    new_pic: '',
    fav: ''
  }

  handleUpload = e => {
    const div = e.target.parentElement;
    const file = div.querySelector('input');
    file.click();
  }

  handleFileChange = e => {
    const input = e.target;
    const formData = new FormData();
    this.setState({ new_pic: input.files[0] }, () => {
      formData.append('file', this.state.new_pic);
      fetch('/api/pictures/add', {
        method: 'POST',
        headers: {
          'CSRF-Token' : localStorage.getItem('csrf')
        },
        body: formData
      })
      .then(response => {
        if (response.ok) {
          response.json().then(json => {
            if (json['error'])
              notify('error', this.props.locales.idParser(json['error']));
            else if (json['success']) {
              this.getPictures();
              notify('success', this.props.locales.idParser(json['success']));
            }
          });
        } else console.error(new Error(response.statusText));
      })
    });
  }

  handleFav = (e) => {
    const fav = e.target;
    const favs = document.querySelectorAll('#fav')
    const favId = fav.parentNode.id;
    if (fav.innerHTML === 'star') return;
    for (let i = 0; i < favs.length; i++) {
      favs[i].innerHTML = 'star_border';
    }
    fav.innerHTML = 'star';
    this.setState({ fav: favId }, () => {
      parseForm({ id: this.state.fav }, strBody => {
        fetch('/api/pictures/main/set', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'CSRF-Token' : localStorage.getItem('csrf')
          },
          body: strBody
        })
        .then(response => {
          if (response.ok) {
            response.json().then(json => {
              if (json['error'])
                notify('error', this.props.locales.idParser(json['error']));
              else if (json['success'])
                notify('success', this.props.locales.idParser(json['success']));
            });
          } else console.error(new Error(response.statusText));
        })
      });
    });
  }

  handleRemove = (e) => {
    const id = e.target.parentNode.id;
    const div = e.target.parentNode;
    parseForm({ id: id }, strBody => {
      fetch('/api/pictures/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'CSRF-Token' : localStorage.getItem('csrf')
        },
        body: strBody
      })
      .then(response => {
        if (response.ok) {
          response.json().then(json => {
            console.log(json);
            if (json['error'])
              notify('error', this.props.locales.idParser(json['error']));
            else if (json['success']) {
              this.getPictures();
              notify('success', this.props.locales.idParser(json['success']));
            }
          });
        } else console.error(new Error(response.statusText));
      })
    });
  }

  getPictures = () => {
    fetch('/api/pictures/get', {
      headers: {'CSRF-Token' : localStorage.getItem('csrf')}
    })
    .then(response => {
      if (response.ok) {
        response.json().then(json => {
          if (json['error'] == null && json['success'] !== this.state.pictures)
            this.setState({ pictures: json['success'] });
          else if (json['error'])
            notify('error', this.props.locales.idParser(json['error']));
        });
      } else console.error(new Error(response.statusText));
    });
  }

  componentWillMount() {
    this.getPictures();
  }

  componentDidMount() {
    document.title = this.props.locales.locale.title.upload;
  }

  render() {
    const { locale } = this.props.locales;
    return (
      <React.Fragment>
        <div className="row">
          {this.state.pictures.map(pic => {
            return (
              <div className="upload" key={pic.id} id={pic.id}>
                <div className="upload-img" style={{backgroundImage: 'url("/pictures/user/' + pic.picture + '")'}}></div>
                <i id="fav" className="material-icons" onClick={this.handleFav}>{pic.main ? 'star' : 'star_border'}</i>
                <i id="delete" className="material-icons" onClick={this.handleRemove}>close</i>
              </div>
            );
          })}
          <div className="upload">
            <input name="pic1" type="file" accept="image/*" onChange={this.handleFileChange}/>
            <div className="upload-img" style={{backgroundImage: 'url("images/add.svg")'}} onClick={this.handleUpload}/>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withAllHOC(Upload);
