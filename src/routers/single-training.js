const express = require("express");
const router = new express.Router();
const SingleTraining = require("../models/single-training");
const auth = require("../middleware/auth");

router.post("/single-training", auth, async (req, res) => {
    const training = new SingleTraining(req.body);
    try {
        await training.save();
    res.send(training);
} catch (error) {
    res.status(500).send(error);
}
});

router.get("/single-training", auth, async (req, res) => {
  try {
    const training = new SingleTraining(req.body);
    if (!training) {
        return res.status(404).send();
      } else {
        res.send(training);
    }
} catch (error) {
    res.status(500).send(error);
}
});

router.get("/single-training/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const training = await SingleTraining.findById(_id);
    if (!training) {
      return res.status(404).send();
    } else {
      res.send(training);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/single-training/:id", auth, async (req, res) => {
    try {
      const training = await SingleTraining.findByIdAndDelete(req.params.id);
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