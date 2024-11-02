const express = require('express');
const router = express.Router()
const postController=require('./../controllers/post');
const checkAuth=require('./../middleware/check-auth');

const extractFile=require('./../middleware/file')


router.get('/', postController.getPosts);

router.get('/:id', postController.getPost);

router.post('/',checkAuth,extractFile,postController.createPost);

router.put('/:id', checkAuth,extractFile, postController.updatePost);

router.delete('/:id', checkAuth,postController.deletePost );




module.exports = router

