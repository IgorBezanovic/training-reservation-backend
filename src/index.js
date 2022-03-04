const express = require('express');
var cors = require('cors')
require('./db/mongoose');
const User = require('./models/user');
const Training = require('./models/training');

const app = express();
app.use(cors())
app.use(express.json());

const port = process.env.PORT || 8080;

app.post('/users', async (req, res) => {
    const user = new User(req.body);
    try{
        await user.save()
        res.send(user)
    } catch(error) {
        res.status(400).send(error)
    }
})

app.get('/users', async (req, res) => {
    try{
        const user = await User.find({})
        res.send(user)
    } catch(error) {
        res.status(500).send(error)
    }
})

app.get('/users/:id', async (req, res) => {
    const _id = req.params.id
    try{
        const user = await User.findById(_id)
        if(!user){
            return res.status(404).send()
        } else{
            res.send(user)
        }
    } catch(error) {
        res.status(500).send(error)
    }
})

app.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperations = updates.every((update) => allowedUpdates.includes(update)) 

    if(!isValidOperations){
        return res.status(400).send({ error: 'Invalid updates' })
    }

    try{
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true,  runValidators: true })
        if(!user){
            return res.status(404).send()
        } else {
            res.send(user)
        }
    } catch(error) {
        res.status(400).send(error)
    }
})

app.post('/training', async (req, res) => {
    const training = new Training(req.body)
    try{
        await training.save()
        res.send(training)
    } catch(error) {
        res.status(500).send(error)
    }
})

app.get('/training', async (req, res) => {
    try{
        const training = await Training.find({})
        if(!training){
            return res.status(404).send()
        } else {
            res.send(training)
        }
    } catch(error) {
        res.status(500).send(error)
    }
})

app.get('/training/:id', async (req, res) => {
    const _id = req.params.id
    try{
        const training = await Training.findById(_id);
        if(!training) {
            return res.status(404).send()
        } else {
            res.send(training)
        }
    } catch(error) {
        res.status(500).send(error)
    }
})

app.patch('/training/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperations = updates.every((update) => allowedUpdates.includes(update)) 

    if(!isValidOperations){
        return res.status(400).send({ error: 'Invalid updates' })
    }
    
    try{
        const training = await Training.findByIdAndUpdate(req.params.id, req.body, { new: true,  runValidators: true })
        if(!training){
            return res.status(404).send()
        } else {
            res.send(training)
        }
    } catch(error) {
        res.status(400).send(error)
    }
})

  app.post("/post", (req, res) => {
    console.log("Connected to React");
    res.redirect("/");
  });
  
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})