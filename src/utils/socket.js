import React from 'react'
import io from 'socket.io-client';
import { withCurrentUserHOC } from './currentUser'

const host = window.location.host;
const socket = io(host);
const SocketContext = React.createContext();

class _SocketProvider extends React.Component {

  componentWillMount() {
    socket.emit('join', {id: this.props.currentUser.id});
  }

  render() {
    return (
      <SocketContext.Provider value={socket}>
        {this.props.children}
      </SocketContext.Provider>
    )
  }
}

export const SocketProvider = withCurrentUserHOC(_SocketProvider);

export const withSocketHOC = (Component) => {
  class HOC extends React.Component {
    render() {
      return <Component {...this.props} socket={this.context} />
    }
  }
  HOC.contextType = SocketContext;
  return HOC;
}
