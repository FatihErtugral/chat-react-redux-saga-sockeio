import io from 'socket.io-client';
import { eventChannel } from 'redux-saga';
import { call, put, take, fork, delay } from 'redux-saga/effects';
import { IChatState, IMessageDetail } from './Chat/ChatMain.type';
import {
  MESSAGE_SAGA_WATCH,
  SET_NICK_SAGA_WATCH,
  JOIN_ROOM_SAGA_WATCH,
  LEAVE_ROOM_SAGA_WATCH,
  MESSAGE_SAGA_EVENT,
  LEAVED_ROOM_SAGA_EVENT,
  SET_NICK_SAGA_EVENT,
  ROOM_USER_LIST_SAGA_EVENT,
  PING_SAGA_WATCH,
  CONNECT_SAGA_PUT,
  RECONNECTING,
  RECONNECT
} from './Chat/constants';

const socketServerURL = '192.168.1.4:3005';

function connect() {
  const socket = io(socketServerURL, {
    reconnection: false,
    // reconnectionDelay: 3000,
    // reconnectionDelayMax: 5000,
    // reconnectionAttempts: 5
  });

  return new Promise((resolve, reject) => {
    socket.on('connect', () => resolve({ socket }));
    socket.on('connect_error', () => reject(new Error('ws:connect_failed ')));
  }).catch(error => ({ socket, error }));
}

function createSocketChannel(socket: SocketIOClient.Socket) {
  return eventChannel(result => {
    const newNickHandler = async (props: IChatState) => {
      const { nick, nickWarning } = props;
      let isNickUnique = false;
      result({
        type: SET_NICK_SAGA_EVENT,
        payload: { nick, isNickUnique, nickWarning }
      });
    };

    // const joinChannelHandler = async ({ roomList: thisChannel }: IChatState) => {
    //   // console.log('EVENT SAGA','joinChannelHandler: ', thisChannel);
    //   result({
    //     type: JOIN_ROOM_SAGA_EVENT,
    //     payload: { id: socket.id, thisChannel }
    //   });
    // };

    const leaveChannelHandler = async (roomName: string) => {
      // console.log('EVENT SAGA','leaveChannelHandler: ', thisChannel)
      result({
        type: LEAVED_ROOM_SAGA_EVENT,
        payload: roomName
      });
    };

    const messageHandler = (data: IMessageDetail) => {
      // console.log('EVENT SAGA','messageHandler', data);
      result({
        type: MESSAGE_SAGA_EVENT,
        payload: data
      });
    };

    const roomUserListHandler = (data: {}) => {
      //console.log('EVENT SAGA', 'roomUserListHandler', data);
      result({
        type: ROOM_USER_LIST_SAGA_EVENT,
        payload: data
      });
    };

    const pingHandler = (ping: number) => {
      result({
        type: PING_SAGA_WATCH,
        payload: ping
      })
    }

    const reconnectHandler = (ping: number) => {
      result({
        type: RECONNECT,
        payload: ping
      })
    }

    const reconnectingHandler = (ping: number) => {
      result({
        type: RECONNECTING,
        payload: ping
      })
    }

    socket.on('new_nick', newNickHandler);
    socket.on('leave_room', leaveChannelHandler);
    socket.on('message', messageHandler);
    socket.on('room_user_list', roomUserListHandler);
    socket.on('pong', pingHandler);

    socket.on('disconnect', () => {
      result({
        type: CONNECT_SAGA_PUT,
        payload: 'Disconnected'
      });
    });
    socket.on('reconnect', reconnectHandler);
    socket.on('reconnecting', reconnectingHandler);

    // socket.on('reconnect_attempt', () => console.log('reconnect_attempt'));
    // socket.on('reconnect_failed', () => console.log('reconnect_failed'));
    // socket.on('connect_error', () => console.log('connect_error'));
    // socket.on('connect_timeout', () => console.log('connect_timeout'));

    const unsubscribe = () => {
      socket.off('new_nick', newNickHandler);
      socket.off('leave_room', leaveChannelHandler);
      socket.off('message', messageHandler);
      socket.off('room_user_list', roomUserListHandler);
      socket.off('pong', pingHandler);

      socket.off('reconnect');
      socket.off('reconnecting');
      socket.off('connect_error');

    };
    return unsubscribe;
  });
}

function* watchLeaveRoom(socket: SocketIOClient.Socket) {
  while (true) {
    const { payload } = yield take(LEAVE_ROOM_SAGA_WATCH);
    socket.emit('leave_room', payload);
    // console.log('WATCH SAGA', 'leave_room', payload);
  }
}

function* watchJoinRoom(socket: SocketIOClient.Socket) {
  while (true) {
    const { payload } = yield take(JOIN_ROOM_SAGA_WATCH);
    socket.emit('join_room', payload);
    // console.log('WATCH SAGA', 'join_room', payload);
  }
}

function* watchNewNick(socket: SocketIOClient.Socket) {
  while (true) {
    const { payload } = yield take(SET_NICK_SAGA_WATCH);
    socket.emit('new_nick', payload);
    // console.log('WATCH SAGA', 'newNick', payload);
  }
}

function* watchMessage(socket: SocketIOClient.Socket) {
  while (true) {
    const { payload } = yield take(MESSAGE_SAGA_WATCH);
    socket.emit('message', payload);
    // console.log('WATCH SAGA', 'message', payload);
  }
}

function* watchPong(socket: SocketIOClient.Socket) {
  yield delay(1000);
  yield socket.emit('ping');
}


// Deneme Aşamasındaki Kısımlar
//*************************************************************** */
// function* watchReconneting() {
//   while (true) {
//     yield take(RECONNECTING);
//     console.log('SAGA WATCH', 'watchReconneting');
//   }
// }

// function* watchReconnet():any {
//   while (true) {
//     yield take(RECONNECT);
//   }
// }
//*************************************************************** */



function* watchTask(socket: SocketIOClient.Socket) {
  yield fork(watchLeaveRoom, socket);
  yield fork(watchJoinRoom, socket);
  yield fork(watchNewNick, socket);
  yield fork(watchMessage, socket);
  yield fork(watchPong, socket);
  // yield fork(watchReconneting);
  // yield fork(watchReconnet);
}

function* putAction(socket: SocketIOClient.Socket) {
  const event = yield call(createSocketChannel, socket);
  while (true) {
    let action = yield take(event);
    // console.log('flow action: ', action);
    yield put(action);
  }
}

function* task(socket: SocketIOClient.Socket) {
  yield fork(putAction, socket);
  yield fork(watchTask, socket);
}

export function* socketRootSaga() {
  const { socket, error } = yield call(connect);

  if (!error) {
    yield put({ type: CONNECT_SAGA_PUT, payload: 'Connected' })
    yield fork(task, socket);

  }
  else {
    console.log('Sucunuya erişlemiyor.');
    put({ type: CONNECT_SAGA_PUT, payload: 'Disconnected' })
  }
}
