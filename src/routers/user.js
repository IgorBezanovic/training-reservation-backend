const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");

const emails = require("../emails/account")


router.post("/users/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    emails.sendWelcomeEmail(user.email, user.username)
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send({
      error: { message: "You have entered an invalid email or password", error: error },
    });
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.token = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

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

    if (!user) {
      return res.status(404).send();
    } else if (req.query.page) {
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const result = user.slice(startIndex, endIndex);
      res.send(result);
    } else {
      res.send(user.sort());
    }
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
    emails.cancelUsingApp(user.email, user.username)
    if (!user) {
      return res.status(404).send();
    } else {
      res.send();
    }
  } catch (error) {
    res.status(500).send();
  }
});

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("File must be a image"));
    }
    cb(undefined, true);
  },
});

router.post("/users/profile-image", auth, upload.single("image"), async (req, res) => {
    const buffer = await sharp(req.file.buffer).png().toBuffer();
    req.user.image = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete("/users/profile-image/:id", auth, async (req, res) => {
  try {
    if (req.user.image) {
      req.user.image = undefined;
      await req.user.save();
      res.send();
    } else {
      res.send("User don't have image");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/users/profile-image/:id/image", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.image) {
      return res.status(404).send();
    } else {
      res.set('Content-Type', 'image/png')
      res.send(user.image);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
