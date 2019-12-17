const bcrypt = require('bcryptjs');

const router = require('express').Router();

const Users = require('../users/users-model.js');

router.post('/register', (req, res) => {
  let user = req.body

  const hashedPassword = bcrypt.hashSync(user.password, 12)

  user.password = hashedPassword;

  Users.add(user)
    .then(savedUser => {
        res.status(201)
            .json(savedUser);
    })
    .catch(error => {
        res.status(500)
            .json({ message: "There was error while creating the user.", error})
    });
});

router.post('/login', (req, res) => {
 let { username, password } = req.body;

 Users.findBy({ username })
    .first()
    .then(user => {
       if (user && bcrypt.compareSync(password, user.password)) {
           res
           .status(200)
           .json({ message: `Welcome ${user.username}!` });
       } else {
           res
           .status(401)
           .json({ message:'You shall not pass!'})
       }
    })
    .catch(error => {
        res
        .status(500)
        .json({ message: "Server error while logging in.", error})
    });
});

module.exports = router
