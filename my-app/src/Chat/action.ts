import { IChatActionTypes } from './action.types';
import {
  SET_NICK_SAGA_WATCH,
  JOIN_ROOM_SAGA_WATCH,
  LEAVE_ROOM_SAGA_WATCH,
  SELECT_ROOM,
  MESSAGE_SAGA_WATCH
} from './constants';
import { IMessageDetail } from './ChatMain.type';

export function newNick(nick: string): IChatActionTypes {
  return {
    type: SET_NICK_SAGA_WATCH,
    payload: nick
  };
}

export function joinChannel(channel: string): IChatActionTypes {
  return {
    type: JOIN_ROOM_SAGA_WATCH,
    payload: channel
  };
}

export function leaveRoom(room: string): IChatActionTypes {
  return {
    type: LEAVE_ROOM_SAGA_WATCH,
    payload: room
  };
}

export function selectRoom(room: string): IChatActionTypes {
  return {
    type: SELECT_ROOM,
    payload: room
  };
}

export function sendMessage(message: IMessageDetail): IChatActionTypes {
  console.log('ACTION', 'sendMessage', message);
  return {
    type: MESSAGE_SAGA_WATCH,
    payload: message
  };
}
