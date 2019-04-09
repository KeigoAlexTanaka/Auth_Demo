## Auth Lesson
Today we'll be covering authentication and authorization. Yay!

- **Authentication**: are you who you say you are? (i.e., you need the right password.)
- **Authorization**: okay, so you are who you say you are... but what exactly are you allowed to do now? (I.e., web tokens and/or sessions)

We'll get there, but first, let's set up the app:
### Set Up:
- Make sure `auth_demo_db` database is created in postgres
- Run:
    - `node resetDB.js`
    - `npm install`
    - in `/client`, run `npm install`
- start server with `npm start`
- serve react: in `/client` run `npm start`


### Step 0: Router
- We'll be using express `router`. If you aren't familiar, peak into `server.js`, and then `routes/users.js`



Test it out! visit http://localhost:8080/users/test . Notice that the `users` prefix get added to everything in the users route. Neat!



### Step 1: User Routes for Signup


- Now, let's start a signup route. "Signing up" is aka "creating a new user", so we'll need a user post route. Let's start it:

`routes/users.js:`
```js
usersRouter.post('/', async (req, res) => {
    const { name, password, email } = req.body;

    console.log(name, password, email)
});
```

- Lets also have our frontend send the form data to the backend:

`client/src/App.js`
```js
async submitSignUp(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password")
    };
    // add this:
    const resp = await axios.post(`${URL}/users`, data);
}
```

- We should see (in our server logs) data getting sent to the backend. Normally, at this point, we would simply store the data as-is. However, we **do not** want to store passwords as simple plaintext strings!
- Intead, we'll hash them, and only store the hashses; this will let us verify the passwords, without having to store them directly. Better security for our users — win!


Copy the following into auth.js
`auth.js`
```js
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 11;

const hashPassword = async (password) => {
  const digest = await bcrypt.hash(password, SALT_ROUNDS);
  return digest;
}

```
This method (using brcrypt) simply inputs a password and outputs a pseudo-random "hash" (the SALT_ROUNDS adds a bit more randomness into the mix in case people pick poor passwords)


- Import this method and `user` it to hash the password before storing it

`users.js`
```js
const { hashPassword} = require('../auth');
// ....

usersRouter.post('/', async (req, res) => {
    const { name, password, email } = req.body;

    const password_digest = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password_digest
    });
});

```

- This route now officially creates a new user and safely stores their password. Yay!

### 2. User route for login

- As before, let's have our `submitLogin` method send data to the backend:
`App.js`
```js
  async submitLogIn(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
      email: formData.get("email"),
      password: formData.get("password")
    };
    // add
    const resp = await axios.post(`${URL}/users/login`, data);
  }

```
<br/><br/>

This time, we're authenticating a login, so we'll need a method to hash the given password and confirm that the digest matches the one stored in the database. `bcrypt` again! Copy this into auth:

`auth.js`
```js
const checkPassword = async (password, password_digest) => {
  return await bcrypt.compare(password, password_digest);
}
```
This method returns a boolean indicating whether or not the given assword matches the given hash

<br/><br/>

- Now let's create a login route, and use our new checkPassword method (don't forget to import it!) for authenticaion:


`routes/users.js`
```js

usersRouter.post('/login', async (req, res) => {

    const { email, password } = req.body;
    const user = await User.find({
      where: {
        email 
      }
    });
    const passwordIsCorrect = await checkPassword(password, user.password_digest)
    if (passwordIsCorrect){
        // ???
    } 

```

This works! We did it! We can confirm whether or not a user is attempting a valid login... but then what?

The whole point of "logging in" is that now, the user should be authorized to do certain things they couldn't do before.

We need to give them an auth token! (https://jwt.io/introduction/) By signing this token and granting it to them, they will be able to continuously prove authoriziation. 

### Step 3: Web tokens
Copy this into auth:

`auth.js`
```js
const genToken = (user) => {
  const token_data = {
    id: user.id,
    name: user.name,
    email: user.email
  };
  const token = jwt.sign(data, TOKEN_KEY);
  return token;
};
```


Now, after loging in, send the user their auth token:
```js
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
        res.json({ token: token });
    } 
}
```

The user will store this token on the front-end:

```js
  async submitLogIn(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
      email: formData.get("email"),
      password: formData.get("password")
    };
    const resp = await axios.post(`${URL}/users/login`, data);
    const token = resp.data.token;
    this.setState({ token });
  }

```



Let's do the same thing for sign up (so that after sign up, they are immediately "logged in")
```js
    const { name, password, email } = req.body;
    const password_digest = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password_digest
    });
    const token = genToken(user);

    res.json({ token: tk });
```

Same on front end

```js
  async submitSignUp(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password")
    };
    const resp = await axios.post(`${URL}/users`, data);
    const token = resp.data.token;
    this.setState({ token:token});
  }
```


Now, the authentication part:

Let's add some middleware for authenticatio nso we can use it for multiple routes.

```js
const restrict = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const data = jwt.verify(token, TOKEN_KEY);
    res.locals.user = data;
    next();
  } catch (e) {
    console.log(e);
    res.status(403).send('Unauthorized');
  }
}
```


sendTweet method that includes Auth data:


```js
  async sendTweet(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
      text: formData.get("text")
    };
    console.log(data);
    
    const resp = await axios.post(`${URL}/tweets`, data, {
      headers: {
        authorization: `Bearer ${this.state.token}`
      }
    });
```
attach it to tweet routes
``` js
tweetsRouter.post("/", restrict, async (req, res) => {

```

```js
tweetsRouter.get("/",restrict, async (req, res) => {

```


Lab: 
- build out the front end to retreive the latest tweet list (when logged in)
- Create a log out method (does this need anything on the backend)?
- Use `localStorage` to presist the token (i.e., stay "logged in" after reloading the page)

