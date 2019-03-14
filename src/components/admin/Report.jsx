import React, { Component } from 'react';
import { alert } from '../../utils/alert';
import { withAllHOC } from '../../utils/allHOC';
import { Link } from 'react-router-dom';
import req from '../../utils/req';

class Report extends Component {

  handleDelete = e => {
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
    const { locale } = this.props.locales;
    return (
      <React.Fragment>
        <div>
            <p className="m-0 pt-15 pb-15 bb">
              <div>
                <Link to={"/user/" + reported_id}><b>{reported}</b></Link> has been reported by <Link to={"/user/" + reporter_id}><b>{reporter}</b></Link>
                <br/><br/><em>"{report}"</em>
              </div>
              <div className="clearfix">
                <button className="right mt-5 btn-small red waves-effect waves-light" onClick={this.handleBan}>{locale.admin.ban}</button>
                <button className="right mr-5 mt-5 btn-small blue waves-effect waves-light" onClick={this.handleDelete}>{locale.admin.delete}</button>
              </div>
            </p>
        </div>
      </React.Fragment>
    )
  }
}

export default withAllHOC(Report);
