const express = require("express");
const app = express();
const WSserver = require("express-ws")(app);
const aWss = WSserver.getWss();
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI, {
  keepAlive: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const PORT = process.env.PORT || 5000;

// source: https://gist.github.com/ross-u/a1e67a0c366fd03d0f46218159163f7c#10-update-the-servers-cors-settings-
// CORS SETTINGS TO ALLOW CROSS-ORIGIN INTERACTION:
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:5000",
      "http://paint-online-yuliya-d98.herokuapp.com", // <-- ADD
      "https://paint-online-yuliya-d98.herokuapp.com", // <-- ADD
    ],
  })
);
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

// source: https://gist.github.com/ross-u/a1e67a0c366fd03d0f46218159163f7c#3-setup-the-client-react-app-and-create-the-build
// ROUTE FOR SERVING REACT APP (index.html)
app.use((req, res, next) => {
  // If no previous routes match the request, send back the React app.
  res.sendFile(__dirname + "/public/index.html");
});
