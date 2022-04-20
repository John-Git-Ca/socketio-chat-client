import React, { useEffect, useState } from 'react';
import { Button, Row, Col, ListGroupItem } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import './Chat.css';
import Message from './Message';
import ScrollToBottom from 'react-scroll-to-bottom';
import io from 'socket.io-client';

const ENDPOINT = 'https://john-socketio-chat-server.herokuapp.com/';
let socket;

const Chat = () => {
  const { name, room } = useParams();
  const [users, setUsers] = useState([]);
  const [editMessage, setEditMessage] = useState('');
  const [messages, setMessages] = useState([]);

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

  return (
    <>
      <Row className="justify-content-center pt-4 m-0">
        <Col xs={11} sm={11} md={8} xl={6} className="chatarea">
          <Row xs={8} sm={6} className="border infobar">
            <span className="text-center">Room: {room}</span>
            <span className="text-center">
              <Link to="/">
                <Button>X</Button>
              </Link>
            </span>
          </Row>
          <ScrollToBottom className="messages">
            {messages.map((msg, index) => (
              <Message key={index} msg={msg} name={name} />
            ))}
          </ScrollToBottom>
          <Row className="edit">
            <textarea
              className="text"
              value={editMessage}
              onChange={(e) => setEditMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(e)}
            ></textarea>
            <Button className="sendbtn" onClick={handleSendMessage}>
              Send
            </Button>
          </Row>
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
