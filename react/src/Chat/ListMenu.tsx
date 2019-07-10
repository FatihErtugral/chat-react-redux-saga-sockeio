import React from 'react';


export function ListMenu(props: any) {
  const { listOfUsersInRoom, activeRoom, selectChannel, visible } = props;

  return (
    <div id="chat-area-left" className={visible ? 'toggle': ''}>

      <div id="room-list">
        <div
          className='room-list-header'
          role="toolbar"
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
          {listOfUsersInRoom && listOfUsersInRoom[activeRoom] &&
            listOfUsersInRoom[activeRoom].map((x: any) =>
              <li className="user-list-element" key={x}>{x}</li>)
          }
        </ul>
      </div>
    </div>
  );
};
