import React, { Component } from 'react';
import { connect } from 'react-redux';
import { sendMessage, selectRoom } from './action';
import { IChatState, IChatDispatch } from './ChatMain.type';
import SplitPane from 'react-split-pane';

import ChatInput from './ChatInput';
import TextBody from './ChatTextBody';

type IProps = IChatState & IChatDispatch;
const stylePane: React.CSSProperties = { overflowX: 'hidden', minHeight: '0' };

class ChatMain extends Component<IProps> {
  render() {
    const {
      ping,
      nick,
      id,
      connect,
      sendMessage,
      isNickUnique,
      nickWarning,
      rooms,
      focusRoom,
      selectRoom,
      channelList
    } = this.props;

    const selectChannel = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      let value = e.currentTarget.getAttribute('data-name') || '';
      selectRoom(value);
    };
    return (
      <div>

        <div className="statusbar">
          <span className="statusbar-item">Nick: {nick}</span>
          <span className="statusbar-item">id: {id}</span>
          <span className="statusbar-item" style={{float:"right"}}>
          {connect}&nbsp;&nbsp;&nbsp;
          <i className="ex-circle">

          {connect === 'Connected'
            ?<i style={{backgroundColor:'#1F813E'}} className="circle"></i>
            :<i style={{backgroundColor:'darkred'}} className="circle"></i>
          }
          </i>
          </span>
          <span className="statusbar-item" style={{float:"right"}}>Ping : {ping}ms</span>
          {isNickUnique ? '' : <>{nickWarning}</>}
        </div>
        <div
          style={{
            height: '92vh',
            margin: '10px',
            width: 'calc(100%-20px)',
            position: 'relative',
            border: '1px solid black',
            background: '#272727',
            color: 'white'
          }}
        >
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
                {channelList &&
                  Object.keys(channelList).map(key => (
                      <span
                        key={key}
                        className="room-list-element"
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
              <div style={{backgroundColor:'white' ,height: '100%',width:'100%', position:'relative'}}>
                <TextBody
                  text={
                    (rooms && rooms[focusRoom] && rooms[focusRoom].message) ||
                    ''
                  }
                />
                <ChatInput
                  selectRoom={selectRoom}
                  sendMessage={sendMessage}
                  focusRoom={focusRoom}
                  nick={nick}
                />
              </div>
              <div>
                {channelList[focusRoom] &&
                  channelList[focusRoom].map(x => <li key={x}>{x}</li>)}
              </div>
            </SplitPane>
          </SplitPane>
        </div>
      </div>
    );
  }
}

const mapStoreToProps = ({ chat }: any): IChatState => {
  const {
    connect,
    isNickUnique,
    nickWarning,
    nick,
    id,
    rooms,
    focusRoom,
    ping,
    userList,
    channelList
  } = chat;
  return {
    connect,
    isNickUnique,
    nickWarning,
    nick,
    id,
    rooms,
    focusRoom,
    ping,
    userList,
    channelList
  };
};

export default connect(
  mapStoreToProps,
  { sendMessage, selectRoom }
)(ChatMain);
