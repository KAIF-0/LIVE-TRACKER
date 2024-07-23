const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const port = 3000;

const server = http.createServer(app);
const io = new Server(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function (socket) {
  socket.on("send-position", function (e) {
    io.emit("recieve-position", {
      id: socket.id,
      ...e,
    });
  });
  socket.on("disconnect", function () {
    io.emit("user-disconnect", socket.id);
  });
  console.log("Connected");
});

app.get("/", (req, res) => {
  res.render("main");
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
