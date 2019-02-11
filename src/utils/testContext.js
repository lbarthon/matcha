import React, { Component } from 'react';

export const AlertContext = React.createContext({
  alerts : [],
  addAlert : () => {}
});

export class AlertProvider extends Component {

  state = {
    alerts : [],
    addAlert : (msg) => {
      this.setState({ alerts: this.state.alerts.concat([msg]) });
    }
  }

  removeAlert = (i) => {
    var alerts = [...this.state.alerts];
    alerts.splice(i, 1);
    this.setState({ alerts: alerts });
  }

  render() {
    return (
      <AlertContext.Provider value={this.state}>
        {this.state.alerts.map((alert, i) => <Alert key={i} index={i} removeAlert={this.removeAlert}>{alert}</Alert>)}
        {this.props.children}
      </AlertContext.Provider>
    )
  }
}

class Alert extends Component {
  render() {
    const { children, index, removeAlert } = this.props;
    return (
      <div class="card-panel">
        {children}
        <button onClick={() => removeAlert({index})}>Delete</button>
      </div>
    )
  }
}
