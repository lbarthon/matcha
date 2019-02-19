import React, { Component } from 'react';
import { withAllHOC } from '../utils/allHOC';
import parseForm from '../utils/parseForm';

class Upload extends Component {

  state = {
    file1: '',
    file2: '',
    file3: ''
  }

  handleSubmit = e => {
    e.preventDefault();
    parseForm(this.state, strForm => {
      console.log(strForm);
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

  render() {
    const { locale } = this.props.locales;
    return (
      <React.Fragment>
        <form onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="upload">
                <input name="file1" type="file" accept="image/*" onChange={this.handleFileChange}/>
                <div className="upload-img" onClick={this.handleUpload}/>
            </div>
            <div className="upload">
                <input name="file2" type="file" accept="image/*" onChange={this.handleFileChange}/>
                <div className="upload-img" onClick={this.handleUpload}/>
            </div>
            <div className="upload">
                <input name="file3" type="file" accept="image/*" onChange={this.handleFileChange}/>
                <div className="upload-img" onClick={this.handleUpload}/>
            </div>
          </div>
          <button className="btn waves-effect waves-light">{locale.upload.btn}</button>
        </form>
      </React.Fragment>
    )
  }
}

export default withAllHOC(Upload);
