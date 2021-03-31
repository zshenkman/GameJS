import { Room } from './Room';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

export default class Game {
  properties: object;
  rooms: Map<string, Room>;

  constructor() {
    this.properties = new Object();
    this.rooms = new Map();
  }

  async initialize(port?: number) {
    try {
      const PORT = port || 8000;
      const httpServer = createServer();
      const io = new Server(httpServer);

      io.on('connection', (socket: Socket) => {
        // console.log("New socket has connected")
      });

      httpServer.listen(PORT);
      return Promise.resolve(httpServer);
    } catch (err) {
      return Promise.reject();
    }
  }

  createRoom() {
    const room = new Room(this);
    this.rooms.set(room.code, room);
    return room;
  }
}
