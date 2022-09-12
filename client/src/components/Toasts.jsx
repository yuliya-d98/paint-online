import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useState } from 'react';
import Toast from 'react-bootstrap/Toast';
import canvasState from '../store/canvasState';
import ToastContainer from 'react-bootstrap/ToastContainer';

const Toasts = observer(() => {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    if (toJS(canvasState.info).length) {
      const newInfo = toJS(canvasState.info);
      setInfo((info) => newInfo);
    }
  }, [canvasState.info])

  return (
    <ToastContainer className="p-3" position='bottom-start'>
      {info && info.map(item => <ToastItem info={item} key={item.body} />)}
    </ToastContainer>
  )
})

export default Toasts;

const ToastItem = ({ info }) => {
  const { title, body } = info;
  const [show, setShow] = useState(true);

  const closeToast = () => {
    setShow(false);
    canvasState.removeInfo(body);
  }

  return (
    <Toast onClose={() => closeToast()} show={show} delay={3000} autohide>
      <Toast.Header>
        <img
          src="holder.js/20x20?text=%20"
          className="rounded me-2"
          alt=""
        />
        <strong className="me-auto">{title}</strong>
      </Toast.Header>
      <Toast.Body>{body}</Toast.Body>
    </Toast>
  )
};
