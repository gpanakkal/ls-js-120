const constants = require('./constants.json');
const { computerPlayer, humanPlayer } = require('./Player');
/**
 * Define:
 * board size
 * winning line length
 * player count
 * human player count
 * player names and markers
 */
class GameRules {
  constructor() {
    this.players = [];
    this.boardLength = constants.DEFAULT_BOARD_LENGTH;
    this.winningLineLength = constants.DEFAULT_WINNING_LINE_LENGTH;


    const playerMarkers = constants.PLAYER_MARKERS;
    const firstHuman = new Player(constants.DEFAULT_HUMAN_BASE_NAME, playerMarkers.shift());
    firstHuman.name = this.promptHumanPlayerName(firstHuman);
    this.players.push(firstHuman);
    const useDefaults = this.promptUseDefaults(firstHuman);
    if (useDefaults) {
      this.initializeBoard(firstHuman);
    }
    this.initializePlayers(firstHuman, playerMarkers, useDefaults);
  }

  promptUseDefaults(humanPlayer) {
    const useDefaultsPrompt = '\nUse default Tic Tac Toe rules? (y)es / (n)o (default is "yes"):';
    return humanPlayer.getBooleanInput(useDefaultsPrompt, useDefaultsPrompt);
  }
  
  promptBoardLength(humanPlayer) {
    const minLength = constants.MIN_BOARD_LENGTH;
    const maxLength = constants.MAX_BOARD_LENGTH;

    const boardLengthPrompt = 'Choose the board\'s length on each side';
    const boardLengthLimits = `(At least ${minLength}, and at most ${maxLength})`;
    const fullPrompt = `${boardLengthPrompt} ${boardLengthLimits}:`;
    return humanPlayer.getNumberInput(minLength, maxLength, constants.DEFAULT_BOARD_LENGTH, fullPrompt);
  }

  promptWinningLineLength(firstHuman) {
    const min = constants.MIN_WINNING_LINE_LENGTH;
    const max = this.boardLength;

    const winningLineLengthPrompt = `Choose a winning line length, from ${min} to ${max}`;
    const defaultLineLengthPrompt = `(default ${constants.DEFAULT_WINNING_LINE_LENGTH})`;
    const fullPrompt = `${winningLineLengthPrompt} ${defaultLineLengthPrompt}:`;

    return firstHuman.getNumber(min, max, constants.DEFAULT_WINNING_LINE_LENGTH, fullPrompt);
  }

  initializeBoard(firstHuman) {
    this.boardLength = this.promptBoardLength(firstHuman);
    this.winningLineLength = this.promptWinningLineLength(firstHuman);
  }

  promptPlayerCount(firstHuman) {
    const min = constants.MIN_PLAYER_COUNT;
    const max = constants.MAX_PLAYER_COUNT;
    // if (min >= max) return min;
    const defaultPlayerCount = constants.DEFAULT_PLAYER_COUNT;

    const playerCountPrompt = `Enter a player count from ${min} to ${max}`;
    const useDefaultPrompt = `or press enter to use the default (${defaultPlayerCount})`;
    const fullPrompt = `${playerCountPrompt}, ${useDefaultPrompt}: `;

    return firstHuman.getNumberInput(min, max, defaultPlayerCount, fullPrompt);
  }
  /**
   * @returns The user-provided number of human players,
   * bounded to the minimum human players and max total players (inclusive)
   */
  promptHumanPlayerCount(firstHuman, playerCount) {
    const min = constants.MIN_HUMAN_PLAYER_COUNT;
    const max = playerCount;
    // if (min === max) return min;
    const defaultHumanCount = constants.DEFAULT_HUMAN_PLAYER_COUNT;

    const playerCountPrompt = `Enter a human player count from ${min} to ${max}`;
    const useDefaultPrompt = `or press enter to use the default (${defaultHumanCount})`;
    const fullPrompt = `${playerCountPrompt}, ${useDefaultPrompt}: `;

    return firstHuman.getNumberInput(min, max, defaultHumanCount, fullPrompt);
  }

  promptHumanPlayerName(firstHuman) {
    const minLength = constants.BASE_NAME_MIN_LENGTH
    const maxLength = constants.BASE_NAME_MAX_LENGTH
    const defaultName = constants.DEFAULT_HUMAN_BASE_NAME;

    const playerNamePrompt = `Enter the name you want to use (default ${defaultName}):`;
    
    const invalidNameCb = () => `Name must contain at least ${minLength} and at most ${maxLength} non-space characters`;

    return firstHuman.getTextInput(
      minLength,
      maxLength,
      defaultName,
      playerNamePrompt,
      invalidNameCb
    );
  }

  initializePlayers(firstHuman, playerMarkers, useDefaults) {
    let playerCount = constants.DEFAULT_PLAYER_COUNT;
    let humanPlayerCount = constants.DEFAULT_HUMAN_PLAYER_COUNT;

    if (!useDefaults) {
      playerCount = this.promptPlayerCount(firstHuman);
      humanPlayerCount = this.promptHumanPlayerCount(firstHuman, playerCount);
    }

    const playersRemaining = this.players.length - playerCount;
    let humansRemaining = humanPlayerCount - 1;

    for (let i = 1; i <= playersRemaining; i += 1) {
      let name = constants.COMPUTER_BASE_NAME;

      if (humansRemaining) {
        name = this.promptHumanPlayerName(firstHuman, humanPlayerCount);
        humansRemaining - 1;
      }

      const newPlayer = new Player(name, playerMarkers.shift());
      this.players.push(newPlayer);
    }
  }
}

module.exports = { GameRules };