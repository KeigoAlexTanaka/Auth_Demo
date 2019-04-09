const { Router } = require('express');
const { User } = require('../models');
const {hashPassword, checkPassword, genToken} = require('../auth.js')

const usersRouter = Router();

usersRouter.get('/test', async (req, res) => {
    res.send('i am a user route!');

});

usersRouter.post('/', async (req, res)=>{
  const data = req.body
  const passWordDigest = await hashPassword(data.password)

  const user  = User.create({
    name: data.name,
    email: data.email,
    password_digest: passWordDigest
  })

  const token =  genToken(user);
  res.json({
    token,
    user
  })

})

usersRouter.post('/login', async (req, res)=>{
  const {email, password} = req.body;

  const user = await User.find({
    where: {
      email: email
    }
  })

  const verificationResult = await checkPassword(password, user.password_digest)
  if (verificationResult){
    const token =  genToken(user);
    res.json({
      token,
      user
    })
    
  } 
})



module.exports = usersRouter;
