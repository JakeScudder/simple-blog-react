const express = require('express');
const router = express.Router();
const Blog = require('../db/models').Blog;
const User = require('../db/models').User;

const { check, validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');

// Handler function to wrap each route
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      res.status(500).send(error);
    }
  }
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

// GET Blog Posts
router.get('/blog', asyncHandler(async (req, res) => {
  const allBlogs = await Blog.findAll({
    include: {
      model: User,
      attributes: {exclude: ['password', 'createdAt', 'updatedAt']}
    },
  });
  res.status(200).json({allBlogs});
}))

// GET Individual Blog Post
router.get('/blog/:id', asyncHandler(async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  console.log(blog);
  res.status(200).json(blog);
}))

// POST Create Blog Post
router.post('/new', [
  check('title')
    .exists({checkNull: true, checkFalsy: true})
    .withMessage('Please include your "title"'),
  check('author')
    .exists({checkNull: true, checkFalsy: true})
    .withMessage('Please include your "name"'),
  check('post')
    .exists({checkNull: true, checkFalsy: true})
    .withMessage('Please include your "blog post"'),
], authenticateUser, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  //If there are validation errors
  if(!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({errors: errorMessages});
  }
  let blogPost;
  try {
    blogPost = await Blog.create(req.body);
    res.json({blogPost});
  } catch (error) {
    console.log(error);
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
    } else {
      throw error;
    }
  }
}));

// PUT  Create Update Blog route
router.put('/blog/:id', [
  check('title') 
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please include your "blog title"'),
  check('post') 
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Blog post is blank'),
], authenticateUser, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  //If there are errors
  if(!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({errors: errorMessages});
  }
  //Update Blog
  try {
    let blog = await Blog.findByPk(req.params.id);
    console.log("blog title:", blog.title);
    console.log("req.params.id:", req.params.id);
    if (blog) {
      blog.title = req.body.title;
      blog.post = req.body.post;
      await blog.update(req.body);
      res.status(204).end();
    } else {
      res.status(404).json({message: "Sorry, we couldn't locate that blog post."})
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}));

//DELETE route deletes a course, returns no content
router.delete('/blog/:id', authenticateUser, asyncHandler( async (req, res) => {
  try {
    // const user = req.currentUser;
    let blogPost = await Blog.findByPk(req.params.id);
    if (blogPost) {
        await blogPost.destroy();
        res.status(204).end();
      } else {
        res.status(403).json({message: "Sorry, we can't located the blog post to be deleted"})
      }
  } catch(error) {
    res.status(500).json({message: error.message})
  }
}));


module.exports = router;