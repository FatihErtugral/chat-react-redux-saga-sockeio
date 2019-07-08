import React, { Component } from 'react';
import { connect } from 'react-redux';
import { sendMessage, selectRoom } from './action';
import { IChatState, IChatDispatch } from './ChatMain.type';
import SplitPane from 'react-split-pane';

import ChatInput from './ChatInput';
import TextBody from './ChatTextBody';
import { IStore } from './reducer';
import StatusBar from './StatusBar';

type IProps = IChatState & IChatDispatch;
const stylePane: React.CSSProperties = { overflowX: 'hidden', minHeight: '0' };

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

    const selectChannel = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      let value = e.currentTarget.getAttribute('data-name') || '';
      selectRoom(value);
    };
    return (
      <main >

        <div className="chat-main-layer">
          <SplitPane
            split="vertical"
            minSize={12}
            maxSize={200}
            paneStyle={stylePane}
            className='test'
            defaultSize={120}
            primary="first"
          >
            <div className='room-list'>
              <div
                className='room-list-header'
                role="toolbar"
                aria-label="Dosya Gezgini Bölümü"
                aria-expanded="true"
                draggable={true}
              >
                <h5 className="title" title="ODA LİSTESİ">ODA LİSTESİ</h5>
              </div>
              <div className='room-list-body'>
                {listOfUsersInRoom &&
                  Object.keys(listOfUsersInRoom).map(key => (
                      <span
                        key={key}
                        className={`room-list-element ${activeRoom === key ? 'active': ''}`}
                        data-name={key}
                        onClick={selectChannel}
                      >
                        {key}
                      </span>
                  ))
                }
              </div>
            </div>
            <SplitPane
              split="vertical"
              minSize={12}
              maxSize={200}
              paneStyle={stylePane}
              defaultSize={120}
              primary="second"
            >
              <div>
                <TextBody
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
              <div>
                {listOfUsersInRoom[activeRoom] &&
                  listOfUsersInRoom[activeRoom].map(x => <li key={x}>{x}</li>)}
              </div>
            </SplitPane>
          </SplitPane>
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

const mapStoreToProps = ({chatMain}:IStore):IChatState => ({...chatMain});

export default connect(
  mapStoreToProps,
  { sendMessage, selectRoom }
)(ChatMain);
