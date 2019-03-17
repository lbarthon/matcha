import React from 'react';
import ReactDOM from 'react-dom';

export const alert = (type, text) => {
  let container = document.getElementById('alert-container');
  let div = document.createElement("div");
  container.appendChild(div);
  ReactDOM.render(
    <Alert text={text} type={type}/>
    , div
  );
  // After 5 secs, removes the alert if not yet removed.
  setTimeout(() => {
    if (div.innerHTML) fonduAndRemove(div);
  }, 5000);
}

export const cleanAlerts = () => {
  let container = document.getElementById('alert-container');
  while (container.hasChildNodes()) {
    container.removeChild(container.lastChild);
  }
}

export const AlertContainer = () => {
  return <div className="row"><div id="alert-container"></div></div>
}

const fonduAndRemove = elem => {
  const exec = elem => {
    let { style } = elem;
    style.opacity -= .01;
    if (style.opacity < 0) {
      if (elem && elem.parentNode) {
        elem.parentNode.removeChild(elem);
      }
    } else {
      setTimeout(() => exec(elem), 4);
    }
  }
  if (elem && elem.style) {
    elem.style.opacity = 1;
    exec(elem);
  }
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
    fonduAndRemove(div);
  }

  render() {
    const { type, text } = this.props;
    const { icon, color } = this.styles[type];
    return (
      <div className={'alert clearfix card-panel white ' + color + '-text'}>
        <i className="material-icons left">{icon}</i>
        <span>{text}</span>
        <button className={'btn-flat waves-effect waves-' + color + ' right ' + color + '-text'} onClick={this.remove}>OK</button>
      </div>
    );
  }
}
