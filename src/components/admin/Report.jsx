import React, { Component } from 'react';
import { alert } from '../../utils/alert';
import { withAllHOC } from '../../utils/allHOC';
import { Link } from 'react-router-dom';
import req from '../../utils/req';

class Report extends Component {

  handleDelete = e => {
    e.preventDefault();
    const { id } = this.props.report;
    req('/api/report/del', { id: id })
    .then(res => {
      alert('success', this.props.locales.idParser(res));
      if (this.props.onDelete) {
        this.props.onDelete();
      }
    })
    .catch(err => {
      alert('error', this.props.locales.idParser(err));
    });
  }

  handleBan = e => {
    e.preventDefault();
    const { id, reported_id } = this.props.report;
    req('/api/ban', { id: reported_id })
    .then(res => {
      alert('success', this.props.locales.idParser(res));
      req('/api/report/del', { id: id })
      .then(() => {
        if (this.props.onDelete) {
          this.props.onDelete();
        }
      })
      .catch(err => {
        alert('error', this.props.locales.idParser(err));
      });
    })
    .catch(err => {
      alert('error', this.props.locales.idParser(err));
    })
  }

  render() {
    if (this.props.report === undefined) return null;
    const { reporter_id, reporter, reported_id, reported, report } = this.props.report;
    return (
      <React.Fragment>
        <div>
          <Link to={"/user/" + reported_id}>
            <div>
              <p><span>{reported}</span> was report by {reporter} for {report}</p>
              <button onClick={this.handleDelete}>Supprimer</button>
              <button onClick={this.handleBan}>Bannir</button>
            </div>
          </Link>
        </div>
      </React.Fragment>
    )
  }
}

export default withAllHOC(Report);
