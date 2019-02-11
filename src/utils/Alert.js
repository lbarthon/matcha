import React from 'react';
import ReactDOM from 'react-dom';

export const notify = (type, text) => {
  ReactDOM.render(
    <Alert text={text} type={type}/>
  , document.getElementById('alert-container'));
}

export const AlertContainer = () => {
  return <div id="alert-container"></div>
}

class Alert extends React.Component {

  style = {
    error: 'red white-text'
  }

  render() {
    const { type, text } = this.props
    return (
      <div className={'card-panel ' + this.style[type]}><i className="material-icons">error_outline</i> {text}</div>
    );
  }
}
