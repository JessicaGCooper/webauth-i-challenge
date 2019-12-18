const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const sessions = require('express-session'); // <<<<< install express-session
const KnexSessionsStore = require('connect-session-knex')(sessions);//comes after express-session //also this is currying (with the two parenthesis)

const knex = require('../data/dbConfig.js')

const sessionConfiguration = {
  //session storage options
  name: 'sugar', //default would be sid
  secret: 'I wonder how you use this secret to decrypt stuff.',
  saveUninitialized: true, //may want to default to false if asking if user will accept cookies
  resave: false,

  //store configuration
  store: new KnexSessionsStore({
    knex, //imported from dbConfig.js
    createtable: true,
    clearInterval: 1000 * 60 * 60, // converts to 60 minutes // default to 6000
    sidfieldName: 'sid',
    //optional
    tablename: 'sessions'
  }),

  // cookie options
  cookie: {
    maxAge: 100 * 60 * 10, // 10 mins in milliseconds
    secure: false, //if false the cookie is sent over http, if true is sent over https
    httpOnly: true, // if true javascript cannot access the cookie
  }
};

module.exports = server => {
  server.use(helmet());
  server.use(express.json());
  server.use(cors());
  server.use(sessions(sessionConfiguration)); // add a req.session object
};
