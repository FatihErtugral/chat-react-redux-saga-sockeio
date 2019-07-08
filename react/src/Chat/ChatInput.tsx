import React from 'react';
import { connect } from 'react-redux';
import { joinChannel, leaveRoom, newNick } from './action';
import {
  IChatInputState,
  IChatInputDispatch,
  IChatInputOwnProps
} from './ChatInput.type';
import { IMessageDetail } from './ChatMain.type';
import { IStore } from './reducer';

type IProps = IChatInputState & IChatInputDispatch & IChatInputOwnProps;

function ChatInput(props: IProps) {
  const {
    activeRoom,
    joinChannel,
    leaveChannel,
    selectRoom,
    newNick,
    sendMessage,
    nick
  } = props;
  const commandPattern = ['/nick ', '/q ', '/j ', '/clear'];
  const regex = new RegExp(/^[a-zA-Z0-9şçöğüıŞÇÖĞÜİ]+$/);

  const onEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.stopPropagation();
      const value = e.currentTarget.value.replace('\n', '');
      e.currentTarget.value = '';
      e.currentTarget.defaultValue = '';

      let str = '';
      let command = '';
      let cntrl = false;

      for (let i = 0; i < commandPattern.length; i++) {
        if (value.startsWith(commandPattern[i], 0)) {
          str = value.slice(commandPattern[i].length);
          command = commandPattern[i];
          cntrl = regex.test(str);
          break;
        }
      }

      if (cntrl && command !== '') {
        switch (command) {
          case '/nick ':
            newNick(str);
            return;
          case '/j ':
            joinChannel(str);
            selectRoom(str);
            return;
          case '/q ':
            leaveChannel(str);
            return;
          case '/clear':
            // TODO daha fazla komut eklenebilir...
            return;
        }
      }

      let messageData: IMessageDetail = {
        roomName: activeRoom,
        nick: nick,
        message: value
      };
      sendMessage(messageData);
      return;
    }
  };

  return (
    <input
      name="chat-text-input"
      onKeyDown={onEnterKey}
      id="chat-text-input"
    />
  );
}

const mapStoreToProps = ({ chatInput }: IStore, ownProps: IChatInputOwnProps):IChatInputOwnProps => ({ ...ownProps });

export default connect(
  mapStoreToProps,
  { joinChannel, leaveChannel: leaveRoom, newNick }
)(ChatInput);
