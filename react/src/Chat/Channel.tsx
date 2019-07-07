import React from 'react';

interface IProps {
  channelName: string;
  userList?: string[];
  message?: any;
}

interface IDispatchProps {}

type Props = IProps & IDispatchProps;

function Channel({ channelName, userList, message }: Props) {
  return (
    <div>
      Channel Name: {channelName}
      <br />
      <div>
        <h3>User List</h3>
        <ul>{userList && userList.map((u, i) => <li key={i}>{u}</li>)}</ul>
      </div>
      <div>
        <h3>Chat Message</h3>
        {message}
      </div>
    </div>
  );
}

export default Channel;
