import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withAllHOC } from '../../utils/allHOC';
import M from 'materialize-css';

class SideChat extends Component {
  render() {
    return (
      <div>
        <div className="chat-tab">
          <div className="chip">
            <img src="http://lorempixel.com/400/400/" alt="Contact Person"/>
            Xavier Niel
            <span class="chat-new">4</span>
          </div>
          <i class="tiny material-icons right">arrow_forward_ios</i>
        </div>

        <div className="chat-tab">
          <div className="chip">
            <img src="http://lorempixel.com/400/400/"/>
            Bart Simpson
            <span class="chat-new">4</span>
          </div>
          <i class="tiny material-icons right">arrow_forward_ios</i>
        </div>
      </div>
    )
  }
}

export default withAllHOC(SideChat);
