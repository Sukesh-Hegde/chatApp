const http = require("http");
const express = require("express");

const app = express();

const server = http.createServer(app);
const port = process.env.PORT || 8000;

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// 2. Create socket server.
const io = require("socket.io")(server);

/* using socket events  */
var users = {};
io.on("connection", (socket) => {
  socket.on("new-user-joined", (username) => {
    users[socket.id] = username; //store the username with id
    socket.broadcast.emit("user-connected", username); //broadcasting the message to everyone that someone is joined

    /* upatating the list whnever the new connection (using io.emit because need to target every user)*/
    io.emit("user-list", users);
  });

  /* when any user is disconnected */
  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", (user = users[socket.id]));
    delete users[socket.id];

    /* upatating the list whnever the new connection disconnets)*/
    io.emit("user-list", users);
  });

  socket.on("message", (data) => {
    socket.broadcast.emit("message", { user: data.user, msg: data.msg });
  });
});

server.listen(port, () => {
  console.log(`Server started at ${port}`);
});
