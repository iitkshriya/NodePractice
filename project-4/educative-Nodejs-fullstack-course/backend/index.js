require("dotenv").config();
require("./database/database.js").connect();
const auth = require("./middleware/auth");
const express = require("express");
const bodyParser = require("body-parser");
var cors = require('cors');

const app = express();

const port = process.env.PORT || 3000;
const router = require("./routes/index");

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send({ message: "Hello, nodemon!" });
});

app.use('/uploads', express.static('./uploads'));

app.use("/api", router);

app.post("/api/hello", auth, (req, res) => {
    res.status(200).send("Hello 🙌 ");
});

app.listen(port, () => {
    console.log(`Server is up on port: ${port} !`)
})