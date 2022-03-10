const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");

router.post("/users/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send({
      error: { message: "You have entered an invalid email or password" },
    });
  }
});

router.post("/users/logout", auth,  async (req, res) => {
    try {
        req.user.token = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

router.post("/users/logoutAll", auth,  async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})


router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send({
      error: { message: "You have entered an invalid email or password" },
    });
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.get("/users", auth, async (req, res) => {
  try {
    const user = await User.find({});
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/users/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send();
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch("/users/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "username",
    "lastName",
    "email",
    "password",
    "age",
    "role",
    "numTraining",
  ];
  const isValidOperations = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperations) {
    return res.status(400).send({ error: "Invalid updates" });
  }

  try {
    const user = await User.findById(req.params.id);

    updates.forEach((update) => (user[update] = req.body[update]));

    await user.save();

    if (!user) {
      return res.status(404).send();
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/users/:id", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send();
    } else {
      res.send();
    }
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
