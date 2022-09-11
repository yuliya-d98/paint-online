const express = require("express");
const app = express();
const WSserver = require("express-ws")(app);
const aWss = WSserver.getWss();
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.ws("/", (ws, req) => {
  console.log("подключение установлено", ws, req);
  // ws.send("Ты успешно подключился");
  ws.on("message", (msg) => {
    msg = JSON.parse(msg);
    switch (msg.method) {
      case "connection":
        connectionHandler(ws, msg);
        break;
      case "draw":
        broadcastConnection(ws, msg);
        break;
    }
  });
  ws.on("error", (error) => {
    console.log(error.message);
  });
});

app.post("/image", (req, res) => {
  try {
    const data = req.body.img.replace("data:image/png;base64,", "");
    const pathToFile = path.resolve(__dirname, "files", `${req.query.id}.jpg`);
    fs.writeFileSync(pathToFile, data, "base64");
    return res.status(200).json({ message: "Загружено" });
  } catch (e) {
    console.log(e);
    return res.status(500).json("error");
  }
});
app.get("/image", (req, res) => {
  try {
    const pathToFile = path.resolve(__dirname, "files", `${req.query.id}.jpg`);
    const file = fs.readFileSync(pathToFile);
    const data = "data:image/png;base64," + file.toString("base64");
    res.json(data);
  } catch (e) {
    console.log(e);
    return res.status(500).json("error");
  }
});

app.listen(PORT, () => {
  console.log("server started on port ", PORT);
});

const connectionHandler = (ws, msg) => {
  ws.id = msg.id;
  broadcastConnection(ws, msg);
};

// делаем широковещательную рассылку
const broadcastConnection = (ws, msg) => {
  // aWss.clients хранит все открытые вебсокеты
  aWss.clients.forEach((client) => {
    if (client.id === msg.id) {
      client.send(JSON.stringify(msg));
    }
  });
};
