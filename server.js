const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');

const usersRouter = require('./routes/users');
const tweetsRouter = require('./routes/tweets');

const PORT = process.env.PORT || 8080;
const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());

app.use('/users', usersRouter);
app.use('/tweets', tweetsRouter);

app.get('/', (req, res) => {
  res.send('hey there');
});


app.listen(PORT, () => console.log('up and running'));
