const { Router } = require("express");
const { Tweet } = require("../models");

const tweetsRouter = Router();

tweetsRouter.get("/", async (req, res) => {
  const tweets = await Tweet.findAll();

  res.json({ tweets });
});

tweetsRouter.post("/", async (req, res) => {
  const { text } = req.body;
  const { user } = res.locals;
  const tweet = await Tweet.create({ text });

  await tweet.setUser(user.id);

  res.json({ tweet });
});

module.exports = tweetsRouter;
