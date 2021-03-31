import { Socket } from 'socket.io';
import { Room } from './Room';

export class Player {
  displayName: string;
  points: number;
  properties: object;
  room: Room;
  socket: Socket | null;
  wins: number;

  constructor(room: Room, socket?: Socket, displayName?: string) {
    this.displayName = displayName || 'Player';
    this.points = 0;
    this.properties = new Object();
    this.room = room;
    this.socket = socket || null;
    this.wins = 0;
  }
}
