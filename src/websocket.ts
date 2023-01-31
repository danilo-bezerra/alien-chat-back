import { io } from "./http";

interface RoomUser {
  socketId: string;
  username: string;
  room: string;
}

interface Message {
  username: string;
  room: string;
  text: string;
  createdAt: Date;
}

const users: RoomUser[] = [];
const messages: Message[] = [];

io.on("connection", (socket) => {
  socket.on("chatRoom", (data, callback) => {
    const { room, username } = data;
    socket.join(data.room);

    io.to(data.room).emit("log", {
      message: `${data.username} entrou no chat`,
    });

    const user = findUser(username, room);

    if (user) {
      user.socketId = socket.id;
    } else {
      users.push({
        socketId: socket.id,
        username: username,
        room: room,
      });
    }

    const roomMessages = getMessagesFromRoom(room);
    callback(roomMessages);
  });

  socket.on("message", (data) => {
    const { username, room, text } = data;

    const message = {
      createdAt: new Date(),
      room,
      text,
      username,
    };

    messages.push(message);

    io.to(room).emit("message", message);
  });
});

function getMessagesFromRoom(room: string) {
  return messages.filter((m) => m.room == room);
}

function findUser(username: string, room: string) {
  return users.find((user) => user.username == username && user.room == room);
}
