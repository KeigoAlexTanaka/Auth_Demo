const { Router } = require('express');
const { User } = require('../models');
const { genToken, checkPassword, hashPassword } = require('../auth');


const usersRouter = Router();

usersRouter.get('/test', async (req, res) => {
    res.send('i am a user route!');

});

usersRouter.post('/', async (req, res) => {
    const { name, password, email } = req.body;
    const password_digest = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password_digest
    });
    const token = genToken(user);
    res.json({ token });
});

usersRouter.post('/login', async (req, res) => {

    const { email, password } = req.body;
    const user = await User.find({
      where: {
        email 
      }
    });
    const passwordIsCorrect = await checkPassword(password, user.password_digest)
    if (passwordIsCorrect){
        const token = genToken(user);
        res.json({ token });

    }
  });


module.exports = usersRouter;