export interface DiceTowerInterface {
  throwDice(diceCount: number, sides: number): number;
}

class DiceTower implements DiceTowerInterface {
  throwDice(diceCount: number, sides: number): number {
    return Math.floor(Math.random() * sides * diceCount) + 1;
  }
}

export default new DiceTower();
