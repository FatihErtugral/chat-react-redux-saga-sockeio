import { combineReducers } from 'redux';
import { IChatInputState } from './ChatInput.type';
import { IChatState } from './ChatMain.type';
import { IChatInputActionTypes, IChatActionTypes } from './action.types';
import {
  SET_NICK_SAGA_EVENT,
  JOIN_ROOM_SAGA_EVENT,
  LEAVED_ROOM_SAGA_EVENT,
  SELECT_ROOM,
  MESSAGE_SAGA_EVENT,
  ROOM_USER_LIST_SAGA_EVENT,
  PING_SAGA_WATCH,
  CONNECT_SAGA_PUT
} from './constants';

export const initStateChatSystem: IChatState = {
  id: '',
  nick: '',
  ping: 0,
  channelList: {},
  isNickUnique: false,
  userList: [],
  nickWarning: '',
  rooms: {},
  focusRoom: '',
  connect: 'Disconnected',
};

export function ChatSystemReducer(
  state: IChatState = initStateChatSystem,
  action: IChatActionTypes
): IChatState {
  //console.log('ChatSystemReducer', state, action);
  const newState = Object.assign({}, state);
  switch (action.type) {
    case PING_SAGA_WATCH:
      // return Object.assign({}, state, { ping: action.payload });
      newState.ping = action.payload
      return newState;

    case CONNECT_SAGA_PUT:
      console.log(action);
      // return Object.assign({}, state, { connect: action.payload })
      newState.connect = action.payload;
      return newState;

    case SET_NICK_SAGA_EVENT:
    case JOIN_ROOM_SAGA_EVENT:


      return Object.assign({}, state, action.payload);

    case LEAVED_ROOM_SAGA_EVENT:
      console.log(action.payload);
      const room = action.payload;
      let temp = state.channelList
      delete temp[room];
      return { ...state, ...{ channelList: { ...temp } } };

    case SELECT_ROOM:{
      newState.focusRoom = action.payload;
      // console.log('ACTION SELECT_ROOM', action.payload);
      return newState;
    }
    case MESSAGE_SAGA_EVENT: {
      const maxString = 10000;
      const { roomName, message, nick } = action.payload;
      let rooms: any = {};

      if (typeof state.rooms[roomName] === 'undefined')
        rooms[roomName] = { message: '' };
      else rooms[roomName] = state.rooms[roomName];

      rooms[roomName].message += `[${nick}]: ${message}\n`;

      if (rooms[roomName].message.length > maxString) {
        rooms[roomName].message = rooms[roomName].message.substr(
          rooms[roomName].message.length - maxString
        );
      }

      return Object.assign({}, state, {
        rooms: Object.assign({}, state.rooms, rooms)
      });
    }
    case ROOM_USER_LIST_SAGA_EVENT:

      newState.channelList = Object.assign({}, state.channelList, action.payload);

      // sort object room
      let oldListtarr = Object.keys(newState.channelList).sort();
      let oldListObj = newState.channelList;
      newState.channelList = {};
      for (let i = 0; i < oldListtarr.length; i++) {
        newState.channelList[oldListtarr[i]] = oldListObj[oldListtarr[i]];
      }

      // ilk kanalı foculuyor
      if (newState.focusRoom === '')
        newState.focusRoom= Object.keys(action.payload)[0];
      return newState;

    default:
      return state;
  }
}

export function ChatInputReducer(
  state: IChatInputState = {},
  action: IChatInputActionTypes
): IChatInputState {
  // console.log('ChatInputReducer', state, action);
  switch (action.type) {
    default:
      return state;
  }
}

interface ChatState {
  chat: IChatState;
  input: IChatInputState;
}

export const chatReducer = combineReducers<ChatState>({
  chat: ChatSystemReducer,
  input: ChatInputReducer
});
