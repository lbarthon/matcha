import React, { Component } from 'react';
import { alert } from '../../utils/alert';
import { withAllHOC } from '../../utils/allHOC';
import req from '../../utils/req';
import M from 'materialize-css';

class AskReset extends Component {

  initModal() {
    let elems = document.querySelectorAll('.modal');
    M.Modal.init(elems, {});
  }

  handleAsk = () => {
    const email = document.querySelector('input[type=email]').value;
    req('/api/reset/ask', {email: email})
    .then(res => {
      alert('success', this.props.locales.idParser(res));
    })
    .catch(err => {
      alert('error', this.props.locales.idParser(err));
    })
  }

  componentDidMount() {
    this.initModal();
  }

  render() {
    const { locale } = this.props.locales;
    return (
      <div className="mt-10">
        <a href="" data-target="modal1" className="modal-trigger">{locale.resetpw.modal}</a>
        <div id="modal1" className="modal">
          <div className="modal-content clearfix">
            <h5>{locale.resetpw.title}</h5>
            <div class="input-field">
              <input id="email" type="email" class="validate"/>
              <label for="email">{locale.email}</label>
            </div>
            <a className="modal-close waves-effect waves-light btn right ml-5 mt-5" onClick={this.handleAsk}>{locale.send}</a>
            <a className="modal-close waves-effect btn-flat right mt-5">{locale.cancel}</a>
          </div>
        </div>
      </div>
    )
  }
}

export default withAllHOC(AskReset);
