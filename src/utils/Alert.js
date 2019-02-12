import React from 'react';
import ReactDOM from 'react-dom';
import './Alert.css';

export const notify = (type, text) => {
  let container = document.getElementById('alert-container');
  let div = document.createElement("div");
  container.appendChild(div);
  ReactDOM.render(
    <Alert text={text} type={type}/>
    , div
  );
}

export const cleanAlerts = () => {
  let container = document.getElementById('alert-container');
  while (container.hasChildNodes()) {
    container.removeChild(container.lastChild);
  }
}
export const AlertContainer = () => {
  return <div id="alert-container"></div>
}

class Alert extends React.Component {

  styles = {
    error: {
      icon: 'error',
      color: 'red'
    },
    success: {
      icon: 'check',
      color: 'green'
    }
  }

  remove = (e) => {
    let div = e.target.parentElement;
    div.parentNode.removeChild(div);
  }

  render() {
    const { type, text } = this.props;
    const { icon, color } = this.styles[type];
    return (
      <div className={'alert card-panel white ' + color + '-text'}>
        <i className="material-icons left">{icon}</i>
         {text}
        <button className={'btn-flat waves-effect waves-' + color + ' float-right ' + color + '-text'} onClick={this.remove}>OK</button>
      </div>
    );
  }
}
