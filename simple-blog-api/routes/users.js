'use strict';
const express = require('express');
const router = express.Router();

//Access User model from the database
const User = require('../db/models').User;

//Validation, Authorization, and Password Hashing 
const { check, validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      res.status(500).send(error);
    }
  }
}

function isUnique(value) {
  return User.findOne({where:{emailAddress:value}})
    .then((emailAddress) => {
      if (emailAddress) {
        throw new Error('Validation error');
      }
    })
  
}


//Authenticate User Function
const authenticateUser = async (req, res, next) => {
  let message = null;
  const credentials = auth(req);
  if (credentials) {
    // const user = User.find(u => u.emailAddress === credentials.name);
    const user = await User.findOne({
      where: { emailAddress: credentials.name }
    });
    console.log(user);
    if (user) {
      const authenticated = bcryptjs
        .compareSync(credentials.pass, user.password)
      if (authenticated) {
        console.log(`Authentication successful for: ${user.emailAddress}`);
        req.currentUser = user;
      } else {
        message = `Could not authenticate ${user.emailAddress}`;
      }
    } else {
      message = `Could not find the username: ${user.emailAddress}`;
    } 
  } else {
    message = `Authenticate header not found`;
  }
  if (message) {
    console.warn(message);
    res.status(401).json({message: "Access denied" });
  } else {
    next();
  }
}


/////USER Routes

//GET route that returns the currently authenticated user
router.get('/users', authenticateUser, async (req, res) => {
  const user = req.currentUser;
  res.status(200).json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.emailAddress,
  })
})

//POST route that creates a user, sets the Location header to "/", and returns no content
router.post('/users',[
  check('firstName')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please include your "first name"'),
  check('lastName')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please include your "last name"'),
  check('emailAddress')
    .isEmail()
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please include your "email"')
    // Makes sure email is unique
    .custom(value => {
      return User.findOne({where:{emailAddress:value}})
    .then((emailAddress) => {
      if (emailAddress) {
        throw new Error('Validation error');
      }
    })
    }),
  check('password')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please type your "password"'),
], async (req, res) => {
  const errors = validationResult(req);
  let email = req.body.emailAddress
  //If there are validation errors
  if(!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({errors: errorMessages});
  }

  //Create the user
  let user;
  try {
    email = req.body.emailAddress
      user = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailAddress: email,
        password: bcryptjs.hashSync(req.body.password)
      });
      res
      .status(201)
      .location("/")
      .end();
  } catch (error) {
      console.log(error);
      res.status(400).json({error});
  } 
})

//DELETE route deletes a user, returns no content
router.delete('/users/:id', authenticateUser, asyncHandler( async (req, res) => {
  try {
    let user = await User.findByPk(req.params.id);
    //Does not let Admin be deleted@
    if (user && user.id !== 1) {
        await user.destroy();
        res.status(204).end();
      } else {
        res.status(403).json({message: "Sorry, The user is an admin or we can't locate the user to be deleted"})
      }
  } catch(error) {
    res.status(500).json({message: error.message})
  }
}));

module.exports = router;