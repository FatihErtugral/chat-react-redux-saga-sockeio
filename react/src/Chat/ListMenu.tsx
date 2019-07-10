import React from 'react';
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function ListMenu(props: any) {
  const { listOfUsersInRoom, activeRoom, selectChannel, visible } = props;

  return (
    <div id="chat-area-left" className={visible ? 'toggle' : ''}>

      <div id="room-list">
        <div
          className='room-list-header'
          role="toolbar"
        >
          <FontAwesomeIcon icon={faCaretDown}/>
          <h5 className="title" title="Oda Listesi">ODA LİSTESİ</h5>
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
          <FontAwesomeIcon icon={faCaretRight} />
          <h5 className="title" title="Kişi Listesi">Kişi Listesi</h5>
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
