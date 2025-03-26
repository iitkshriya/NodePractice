const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const formatMessage = require("./utils/formatMessage.js");
const { setGame, setGameStatus, getGameStatus } = require("./utils/game.js");
const {
  addPlayer,
  getAllPlayers,
  getPlayer,
  removePlayer,
} = require("./utils/players.js");

const port = process.env.PORT || 8080;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, '../public')));

io.on('connection', socket => {
    console.log('A new player just connected');

    socket.on('join', ({ playerName, room }, callback) => {
        const { error, newPlayer } = addPlayer({ id: socket.id, playerName, room });

        if (error) return callback(error.message);
        callback();

        socket.join(newPlayer.room);

        socket.emit('message', formatMessage('Admin', `Welcome ${playerName}!`));

        socket.broadcast
        .to(newPlayer.room)
        .emit('message', formatMessage('Admin', `${newPlayer.playerName} has joined the game!`));

        io.in(newPlayer.room).emit('room', {
            room: newPlayer.room,
            players: getAllPlayers(newPlayer.room),
        });
    });

    socket.on('disconnect', () => {
        console.log("A player disconnected.");

        const disconnectedPlayer = removePlayer({ id: socket.id });

        if (disconnectedPlayer) {
            const { playerName, room } = disconnectedPlayer;
            io.in(room).emit("message", formatMessage("Admin", `${playerName} has left!`));
            io.in(room).emit("room", { room, players: getAllPlayers(room) });
        }
    });

    socket.on("sendMessage", (message, callback) => {
        const { error, player } = getPlayer({ id : socket.id });

        if (error) return callback(error.message);

        if (player) {
            io.to(player.room).emit("message", formatMessage(player.playerName, message));
            callback();
        }
    });

    socket.on("getQuestion", async (data, callback) => {
        const { error, player } = getPlayer({ id: socket.id });
      
        if (error) return callback(error.message);
      
        if (player) {
          // Pass in a callback function to handle the promise that's returned from the API call
          const game = await setGame();
          io.to(player.room).emit('question', {
            playerName: player.playerName,
            ...game.prompt,
          })
        }
    });

    socket.on("sendAnswer", (answer, callback) => {
        const { error, player } = getPlayer({ id: socket.id });

        if (error) return callback(error.message);

        if (player) {
            const { isRoundOver } = setGameStatus({
                event: "sendAnswer",
                playerId: player.id,
                answer,
                room: player.room
            });

            io.to(player.room).emit("answer", {
                ...formatMessage(player.playerName, answer),
                isRoundOver,
            });

            callback();
        }
    })

    socket.on("getAnswer", (callback) => {
        const { error, player } = getPlayer({ id: socket.id });

        if (error) return callback(error.message);

        if (player) {
            const { correctAnswer } = getGameStatus({ event: "getAnswer"});
            io.to(player.room).emit("correctAnswer", formatMessage(player.playerName, correctAnswer));
        }
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})