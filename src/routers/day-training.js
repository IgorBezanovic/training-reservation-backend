const express = require("express");
const router = new express.Router();
const DayTraining = require("../models/days-training");
const auth = require("../middleware/auth");

router.post("/training", auth, async (req, res) => {
  const training = new DayTraining(req.body);
  try {
    await training.save();
    res.send(training);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/training", auth, async (req, res) => {
  try {
    const training = await DayTraining.find({});
    if (!training) {
      return res.status(404).send();
    } else {
      res.send(training);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/training/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const training = await DayTraining.findById(_id);
    if (!training) {
      return res.status(404).send();
    } else {
      res.send(training);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// router.patch('/training/:id', async (req, res) => {
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['day']
//     const isValidOperations = updates.every((update) => allowedUpdates.includes(update))

//     if(!isValidOperations){
//         return res.status(400).send({ error: 'Invalid updates' })
//     }

//     try{
//         const training = await DayTraining.findByIdAndUpdate(req.params.id, req.body, { new: true,  runValidators: true })
//         if(!training){
//             return res.status(404).send()
//         } else {
//             res.send(training)
//         }
//     } catch(error) {
//         res.status(400).send(error)
//     }
// })

router.delete("/training/:id", auth, async (req, res) => {
  try {
    const training = await DayTraining.findByIdAndDelete(req.params.id);
    if (!training) {
      return res.status(404).send();
    } else {
      res.send();
    }
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
