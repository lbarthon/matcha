import React, { Component } from 'react';
import { withAllHOC } from '../utils/allHOC';
import parseForm from '../utils/parseForm';

class Upload extends Component {

  state = {
    picture: '',
  }

  savePicture = input => {
    console.log(this.state[input]);
    parseForm(this.state[input], strForm => {
      fetch('/api/pictures/add', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
        body: strForm
      })
    });
  }

  handleUpload = e => {
    const div = e.target.parentElement;
    const file = div.querySelector('input');
    file.click();
  }

  handleFileChange = e => {
    const input = e.target;
    const formData = new FormData();
    this.setState({ picture: input.files[0] }, () => {
      formData.append('picture', this.state.picture);
      console.log(this.state.picture)
      console.log(formData);
      fetch('/api/pictures/add', {
        method: 'POST',
        body: formData
      })
      .then(response => {
        console.log(response);
      })
    });

    /*
    const reader = new FileReader();
    const img = input.parentElement.querySelector('.upload-img');
    const upload = this;
    this.setState({ [input.name]: input.files[0] });
    if (input.files && input.files[0]) {
      reader.onload = function(e) {
        img.style.backgroundImage = 'url(' + e.target.result + ')';
        upload.setState({ [input.name]: e.target.result });
      }
      reader.readAsDataURL(input.files[0]);
    }
    this.savePicture(input.name);
    */
  }

  handleFav = e => {
    const fav = e.target;
    const favs = document.querySelectorAll('#fav')
    for (let i = 0; i < favs.length; i++) {
      favs[i].innerHTML = 'star_border';
    }
    fav.innerHTML = 'star';
    //call to API : set fav
  }

  componentWillMount() {
    //call to API : getFavNb && getPicturesFromUser
  }

  render() {
    const { locale } = this.props.locales;
    return (
      <React.Fragment>
        <div className="row">
          <div className="upload">
            <input name="pic1" type="file" accept="image/*" onChange={this.handleFileChange}/>
            <div className="upload-img" onClick={this.handleUpload}/>
            <i id="fav" className="material-icons" onClick={this.handleFav}>star_border</i>
          </div>
        </div>
        <button className="btn waves-effect waves-light">{locale.upload.btn}</button>
      </React.Fragment>
    )
  }
}

export default withAllHOC(Upload);
