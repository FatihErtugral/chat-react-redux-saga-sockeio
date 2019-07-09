import React, { Component } from 'react';
import { connect } from 'react-redux';
import { sendMessage, selectRoom } from './action';
import { IChatState, IChatDispatch } from './ChatMain.type';

import ChatInput from './ChatInput';
import ChatTextBody from './ChatTextBody';
import { IStore } from './reducer';
import StatusBar from './StatusBar';

type IProps = IChatState & IChatDispatch;

class ChatMain extends Component<IProps> {
  render() {
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
      listOfUsersInRoom
    } = this.props;

    const selectChannel = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
      let value = e.currentTarget.getAttribute('data-name') || '';
      selectRoom(value);
    };
    return (
      <main >

        <div id="chat-area-container" className="chat-main-layer area-main">
          <div id="chat-area-left" className='room-list '>
            <div id="room-list">
              <div
                className='room-list-header'
                role="toolbar"
                aria-label="Dosya Gezgini Bölümü"
                aria-expanded="true"
                draggable={true}
              >
                <h5 className="title" title="ODA LİSTESİ">ODA LİSTESİ</h5>
              </div>
              <ul id='room-list-body'>
                {listOfUsersInRoom &&
                  Object.keys(listOfUsersInRoom).map(key => (
                    <li
                      key={key}
                      className={`room-list-element ${activeRoom === key ? 'active' : ''}`}
                      data-name={key}
                      onClick={selectChannel}
                    >
                      {key}
                    </li>
                  ))
                }
              </ul>



            </div>
            <div id="user-list">
              <div id="user-list-header">
              <h5>Kişi Listesi</h5>
              </div>
              <ul id="user-list-body">


                {listOfUsersInRoom[activeRoom] &&
                  listOfUsersInRoom[activeRoom].map(x =>
                    <li className="user-list-element" key={x}>{x}</li>)
                }
              </ul>
            </div>
          </div>
          <div id="chat-area-mid">
            <ChatTextBody
              text={
                (rooms && rooms[activeRoom] && rooms[activeRoom].message) ||
                ''
              }
            />
            <ChatInput
              selectRoom={selectRoom}
              sendMessage={sendMessage}
              activeRoom={activeRoom}
              nick={nick}
            />
          </div>
          <div id="chat-area-right" className="">
            <div id="user-list">
              <div id="user-list-header">
              <h5>Kişi Listesi</h5>
              </div>
              <ul id="user-list-body">


                {listOfUsersInRoom[activeRoom] &&
                  listOfUsersInRoom[activeRoom].map(x =>
                    <li className="user-list-element" key={x}>{x}</li>)
                }
              </ul>
            </div>
          </div>
        </div>
        <StatusBar
          connect={connect}
          nick={nick}
          ping={ping}
          nickWarning={nickWarning}
          isNickUnique={isNickUnique}
        />
      </main>
    );
  }
}

const mapStoreToProps = ({ chatMain }: IStore): IChatState => ({ ...chatMain });

export default connect(
  mapStoreToProps,
  { sendMessage, selectRoom }
)(ChatMain);
