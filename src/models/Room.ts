import { Socket } from "socket.io";
import { Player } from "./Player";
import GameInstance from "./../index";
const ROOM_CODE_LENGTH = 4;

export class Room {
  code: string;
  gameType: string | null;
  gameWinner: Player | null;
  host: Player | null;
  isInProgress: boolean;
  isPublic: boolean;
  maxPlayers: number;
  maxPoints: number;
  minPlayers: number;
  players: Player[];
  roundsCounter: number;
  roundWinner: Player | null;

  constructor(minPlayers: number, maxPlayers: number, maxPoints: number) {
    this.code = Room.generateCode(ROOM_CODE_LENGTH);
    this.gameType = null;
    this.gameWinner = null;
    this.host = null;
    this.isInProgress = false;
    this.isPublic = false;
    this.maxPlayers = maxPlayers || 8;
    this.maxPoints = maxPoints || 7;
    this.minPlayers = minPlayers || 2;
    this.players = [];
    this.roundsCounter = 0;
    this.roundWinner = null;
  }

  private static generateCode(length: number) {
    const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let code = "";

    for (let i = 0; i < length; i++) {
      code += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
    }

    return code;
  }

  addNewPlayer(displayName: string, socketID: string) {
    if (this.players.length === this.maxPlayers)
      throw Error("Room has reached max players.");
    const existingPlayer = this.players.find(
      (el) => el.displayName === displayName
    );
    if (existingPlayer)
      throw Error("Player already exists with that display name.");

    const player = new Player(displayName, this.code, socketID);
    this.players.push(player);

    if (!this.host) {
      this.host = player;
    }

    return player;
  }

  removePlayer(player: Player) {
    const playerIndex = this.players.findIndex(
      (el) => el.displayName === player.displayName
    );
    if (playerIndex === -1) throw Error("Player could not be found.");
    this.players.splice(playerIndex, 1);

    if (this.players.length > 0) {
      const isHost = this.host && player.displayName === this.host.displayName;
      if (isHost) {
        if (this.players.length > 1) {
          const randomIndex = Math.floor(Math.random() * this.players.length);
          const newHost = this.players[randomIndex];
          this.host = newHost;
        }
      }
    }
  }

  startGame(type?: string) {
    if (this.isInProgress) throw Error("Game is already in progress.");

    if (this.players.length < this.minPlayers)
      throw Error("Not enough players to start the game.");
    this.isInProgress = true;
    this.gameType = type || "Default";
    this.gameWinner = null;
    this.roundsCounter = 0;
    this.startNewRound();
  }

  startNewRound() {
    if (!this.isInProgress) throw Error("Game is not in progress.");

    this.roundsCounter++;
    this.roundWinner = null;
  }

  endGame() {
    if (!this.isInProgress) throw Error("Game is not in progress.");
    this.isInProgress = false;
  }

  broadcast(event: string, ...data: any) {
    const server = GameInstance.game.server;
    if (!server) return;
    for (const player of this.players) {
      const socket = server.of("/").sockets.get(player.socketID);
      if (socket) socket.emit(event, ...data);
    }
  }

  broadcastToSockets(socketIDs: string[], event: string, ...data: any) {
    const server = GameInstance.game.server;
    if (!server) return;
    const includedPlayers = this.players.filter((player) =>
      socketIDs.includes(player.socketID)
    );
    for (const player of includedPlayers) {
      const socket = server.of("/").sockets.get(player.socketID);
      if (socket) socket.emit(event, ...data);
    }
  }
}
