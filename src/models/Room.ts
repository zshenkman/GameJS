import { Socket } from 'socket.io';
import Game from './Game';
import { Player } from './Player';
const ROOM_CODE_LENGTH = 4;

export class Room {
  code: string;
  game: Game;
  host: Player;
  isActive: boolean;
  isPublic: boolean;
  players: Player[];
  properties: object;

  constructor(game: Game) {
    const host = new Player(this);

    this.code = Room.generateCode(ROOM_CODE_LENGTH);
    this.game = game;
    this.host = host;
    this.isActive = false;
    this.isPublic = false;
    this.players = [host];
    this.properties = new Object();
  }

  private static generateCode(length: number) {
    const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';

    for (let i = 0; i < length; i++) {
      code += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
    }

    return code;
  }

  async addNewPlayer(socket: Socket, displayName?: string) {
    try {
      const player = new Player(this, socket, displayName);
      this.players.push(player);
      return Promise.resolve(player);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async removePlayer(player: Player) {
    try {
      const playerIndex = this.players.findIndex((el) => el.displayName === player.displayName);
      if (playerIndex === -1) throw Error('Player could not be found.');
      this.players.splice(playerIndex, 1);

      const isHost = player.displayName === this.host.displayName;
      if (isHost) {
        if (this.players.length > 1) {
          const randomIndex = Math.floor(Math.random() * this.players.length);
          const newHost = this.players[randomIndex];
          this.host = newHost;
        }
      }

      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async close() {
    try {
      this.game.rooms.delete(this.code);
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
