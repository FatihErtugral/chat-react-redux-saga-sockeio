import React from 'react';
import { connect } from 'react-redux';
import { sendMessage, selectRoom, toggleList } from './action';
import { IChatState, IChatDispatch } from './ChatMain.type';

import ChatInput from './ChatInput';
import ChatTextBody from './ChatTextBody';
import { IStore } from './reducer';
import StatusBar from './StatusBar';
import { ListMenu } from './ListMenu';

type IProps = IChatState & IChatDispatch;

function ChatMain(props: IProps) {
  const {
    ping,
    nick,
    connect,
    sendMessage,
    isNickUnique,
    nickWarning,
    rooms,
    activeRoom,
    selectRoom,
    listOfUsersInRoom,
    visibleList,
    toggleList
  } = props;

  const selectChannel = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    let value = e.currentTarget.getAttribute('data-name') || '';
    selectRoom(value);
  };
  return (
    <main >
      <div id="chat-area-container">
        <ListMenu
          visible = {visibleList}
          listOfUsersInRoom={listOfUsersInRoom}
          activeRoom={activeRoom}
          selectChannel={selectChannel}
        />
        <div id="chat-area-mid">
          <ChatTextBody
            text={
              (rooms && rooms[activeRoom] && rooms[activeRoom].message)
              || ''
            }
          />
          <ChatInput
            selectRoom={selectRoom}
            sendMessage={sendMessage}
            activeRoom={activeRoom}
            nick={nick}
          />
        </div>
      </div>
      <StatusBar
        toggleList={toggleList}
        connect={connect}
        nick={nick}
        ping={ping}
        nickWarning={nickWarning}
        isNickUnique={isNickUnique}
      />
    </main>
  );
}

const mapStoreToProps = ({ chatMain }: IStore): IChatState => ({ ...chatMain });

export default connect(
  mapStoreToProps,
  { sendMessage, selectRoom ,toggleList}
)(ChatMain);
