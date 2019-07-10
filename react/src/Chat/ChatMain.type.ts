import { sendMessage, selectRoom, toggleList } from './action';

export interface IMessageDetail {
  roomName: string;
  nick: string;
  message: string;
}

export interface IChatState {
  id: string;
  nick: string;
  ping: number;
  listOfUsersInRoom: {
    [key: string]: [];
  };
  userList?: string[];
  isNickUnique: boolean;
  nickWarning?: string;
  rooms: {
    [roomName: string]: {
      message: string;
    };
  };
  activeRoom: string;
  visibleList: boolean;
  connect: 'Connected' | 'Disconnected';
}

export interface IChatDispatch {
  sendMessage: typeof sendMessage;
  selectRoom: typeof selectRoom;
  toggleList: typeof toggleList;
}
