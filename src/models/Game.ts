import { Room } from "./Room";
import * as http from "http";
import { Server, Socket } from "socket.io";
import { Player } from "./Player";
import * as express from "express"

export class Game {
  app: Express.Application | null;
  io: Server | null;
  rooms: Map<string, Room>;
  server: http.Server | null;

  constructor() {
    this.app = null;
    this.io = null;
    this.rooms = new Map();
    this.server = null;
  }

  async initialize(port?: number) {
    try {
      const PORT = port || 8000;
      const app = express();
      const httpServer = http.createServer(app);
      const io = new Server(httpServer);

      httpServer.listen(PORT, () => {
        console.log(`HTTP server is listening on port ${PORT}`);
      });

      io.on("connection", (socket: Socket) => {
        console.log("New socket has connected");
      });

      this.app = app;
      this.io = io;
      this.server = httpServer;
      return Promise.resolve(io);
    } catch (err) {
      return Promise.reject();
    }
  }

  createRoom(minPlayers: number, maxPlayers: number, maxPoints: number) {
    const room = new Room(minPlayers, maxPlayers, maxPoints);
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
