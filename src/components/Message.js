import React from 'react';
import './Message.css';

const Message = ({ msg: { user, text }, name }) => {
  let alignright = false;
  if (user === name.trim().toLowerCase()) {
    alignright = true;
  }
  return user === 'admin' ? (
    <div>
      <div>{text}</div>
    </div>
  ) : alignright ? (
    <div className={'msgbox justfiyend'}>
      <div className={'msg msg-end'}>{text}</div>
    </div>
  ) : (
    <div className={'msgbox'}>
      <div className="user">{user.substring(0, 1)} </div>
      <div className={'msg msg-start'}>{text}</div>
    </div>
  );
};

export default Message;
