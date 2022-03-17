const express = require("express");
var cors = require("cors");
require("./db/mongoose");

const userRouter = require("./routers/user")
const dayTraining = require("./routers/day-training")
const singleTraining = require("./routers/single-training")

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(userRouter);
app.use(dayTraining);
app.use(singleTraining);

app.listen(port, () => {console.log("Server is up on port " + port)});
