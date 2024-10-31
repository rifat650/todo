const express = require('express');
const router = express.Router()
const multer = require('multer');
const Post = require('./../models/post')

const MIME_TYPE_MAP = {
   'image/png': 'png',
   'image/jpg': 'jpg',
   'image/jpeg': 'jpg'

}
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      const isValid = MIME_TYPE_MAP[file.mimetype];
      let error = new Error('invalid mime type');
      if (isValid) {
         error = null;
      }
      cb(error, 'backend/images')
   },
   filename: (req, file, callback) => {
      const name = file.originalname.toLowerCase().split(' ').join('-');
      const ext = MIME_TYPE_MAP[file.mimetype];
      callback(null, name + '-' + Date.now() + '.' + ext)
   }
})


router.get('/', (req, res) => {
   let fetchedPosts;
   const pageSize = +req.query.pagesize;
   const currentPage = +req.query.page;
   let postQuery=Post.find();
if(pageSize && currentPage){
   postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize)
}

   postQuery.then((document) => {
      fetchedPosts=document;
   return Post.countDocuments()
   }).then((count)=>{
      res.status(200).json({
         message: 'success',
         posts: fetchedPosts,
         maxPosts:count
      })
   })

})

router.post('/', multer({ storage: storage }).single('image'), (req, res) => {
   const url = req.protocol + '://' + req.get('host')
   Post.create({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + '/images/' + req.file.filename
   }).then((createdPost) => {
      res.status(201).json(
         {
            massage: "post added successfully",
            post: {
               ...createdPost,
               id: createdPost._id
            }
         }
      )
   })


})

router.delete('/:id', (req, res) => {

   //delete in course way
   // Post.deleteOne({ _id: req.params.id })

   Post.findByIdAndDelete(req.params.id).then(() => {
      res.status(204).json({
         massage: "post deleted"
      })
   })
})

router.put('/:id', multer({ storage: storage }).single('image'), (req, res) => {
   //update course way
   /*
   const post=new Post({
         title:req.body.title,
      content:req.body.content
   })
      Post.updateOne({_id:req.params.id},post)
   */
   let imagePath = req.body.imagePath
   if (req.file) {
      const url = req.protocol + '://' + req.get('host');
      imagePath = url + '/images/' + req.file.filename
   }

   Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      content: req.body.content,
      imagePath:imagePath
   }).then((result) => {
      res.status(200).json({
         message: 'update successful'
      })
   })
})

router.get('/:id', (req, res) => {
   Post.findById(req.params.id).then(post => {
      if (post) {
         res.status(200).json(post)
      } else {
         res.status(404).json({ massage: "post not found" })
      }
   })
})
module.exports = router

