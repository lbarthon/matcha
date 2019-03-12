import React, { Component } from 'react';
import { withAllHOC } from '../../utils/allHOC';
import { notify } from '../../utils/alert';
import req from '../../utils/req';
import M from 'materialize-css';

class Actions extends React.Component {

  state = {
    liked: false,
    blocked: false
  }

  getLike = (id) => {
    req('/api/likes/has_like/' + id)
    .then(res => {
      if (res === true) {
        this.setState({liked: true});
      }
    })
    .catch(err => {
      notify('error', this.props.locales.idParser(err));
    })
  }

  handleLike = () => {
    req('/api/likes/add', {target: this.props.id})
    .then(res => {
      this.setState({liked: true});
    })
    .catch(err => {
      notify('error', this.props.locales.idParser(err));
    });
  }

  handleUnlike = (id) => {
    req('/api/likes/remove', {target : this.props.id})
    .then(res => {
      this.setState({liked: false});
    })
    .catch(err => {
      notify('error', this.props.locales.idParser(err));
    })
  }

  getBlock = (id) => {
    req('/api/blocked/has_blocked/' + id)
    .then(res => {
      if (res === true)
        this.setState({blocked: true});
    })
    .catch(err => {
      notify('error', this.props.locales.idParser(err));
    })
  }

  handleBlock = () => {
    req('/api/blocked/add', {target : this.props.id})
    .then(res => {
      notify('success', this.props.locales.idParser(res));
      this.setState({blocked: true});
    })
    .catch(err => {
      notify('error', this.props.locales.idParser(err));
    })
  }

  handleUnblock = () => {
    req('/api/blocked/remove', {target : this.props.id})
    .then(res => {
      notify('success', this.props.locales.idParser(res));
      this.setState({blocked: false});
    })
    .catch(err => {
      notify('error', this.props.locales.idParser(err));
    })
  }


  handleReport = () => {
    let reason = document.querySelector('#reason').value;
    req('/api/report/add', {target: this.props.id, text: reason})
    .then(res => {
      notify('success', this.props.locales.idParser(res));
    })
    .catch(err => {
      notify('error', this.props.locales.idParser(err));
    })
  }

  initModal = () => {
    let elems = document.querySelectorAll('.modal');
    M.Modal.init(elems, {});
  }

  componentWillMount() {
    this.getLike(this.props.id);
    this.getBlock(this.props.id);
  }

  componentDidMount() {
    this.initModal();
  }

  render () {
    const { locale } = this.props.locales;
    return (
      <React.Fragment>
        {this.props.id != this.props.currentUser.id &&
          <div className="row">
            {this.state.liked
              ? <a className="waves-effect waves-light btn-small mt-5" onClick={this.handleUnlike}><i className="material-icons left">favorite</i>{locale.user.unlike}</a>
              : <a className="waves-effect waves-light btn-small mt-5" onClick={this.handleLike}><i className="material-icons left">favorite</i>{locale.user.like}</a>
            }
            <a data-target="modal1" className="modal-trigger waves-effect waves-light btn-small red right mt-5 ml-5"><i className="material-icons left">flag</i>{locale.user.report}</a>
            <div id="modal1" className="modal">
              <div className="modal-content">
                <h5>{locale.user.report}</h5>
                <div className="input-field">
                  <textarea id="reason" className="materialize-textarea"></textarea>
                  <label for="reason">{locale.user.reason}</label>
                </div>
              </div>
              <div className="modal-footer">
                <button className="modal-close waves-effect btn-flat">{locale.cancel}</button>
                <button className="modal-close waves-effect btn-flat blue-text" onClick={this.handleReport}>{locale.send}</button>
              </div>
            </div>
            {!this.state.blocked
              ? <a className="waves-effect waves-light btn-small red right mt-5" onClick={this.handleBlock}><i className="material-icons left">block</i>{locale.user.block}</a>
              : <a className="waves-effect waves-light btn-small red right mt-5" onClick={this.handleUnblock}><i className="material-icons left">block</i>{locale.user.unblock}</a>
            }
          </div>
        }
      </React.Fragment>
    )
  }
}

export default withAllHOC(Actions);
