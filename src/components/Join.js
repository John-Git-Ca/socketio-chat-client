import React, { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Join = () => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const handleSubmit = () => {
    // console.log(name);
    // console.log(room);
  };
  return (
    <Row
      className="justify-content-center align-items-center m-0"
      style={{ height: '100vh' }}
    >
      <Col xs={8} sm={6}>
        <h2 className="border-bottom text-center">Join Chat</h2>
        <Form className="">
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Room</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => setRoom(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Link
              onClick={(e) => (!name || !room ? e.preventDefault() : null)}
              to={`/chat/${name}/${room}`}
            >
              <Button className="m-2" onClick={handleSubmit}>
                Sign in
              </Button>
            </Link>
          </Form.Group>
        </Form>
      </Col>
    </Row>
  );
};

export default Join;
