import React from 'react'
import io from 'socket.io-client';
import { withCurrentUserHOC } from './currentUser'

const host = window.location.host;
let socket;
try {
  socket = io(host);
} catch(err) {
  console.log("Error connecting to socket!");
}

const SocketContext = React.createContext();

class _SocketProvider extends React.Component {

  componentWillMount() {
    if (this.props.currentUser.logged)
      socket.emit('join', {id: this.props.currentUser.id});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentUser.logged)
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
