const { Router } = require('express');
const { User } = require('../models');
const { hashPassword, genToken, checkPassword } = require('../auth');

const usersRouter = Router();

const buildAuthResponse = (user) => {
    const token_data = {
      id: user.id,
      name: user.name,
      email: user.email
    };

    const token = genToken(token_data);
    const userData = {
      name: user.name,
      id: user.id,
      email: user.email,
    };

  return {
    user: userData,
    token,
  };
}

usersRouter.post('/', async (req, res) => {
  try {
        
    const { name, password, email } = req.body;
    const password_digest = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password_digest
    });

    const respData = buildAuthResponse(user);

    res.json({ ...respData });
  } catch (e) {
    res.status(500).send(e.message);
  }
});

usersRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.find({
      where: {
        email 
      }
    });

    if (await checkPassword(password, user.password_digest)) {
      const respData = buildAuthResponse(user);


      res.json({ ...respData });
    } else {
      res.status(401).send('Invalid Credentials');
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e.message);
  }
})

module.exports = usersRouter;
