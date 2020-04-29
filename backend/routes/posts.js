const express = require('express')
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const PostController = require('../controllers/posts.controller');
const extractFile = require('../middleware/file');
//Creating the post
// Adding multer as a express package middleware to do some configuration like extract the flle,
// read it and finally write it in the images folder before executing the cb function
router.post('',
    checkAuth,// Checks if token is valid
    extractFile,
    PostController.CreatePost
);

// This acts as a another middleware for express router // GET posts
router.get('', PostController.GetPosts);

// Deleting the post
router.delete('/:id',
    checkAuth,// Checks if token is valid
    PostController.DeletePost
)

//Update the post
router.put('/:id',
    checkAuth,// Checks if token is valid
    extractFile,
    PostController.UpdatePost
)

//Fetching the unique/single post specific to id
router.get('/:id', PostController.GetPost)

module.exports = router;