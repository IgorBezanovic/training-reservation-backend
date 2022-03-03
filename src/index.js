const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Training = require('./models/training');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

app.post('/users', (req, res) => {
    const user = new User(req.body)
    user.save().then(()=> {
        res.send(user)
    }).catch((error)=>{
        res.status(400).send(error)
    })
})

app.post('/training', (req, res) => {
    const training = new Training(req.body)
    training.save().then(()=> {
        res.send(training)
    }).catch((error)=>{
        res.status(400).send(error)
    })
})

  app.post("/post", (req, res) => {
    console.log("Connected to React");
    res.redirect("/");
  });
  
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})