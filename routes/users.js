const { Router } = require('express');
const { User } = require('../models');

const usersRouter = Router();

usersRouter.get('/test', async (req, res) => {
    res.send('i am a user route!');

});
module.exports = usersRouter;
