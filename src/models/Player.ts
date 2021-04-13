import { Socket } from "socket.io";
import GameInstance from "./../index";

export class Player {
  displayName: string;
  points: number;
  roomCode: string | null;
  socketID: string;
  wins: number;

  constructor(displayName?: string, roomCode?: string, socketID?: string) {
    this.displayName = displayName || "Player";
    this.points = 0;
    this.roomCode = roomCode || null;
    this.socketID = socketID || "";
    this.wins = 0;
  }

  addPoints(points: number) {
    if (!this.roomCode) return;
    const room = GameInstance.game.getRoom(this.roomCode);

    this.points += points;
    room.roundWinner = this;
    if (this.points >= room?.maxPoints) {
      this.addWin();
    }
  }

  addWin() {
    if (!this.roomCode) return;
    const room = GameInstance.game.getRoom(this.roomCode);

    this.wins++;
    room.gameWinner = this;
    room.endGame();
  }

  broadcastToRoom(event: string, data: any) {
    if (!this.roomCode) return;
    const room = GameInstance.game.getRoom(this.roomCode);

    const excludedSocketIDs = [this.socketID];
    room.broadcast(event, data, excludedSocketIDs);
  }
}
