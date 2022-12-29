/* eslint-disable @typescript-eslint/no-unused-vars */
import { expect, describe, test } from "@jest/globals";
import { DiceTowerInterface } from "./game/DiceTower";
import { GameState, GameStateKind } from "./game/states";
import { GameController } from "./GameController";
import DefaultRules from "./rules/DefaultRules";

class RiggedDice implements DiceTowerInterface {
  val: number;

  nextValue(val: number) {
    this.val = val;
  }

  throwDice(_diceCount: number, _sides: number): number {
    return this.val;
  }
}

const diceTower = new RiggedDice();
const controller = new GameController(DefaultRules, diceTower);
const stateListener = (state: GameState) => {
  return;
};

controller.gameStateCallback = stateListener;

describe("Game Controller", () => {
  test("player can enter game", () => {
    controller.enterGame("john", "1");
    expect(controller.game.players[0].identifier).toBe("1");
    expect(controller.gameState.state.kind).toBe(GameStateKind.WaitingPlayer);
  });

  // Ensures next die is 5.
  diceTower.nextValue(5);

  test("game emits state update when players have joined", () => {
    controller.enterGame("maria", "2");
    expect(controller.gameState.state.kind).toBe(GameStateKind.Turn);
  });

  test("player can play and score is updated", () => {
    if (controller.gameState.state.kind != GameStateKind.Turn) {
      expect(controller.gameState.state.kind).toBe(GameStateKind.Turn);
      return;
    }

    const playerId = controller.gameState.state.playerId;

    controller.play(0, playerId);
    expect(controller.gameState.boardState.players[playerId].score).toBe(5);
    expect(controller.gameState.boardState.players[playerId].board[0][0]).toBe(
      5
    );
  });
});
