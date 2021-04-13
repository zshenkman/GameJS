import { Room } from "./Room";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { Player } from "./Player";

export class Game {
  rooms: Map<string, Room>;
  server: Server | null;

  constructor() {
    this.rooms = new Map();
    this.server = null;
  }

  async initialize(port?: number) {
    try {
      const PORT = port || 8000;
      const httpServer = createServer();
      const io = new Server(httpServer);

      httpServer.listen(PORT, () => {
        console.log(`HTTP server is listening on port ${PORT}`);
      });

      io.on("connection", (socket: Socket) => {
        console.log("New socket has connected");
      });

      this.server = io;
      return Promise.resolve(io);
    } catch (err) {
      return Promise.reject();
    }
  }

  createRoom(
    host: Player,
    minPlayers: number,
    maxPlayers: number,
    maxPoints: number
  ) {
    const room = new Room(host, minPlayers, maxPlayers, maxPoints);
    this.rooms.set(room.code, room);
    return room;
  }

  getRoom(code: string) {
    const room = this.rooms.get(code);
    if (!room) throw Error("Room with that code does not exist.");
    return room;
  }

  closeRoom(code: string) {
    const room = this.getRoom(code);
    this.rooms.delete(room.code);
  }
}
