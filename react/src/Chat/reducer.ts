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
  CONNECT_SAGA_PUT,
  VISIBLE_LIST
} from './constants';

const initStateChatSystem: IChatState = {
  id: '',
  nick: '',
  ping: 0,
  listOfUsersInRoom: {},
  isNickUnique: false,
  userList: [],
  nickWarning: '',
  rooms: {},
  activeRoom: '',
  connect: 'Disconnected',
  visibleList: false
};

export function ChatSystemReducer(
  state: IChatState = initStateChatSystem,
  action: IChatActionTypes
): IChatState {
  //console.log('ChatSystemReducer', state, action);
  const newState = Object.assign({}, state);
  switch (action.type) {

    case VISIBLE_LIST:
      newState.visibleList = !newState.visibleList
      return newState;

    case PING_SAGA_WATCH:
      newState.ping = action.payload
      return newState;

    case CONNECT_SAGA_PUT:
      newState.connect = action.payload;
      return newState;

    case SET_NICK_SAGA_EVENT:
    case JOIN_ROOM_SAGA_EVENT:
      return Object.assign({}, state, action.payload);

    case LEAVED_ROOM_SAGA_EVENT: {
      const room = action.payload;
      delete  newState.listOfUsersInRoom[room];
      newState.activeRoom = Object.keys(newState.listOfUsersInRoom)[0];
      return { ...newState };
    }

    case SELECT_ROOM:{
      newState.activeRoom = action.payload;
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

      rooms[roomName].message += `<p><a><strong style="color:rgb(78, 201, 176)
      ; ">${nick}:</strong></a> ${message}</p>`;

      if (rooms[roomName].message.length > maxString) {
        rooms[roomName].message = rooms[roomName].message.substr(
          rooms[roomName].message.length - maxString
        );
      }

      return Object.assign({}, state, {
        rooms: Object.assign({}, state.rooms, rooms)
      });
    }

    case ROOM_USER_LIST_SAGA_EVENT:{
      newState.listOfUsersInRoom = Object.assign({}, state.listOfUsersInRoom, action.payload);

      // sort object room
      let oldListtarr = Object.keys(newState.listOfUsersInRoom).sort();
      let oldListObj = newState.listOfUsersInRoom;
      newState.listOfUsersInRoom = {};
      for (let i = 0; i < oldListtarr.length; i++)
        newState.listOfUsersInRoom[oldListtarr[i]] = oldListObj[oldListtarr[i]];

      // select first room
      if (newState.activeRoom === '')
      newState.activeRoom= Object.keys(action.payload)[0];
      return newState;
    }

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

export interface IStore {
  chatMain: IChatState;
  chatInput: IChatInputState;
}

export const chatReducer = combineReducers<IStore>({
  chatMain: ChatSystemReducer,
  chatInput: ChatInputReducer
});
