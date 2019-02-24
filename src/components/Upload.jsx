import React, { Component } from 'react';
import { withAllHOC } from '../utils/allHOC';
import parseForm from '../utils/parseForm';

class Upload extends Component {

  state = {
    pictures: [],
    new_pic: '',
    fav: ''
  }

  // Unused ?
  // savePicture = input => {
  //   console.log(this.state[input]);
  //   parseForm(this.state[input], strForm => {
  //     fetch('/api/pictures/add', {
  //       method: 'POST',
  //       headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
  //       body: strForm
  //     })
  //   });
  // }

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
        // si photo unique, mettre fav par défaut
        // handle response
        console.log(response);
      })
      .catch(err => {
        // handle error
      })
    });
  }

  handleFav = e => {
    const fav = e.target;
    const favs = document.querySelectorAll('#fav')
    for (let i = 0; i < favs.length; i++) {
      favs[i].innerHTML = 'star_border';
    }
    fav.innerHTML = 'star';
    // Dans le fav du state faut foutre l'id de la picture qui est fav.
    parseForm([this.state.fav], strBody => {
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
  }

  componentWillMount() {
    getPictures();
  }

  getPictures = () => {
    fetch('/api/pictures/get')
    .then(response => {
      if (response.ok) {
        this.setState({ pictures: response });
      }
    })
    .catch(err => {
      // handle error
      console.error(err);
    });
  }

  renderPictures = () => {
    var formatted = this.state.pictures.map(value => {
      var isFav = "star_border";
      var pictureUrl = "/pictures/user/" + value.picture;
      if (value.main == 1) {
        this.setState({ fav: value.id });
        isFav = "star";
      }
      // Todo: Css du rendu en dessous
      return (
        <React.Fragment>
          <div className="row">
              <div className="user_picture" id={value.id}>
                <img src={pictureUrl} alt={value.picture}/>
                <i id="fav" className="material-icons" onClick={this.handleFav}>{isFav}</i>
              </div>
          </div>
        </React.Fragment>
      )
    });
    return (formatted.length > 0 ? <div className="pictures">{ formatted }</div> : null);
  }

  render() {
    const { locale } = this.props.locales;
    return (
      <React.Fragment>
        {this.renderPictures}
        <div className="row">
          <div className="upload">
            <input name="pic1" type="file" accept="image/*" onChange={this.handleFileChange}/>
            <div className="upload-img" onClick={this.handleUpload}/>
            <i id="fav" className="material-icons" onClick={this.handleFav}>star_border</i>
          </div>
        </div>
        <button className="btn waves-effect waves-light">{locale.upload.btn}</button>
      </React.Fragment>
    );
    // Button upload useless nan ?
  }
}

export default withAllHOC(Upload);
