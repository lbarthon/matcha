import React, { Component } from 'react';
import { withAllHOC } from '../utils/allHOC';
import parseForm from '../utils/parseForm';

class Upload extends Component {

  state = {
    pic1: '',
    pic2: '',
    pic3: '',
    pic4: ''
  }

  handleSubmit = e => {
    e.preventDefault();
    parseForm(this.state, strForm => {
      console.log(strForm);
      //API call : save pictures
    });
  }

  handleUpload = e => {
    const div = e.target.parentElement;
    const file = div.querySelector('input');
    file.click();
  }

  handleFileChange = e => {
    const input = e.target;
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
        <form onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="upload">
              <input name="pic1" type="file" accept="image/*" onChange={this.handleFileChange}/>
              <div className="upload-img" onClick={this.handleUpload}/>
              <i id="fav" className="material-icons" onClick={this.handleFav}>star_border</i>
            </div>
            <div className="upload">
              <input name="pic2" type="file" accept="image/*" onChange={this.handleFileChange}/>
              <div className="upload-img" onClick={this.handleUpload}/>
              <i id="fav" className="material-icons" onClick={this.handleFav}>star_border</i>
            </div>
            <div className="upload">
              <input name="pic3" type="file" accept="image/*" onChange={this.handleFileChange}/>
              <div className="upload-img" onClick={this.handleUpload}/>
              <i id="fav" className="material-icons" onClick={this.handleFav}>star_border</i>
            </div>
            <div className="upload">
              <input name="pic4" type="file" accept="image/*" onChange={this.handleFileChange}/>
              <div className="upload-img" onClick={this.handleUpload}/>
              <i id="fav" className="material-icons" onClick={this.handleFav}>star_border</i>
            </div>
          </div>
          <button className="btn waves-effect waves-light">{locale.upload.btn}</button>
        </form>
      </React.Fragment>
    )
  }
}

export default withAllHOC(Upload);
