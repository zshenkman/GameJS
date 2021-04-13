import { Game } from "./Game";

export class GameInstance {
  game: Game;

  constructor() {
    this.game = new Game();
  }
}
