import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const TooltipItem = ({ text, children }) => {
  return (
    <OverlayTrigger
      placement='bottom'
      overlay={
        <Tooltip id={`tooltip-${text}`}>
          {text}
        </Tooltip>
      }
    >
      {children}
    </OverlayTrigger>
  )
}

export default TooltipItem;