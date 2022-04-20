import React, { useEffect, useState } from 'react';
import { Button, Row, Col, ListGroupItem } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import './Chat.css';
import Message from './Message';
import ScrollToBottom from 'react-scroll-to-bottom';
import io from 'socket.io-client';
import Picker from 'emoji-picker-react';
import { Smile } from 'react-feather';
import EmojiPicker from 'emoji-picker-react';

const ENDPOINT = 'https://john-socketio-chat-server.herokuapp.com/';
let socket;

const Chat = () => {
  const { name, room } = useParams();
  const [users, setUsers] = useState([]);
  const [editMessage, setEditMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('join', { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    });

    // return () => {
    //   socket.emit('disconnect');

    //   socket.off();
    // };
  }, [name, room]);

  useEffect(() => {
    socket.on('message', (msg) => {
      setMessages((messages) => [...messages, msg]);
    });
    socket.on('roomData', ({ users }) => {
      setUsers(users);
    });
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (editMessage) {
      socket.emit('sendMessage', editMessage, () => setEditMessage(''));
    }
  };

  const onEmojiClick = (e, emojiObejct) => {
    console.log(e);
    console.log(emojiObejct);
    setEditMessage(`${editMessage}${emojiObejct.emoji}`);
  };

  const toggleEmojiPicker = (e) => {
    if (
      e.target.id === 'btn' ||
      e.target.id === 'btn2' ||
      e.target.id === 'btn3'
    ) {
      setShowEmojiPicker(!showEmojiPicker);
    } else if (e.target.id === 'text1' || e.target.id === 'text2') {
      setShowEmojiPicker(false);
    }
  };

  return (
    <>
      <Row
        className="justify-content-center pt-4 m-0"
        onClick={(e) => toggleEmojiPicker(e)}
      >
        <Col xs={11} sm={11} md={8} xl={6} className="chatarea">
          <Row xs={8} sm={6} className="border infobar">
            <span className="text-center">Room: {room}</span>
            <span className="text-center">
              <Link to="/">
                <Button variant="info">X</Button>
              </Link>
            </span>
          </Row>
          <ScrollToBottom className="messages">
            {messages.map((msg, index) => (
              <Message key={index} msg={msg} name={name} />
            ))}
          </ScrollToBottom>
          <Row className="edit">
            <Col xs={1} sm={1} className="p-0 h-100 emojipicker">
              <Button variant="" className="w-100 h-100" id="btn">
                <Smile id="btn2" />
              </Button>
            </Col>
            <Col className="p-0 h-100">
              <textarea
                className="text"
                id="text1"
                value={editMessage}
                onChange={(e) => setEditMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(e)}
              ></textarea>
            </Col>
            <Col xs={2} sm={2} className="p-0 h-100">
              <Button
                id="text2"
                variant="info"
                className="sendbtn"
                onClick={handleSendMessage}
              >
                Send
              </Button>
            </Col>
          </Row>
          <Col className="emojimart">
            {showEmojiPicker && (
              <Picker id="btn3" onEmojiClick={onEmojiClick} />
            )}
          </Col>
        </Col>
        <Col xs={12} sm={3} md={2}>
          <ListGroupItem>
            <strong>User List</strong>
          </ListGroupItem>
          {users &&
            users.map((user, index) => (
              <ListGroupItem key={index}>--{user.name}</ListGroupItem>
            ))}
        </Col>
      </Row>
    </>
  );
};

export default Chat;
