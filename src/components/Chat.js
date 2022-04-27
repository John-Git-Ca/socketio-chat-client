import React, { useEffect, useState } from 'react';
import {
  Button,
  Row,
  Col,
  ListGroupItem,
  FormControl,
  Container,
} from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import './Chat.css';
import Message from './Message';
import ScrollToBottom from 'react-scroll-to-bottom';
import io from 'socket.io-client';
import Picker from 'emoji-picker-react';
import { Smile } from 'react-feather';

const ENDPOINT = 'http://localhost:5000/';
// const ENDPOINT = 'https://john-socketio-chat-server.herokuapp.com/';
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
        // alert(error);
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
    <Container>
      <Row
        className="justify-content-center pt-4"
        onClick={(e) => toggleEmojiPicker(e)}
      >
        <Col xs={11} sm={11} md={8} xl={6} className="chatarea p-0">
          <Row className="infobar">
            <Col className="d-flex align-items-center justify-content-start p-0">
              <Link to="/">
                <Button variant="">
                  <strong>Exit</strong>
                </Button>
              </Link>
            </Col>
            <Col className="d-flex align-items-center justify-content-center p-0">
              <Button variant="" disabled>
                {room}
              </Button>
            </Col>
            <Col className="d-flex align-items-center justify-content-end p-0">
              <Button variant="">
                <strong>Users</strong>
              </Button>
            </Col>
          </Row>
          <ScrollToBottom className="messages">
            {messages.map((msg, index) => (
              <Message key={index} msg={msg} name={name} />
            ))}
          </ScrollToBottom>
          <Row className="edit m-0 my-1">
            <Col className="h-100 p-0">
              <FormControl
                className="h-100 p-0 text-start"
                type="text"
                id="text1"
                value={editMessage}
                onChange={(e) => setEditMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(e)}
              ></FormControl>
            </Col>
          </Row>
          <Row className="m-0 d-flex justify-content-between">
            <Col xs={1} sm={1} className="h-100 emojipicker p-0">
              <Button variant="" className="w-100 h-100" id="btn">
                <Smile id="btn2" />
              </Button>
            </Col>
            <Col xs={2} sm={2} className="h-100 p-0">
              <Button
                id="text2"
                variant=""
                className="sendbtn"
                onClick={handleSendMessage}
              >
                <strong>Send</strong>
              </Button>
            </Col>
          </Row>
          {showEmojiPicker && (
            <div className="emojimart">
              <Picker id="btn3" onEmojiClick={onEmojiClick} />
            </div>
          )}
        </Col>
        {/* <div>
          <ListGroupItem>
            <strong>User List</strong>
          </ListGroupItem>
          {users &&
            users.map((user, index) => (
              <ListGroupItem key={index}>--{user.name}</ListGroupItem>
            ))}
        </div> */}
      </Row>
    </Container>
  );
};

export default Chat;
