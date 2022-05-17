import React, { useEffect, useState, useRef } from 'react';
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
import {
  BiWinkSmile,
  BiExit,
  BiUser,
  BiArrowBack,
  BiSend,
  BiVideo,
} from 'react-icons/bi';
import Peer from 'simple-peer';
import './notification.css';

// const ENDPOINT = 'http://localhost:5000/';
const ENDPOINT = 'https://john-socketio-chat-server.herokuapp.com/';
let socket;

const Chat = () => {
  const [me, setMe] = useState('');
  const { name, room } = useParams();
  const [users, setUsers] = useState([]);
  const [editMessage, setEditMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showUsers, setShowUsers] = useState(false);

  const [stream, setStream] = useState();
  const [call, setCall] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        console.log(currentStream);
        myVideo.current.srcObject = currentStream;
      })
      .catch((err) => {
        console.log('err:' + err);
      });

    socket = io(ENDPOINT);
    socket.on('me', (id) => {
      setMe(id);
    });
    socket.emit('join', { name, room }, (error) => {
      if (error) {
        // alert(error);
      }
    });

    socket.on('callUser', ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
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

  const VideoCall = (userId) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('callUser', {
        userToCall: userId,
        signalData: data,
        from: me,
        name,
      });
    });

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
      console.log('call accepted');
    });

    connectionRef.current = peer;

    console.log(peer);
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({ initiator: false, trickle: false, stream });
    console.log('answering call');
    peer.on('signal', (data) => {
      console.log('answering call');
      socket.emit('answerCall', { signal: data, to: call.from });
    });

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

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
                  <BiExit size={20} />
                </Button>
              </Link>
            </Col>
            <Col className="d-flex align-items-center justify-content-center p-0">
              <Button variant="" disabled>
                {room}
              </Button>
            </Col>
            <Col className="d-flex align-items-center justify-content-end p-0">
              <Button variant="" onClick={() => setShowUsers(!showUsers)}>
                {showUsers ? <BiArrowBack size={20} /> : <BiUser size={20} />}
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
          <Row className="m-0 d-flex justify-content-end">
            <Col xs={1} sm={1} className="h-100 emojipicker p-0">
              <Button variant="" className="w-100 h-100" id="btn">
                <BiWinkSmile id="btn2" size={25} />
              </Button>
            </Col>
            <Col xs={2} sm={2} className="h-100 p-0">
              <Button
                variant=""
                className="sendbtn"
                onClick={() => setShowUsers(true)}
              >
                <BiVideo id="text2" size={30} />
              </Button>
            </Col>
            <Col xs={2} sm={2} className="h-100 p-0">
              <Button
                variant=""
                className="sendbtn"
                onClick={handleSendMessage}
              >
                <BiSend id="text2" size={30} />
              </Button>
            </Col>
          </Row>
          {call && call.isReceivingCall && !callAccepted && (
            <div className="notification row justify-content-around">
              <div className="col-12 fs-6 name">
                Video Call from: {call.name}
              </div>
              <div className="col-3 btn accept" onClick={answerCall}>
                Accept
              </div>
              <div className="col-3 btn reject">Reject</div>
            </div>
          )}
          {showEmojiPicker && (
            <div className="emojimart">
              <Picker id="btn3" onEmojiClick={onEmojiClick} />
            </div>
          )}
          {showUsers && (
            <div className="users rounded">
              {users &&
                users.map((user, index) => (
                  <ListGroupItem key={index}>
                    <div className="row">
                      <div className="col">{user.name}</div>

                      <BiVideo
                        className="col btn m-0 p-0"
                        id="text2"
                        onClick={() => VideoCall(user.id)}
                        size={20}
                      />
                    </div>
                  </ListGroupItem>
                ))}
            </div>
          )}
          {stream && <video playsInline autoPlay muted ref={myVideo}></video>}
          {callAccepted && !callEnded && (
            <video playsInline autoPlay ref={userVideo}></video>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Chat;
