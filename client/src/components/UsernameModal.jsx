import { useRef, useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';
import canvasState from "../store/canvasState";

const UsernameModal = () => {
  const validationMessage = 'Your name should contain from 1 to 20 letters or numbers';
  const usernameRef = useRef();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [username, setUsername] = useState('');
  const [error, setError] = useState(validationMessage);
  const [touched, setTouched] = useState(false);

  const changeUsername = (e) => {
    const current = e.target.value;
    setUsername(current);
    if (!touched) {
      setTouched(true);
    }
    if (usernameRef.current.checkValidity()) {
      setError(null);
    } else {
      setError(validationMessage);
    }
  }

  const connectHandler = () => {
    if (!error) {
      canvasState.setUsername(username);
      setIsModalOpen(false);
    }
  }

  return (
    <Modal show={isModalOpen} onHide={connectHandler}>
      <Form noValidate >
        <Modal.Header closeButton>
          <Modal.Title>Welcome to Paint Online!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label>Write your username</Form.Label>
          <InputGroup hasValidation className="mb-3">
            <InputGroup.Text>@</InputGroup.Text>
            <Form.Control
              autoFocus
              value={username}
              onInput={changeUsername}
              minLength={1}
              maxLength={20}
              placeholder='username'
              ref={usernameRef}
              required
              isInvalid={error && touched}
            />
            <Form.Control.Feedback type="invalid" tooltip>
              {error}
            </Form.Control.Feedback>
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={connectHandler} disabled={error} >
            Enter
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default UsernameModal;