const express = require("express");
// const path = require('path');
const cors = require("cors");

const recipesRouter = require('./routers/recipes');
const usersRouter = require('./routers/users');
const { handleError } = require('./utils/error');
const auth = require('./middleware/auth.js');

const app = express();

app.use(cors());

app.use((req, res, next) => {
    console.log(`req to: ${req.method} ${req.path} at ${new Date().toISOString()}`);
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(auth.initialize());

app.get("/", (req, res) => {
    res.redirect("/api/v1/recipes");
  });

app.use('/api/v1/recipes', recipesRouter);
app.use("/api/v1/users", usersRouter);

app.use(handleError);

const port = process.env.PORT || 8080;

app.listen(port, () => {
 console.log(`Server is up on port ${port}.`);
});