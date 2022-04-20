import React from 'react';
import './Message.css';

const Message = ({ msg: { user, text }, name }) => {
  let alignright = false;
  if (user === name.trim().toLowerCase()) {
    alignright = true;
  }
  return alignright ? (
    <div className={alignright ? 'msgbox justfiyend' : 'msgbox'}>
      <div className={alignright ? 'msg msg-end' : 'msg'}>{text}</div>
      <div className="user">&lt;{user} </div>
    </div>
  ) : (
    <div className={alignright ? 'msgbox justfiyend' : 'msgbox'}>
      <div className="user">{user} &gt; </div>
      <div className={alignright ? 'msg msg-end' : 'msg'}>{text}</div>
    </div>
  );
};

export default Message;
