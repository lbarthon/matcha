import React from 'react'
import io from 'socket.io-client';

const socket = io('http://localhost:3000');
const SocketContext = React.createContext();

export class SocketProvider extends React.Component {
  render() {
    return (
      <SocketContext.Provider value={socket}>
        {this.props.children}
      </SocketContext.Provider>
    )
  }
}

export const withSocketHOC = (Component) => {
  class HOC extends React.Component {
    render() {
      return <Component {...this.props} socket={this.context} />
    }
  }
  HOC.contextType = SocketContext;
  return HOC;
}
