import { Action } from 'redux';
import {
  JOIN_ROOM_SAGA_WATCH,
  JOIN_ROOM_SAGA_EVENT,
  LEAVE_ROOM_SAGA_WATCH,
  LEAVED_ROOM_SAGA_EVENT,
  SET_NICK_SAGA_EVENT,
  SET_NICK_SAGA_WATCH,
  MESSAGE_SAGA_EVENT,
  MESSAGE_SAGA_WATCH,
  SELECT_ROOM,
  ROOM_USER_LIST_SAGA_EVENT,
  PING_SAGA_WATCH,
  CONNECT_SAGA_PUT
} from './constants';
import { IMessageDetail } from './ChatMain.type';

interface IJoinRoomAction extends Action {
  type: typeof JOIN_ROOM_SAGA_WATCH | typeof JOIN_ROOM_SAGA_EVENT;
  payload: string;
}

interface ILeaveRoomAction extends Action {
type: typeof LEAVE_ROOM_SAGA_WATCH | typeof LEAVED_ROOM_SAGA_EVENT;
payload: string;
}


interface INewNickAction extends Action {
  type: typeof SET_NICK_SAGA_WATCH | typeof SET_NICK_SAGA_EVENT;
  payload: string;
}

interface ISelectRoomAction extends Action {
  type: typeof SELECT_ROOM;
  payload: string;
}

interface IMessageAction extends Action {
  type: typeof MESSAGE_SAGA_EVENT | typeof MESSAGE_SAGA_WATCH;
  payload: IMessageDetail;
}

interface IRoomUserListAction extends Action {
  type: typeof ROOM_USER_LIST_SAGA_EVENT;
  payload: {};
}

interface IPingAction extends Action {
  type: typeof PING_SAGA_WATCH;
  payload: number;
}

interface IConnect extends Action {
  type: typeof CONNECT_SAGA_PUT;
  payload: 'Connected' | 'Disconnected';
}


export type IChatActionTypes =
  | IJoinRoomAction
  | ILeaveRoomAction
  | INewNickAction
  | IMessageAction
  | IRoomUserListAction
  | INewNickAction
  | ISelectRoomAction
  | IPingAction
  | IConnect;
export type IChatInputActionTypes = Action;
