const { Router } = require("express");
const { Tweet } = require("../models");
const { restrict } = require('../auth');

const tweetsRouter = Router();

tweetsRouter.get("/", restrict, async (req, res) => {
  const tweets = await Tweet.findAll();

  res.json({ tweets });
});

tweetsRouter.post("/",restrict, async (req, res) => {
  const { text } = req.body;
  const { user } = res.locals;
  const tweet = await Tweet.create({ text });

  await tweet.setUser(user.id);

  res.json({ tweet });
});

tweetsRouter.delete("/:id",restrict, async (req, res) => {
  try {
    const tweet = await Tweet.findByPk(req.params.id);
    await tweet.destroy();
    res.send(tweet);
  } catch (e) {
    console.log(e.message);
  }
});

module.exports = tweetsRouter;
