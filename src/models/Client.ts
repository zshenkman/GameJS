import { io, Socket } from "socket.io-client";

export class Client {
  socket: Socket;

  constructor(uri: string) {
    this.socket = io(uri, { transports: ["websocket"] });
  }
}
