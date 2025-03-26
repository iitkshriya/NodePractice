const https = require("https");
const fetch = require("node-fetch");
const { getAllPlayers } = require("./players.js");

const game = {
  prompt: {
    answers: "",
    question: "",
    createdAt: "",
  },
  status: {
    submissions: {}, 
    correctAnswer: "", 
    isRoundOver: false,
  },
};

const getGameStatus = ({ event }) => {
  const { correctAnswer, isRoundOver } = game.status;

  if (event === "getAnswer" && isRoundOver) {
    return { correctAnswer };
  }
};

const setGameStatus = ({ event, playerId, answer, room }) => {
  if (event === "sendAnswer") {
    const { submissions } = game.status;

    if (!submissions[`${playerId}`]) {
      submissions[`${playerId}`] = answer;
    }

    game.status.isRoundOver =
      Object.keys(submissions).length === getAllPlayers(room).length;
  }

  return game.status;
};

const setGame = async (callback) => {
  try {
    const response = await fetch('https://opentdb.com/api.php?amount=1&category=18');
    const data = await response.json();
    const { correct_answer, createdAt, incorrect_answers, question } = data.results[0];

    game.status.submissions = {};
    game.status.correctAnswer = correct_answer;
    game.prompt = {
      answers: shuffle([correct_answer, ...incorrect_answers]),
      question,
      createdAt
    };

    return game;
  } catch (error) {
    console.log(error);
  }
};

// Shuffles an array. Source: https://javascript.info/task/shuffle
const shuffle = (array) => {
  for (let end = array.length - 1; end > 0; end--) {
    let random = Math.floor(Math.random() * (end + 1));
    [array[end], array[random]] = [array[random], array[end]];
  }
  return array;
};

module.exports = {
  getGameStatus,
  setGameStatus,
  setGame,
};