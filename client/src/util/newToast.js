import canvasState from "../store/canvasState";

export const newToast = (title, body) => {
  const item = {
    title,
    body,
  };
  canvasState.setInfo(item);
};
