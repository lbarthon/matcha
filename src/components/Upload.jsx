import React, { Component } from 'react';
import { withAllHOC } from '../utils/allHOC';
import parseForm from '../utils/parseForm';

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
        body: formData
      })
      .then(response => {
        if (response.ok) {
          // si photo unique, mettre fav par défaut
          // handle response
          // console.log(response);
          this.getPictures();
        }
      })
      .catch(err => {
        // handle error
        console.error(err);
      });
    });
  }

  handleFav = e => {
    const fav = e.target;
    const favs = document.querySelectorAll('#fav')
    const favId = e.target.parentNode.id;
    for (let i = 0; i < favs.length; i++) {
      favs[i].innerHTML = 'star_border';
    }
    fav.innerHTML = 'star';
    this.setState({ fav: favId }, () => {
      // Dans le fav du state faut foutre l'id de la picture qui est fav.
      parseForm({ id: this.state.fav }, strBody => {
        fetch('/api/pictures/main/set', {
          method: 'POST',
          body: strBody
        })
        .then(response => {
          if (response.ok) {
            // handle response
          }
        })
        .catch(err => {
          // handle error
          console.error(err);
        });
      });
    });
  }

  componentWillMount() {
    this.getPictures();
  }

  getPictures = () => {
    fetch('/api/pictures/get')
    .then(response => {
      if (response.ok) {
        response.json().then(json => {
          if (json.response !== this.state.pictures)
            this.setState({ pictures: json.response });
        });
      }
    })
    .catch(err => { console.error(err); });
  }

  render() {
    const { locale } = this.props.locales;
    return (
      <React.Fragment>
        <div className="row">
          {this.state.pictures.map(pic => {
            console.log(pic);
            return (
              <div className="upload" key={pic.id}>
                <div className="" style={{backgroundImage: 'url(' + require('../../public/pictures/user/' + pic.picture) + ')'}}></div>
                <i id="fav" className="material-icons" onClick={this.handleFav}>star_border</i>
              </div>
            );
          })}
          <div className="upload">
            <input name="pic1" type="file" accept="image/*" onChange={this.handleFileChange}/>
            <div className="upload-img" onClick={this.handleUpload}/>
            <i id="fav" className="material-icons" onClick={this.handleFav}>star_border</i>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withAllHOC(Upload);
