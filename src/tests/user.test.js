const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../models/user");

const userOneId = new mongoose.Types.ObjectId();

const userOne = {
  _id: userOneId,
  username: "Igor",
  lastName: "Bezanovic",
  email: "igorbezanovic@gmail.com",
  password: "Dejana1602",
  age: 29,
  numTraining: 16,
  role: "admin",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    },
  ],
};

beforeEach(async () => {
  await User.deleteMany();
  await new User(userOne).save();
});

test("Register user", async () => {
  const response = await request(app)
    .post("/users/signup")
    .send({
      username: "Igor",
      lastName: "Bezanovic",
      email: "igorbezanovic12@gmail.com",
      password: "Dejana1602",
      age: 29,
      numTraining: 16,
      role: "user",
    })
    .expect(200);

  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();
  expect(user.username).toBe("Igor");
  expect(response.body).toMatchObject({
    user: {
      username: "Igor",
      email: "igorbezanovic12@gmail.com",
    },
    token: user.tokens[0].token,
  });
  expect(user.password).not.toBe("Dejana1602");
});

test("Login user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(response.body.token).toBe(user.tokens[1].token);
});

test("Login user - need to Fail", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: "igorbezanovic9@gmail.com",
      password: "PogresanPassword",
    })
    .expect(400);
});

test("Get all Users", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  const user = await User.findById(userOneId);

  await request(app)
    .get("/users")
    .set(`Authorization`, `Bearer ${user.tokens[1].token}`)
    .send()
    .expect(200);
});

test("Get all Users - need to Fail", async () => {
  await request(app)
    .get("/users")
    .send()
    .expect(401);
});

test("Get user by id", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  const user = await User.findById(userOneId);

  await request(app)
    .get(`/users/${userOneId}`)
    .set(`Authorization`, `Bearer ${user.tokens[1].token}`)
    .send()
    .expect(200);
});

test("Get user by id - need to Fail", async () => {
  await request(app)
    .get(`/users/${userOneId}`)
    .send()
    .expect(401);
});

test("Delete user by id", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  const user = await User.findById(userOneId);

  await request(app)
    .delete(`/users/${userOneId}`)
    .set(`Authorization`, `Bearer ${user.tokens[1].token}`)
    .send()
    .expect(200);

    const sameUser = await User.findById(userOneId)
    expect(sameUser).toBeNull()
});
