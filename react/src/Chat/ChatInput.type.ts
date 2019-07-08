import {
  newNick,
  joinChannel,
  leaveRoom,
  sendMessage,
  selectRoom
} from './action';

export interface IChatInputDispatch {
  newNick: typeof newNick;
  joinChannel: typeof joinChannel;
  leaveChannel: typeof leaveRoom;
}

export interface IChatInputOwnProps {
  nick: string;
  activeRoom: string;
  sendMessage: typeof sendMessage;
  selectRoom: typeof selectRoom;
}

export interface IChatInputState {}
