const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const users = require('./user.js');

const app = express();

// app.use(express.static(__dirname +  '/public'))

app.use(bodyParser.json());
app.use(cors())

app.get('/', (req, res) => {
  res.send('root of the web');
})

app.post('/signin', (req, res) => {
  let valid = false;
  const email = req.body.email;
  const password = req.body.password;
  users.every(function(user, index) {
    if (email === user.email && password === user.password) {
      res.json({
        message: 'Welcome back ' +  email +  ' !',
        status: 200,
        user: user.username
      });
      valid = true;
      return false;
    } else {
      return !valid;
    }
  })
  if (!valid)
    res.json({
      message: 'Wrong email or password',
      status: 403,
    });
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  if( id < 1 || id > users.length )
    res.status(404).json("Found no one~");
  const { username, email, address } = users[id-1];
  const response = {
    message: 'Is this me you are looking for ?!',
    person: {
      username: username,
      email: email,
      address: address
    },
  };
  res.status(200).json(response);
})

app.post('/register', (req, res) => {
  const valid = true;
  const { username, email, password } = req.body;
  const newUser = {
    username: username,
    password: password,
    email: email
  }
  users.push(newUser);
  const response = {
    message: 'Hey you got an account now!',
    email: email
  };
  res.status(201).json(response);
});

// Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });

app.listen(3000, () => {
  console.log('App is running!');
})
