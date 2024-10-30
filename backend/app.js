const express = require('express');
const cors = require('cors');
const app = express();
const mongoose=require('mongoose');
const Post=require('./models/post')
mongoose.connect(process.env.DB_CONN_STR).then(()=>{
   console.log('db connected successfully')
}).catch((err)=>{console.log('connection failed')})
//access req body express way
app.use(express.json())

//access req body course way
/*
//-----need to install body parser-----
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))
*/
//cores problem express way solved
app.use(cors())

//cord course way solved

/*app.use((req,res,next)=>{
   res.setHeader('Access-Control-Allow-Origin','*');
   res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-with,Content-Type,Accept'
   );
   res.setHeader(
      'Access-Control-Allow-Methods','GET,POST,PATCH,PUT,DELETE,OPTIONS'
   )
})*/

app.get('/api/posts', (req, res) => {
   Post.find().then((document)=>{
      res.status(200).json({
         message: 'success',
         posts: document
      })

   })

})

app.post('/api/posts', (req, res) => {
  
Post.create({
   title:req.body.title,
   content:req.body.content
}).then((createdPost)=>{
   res.status(201).json(
      {
         massage: "post added successfully",
         postId:createdPost._id
      }
   )
})


})

app.delete('/api/posts/:id',(req,res)=>{
   
   //delete in course way
   // Post.deleteOne({ _id: req.params.id })

Post.findByIdAndDelete(req.params.id).then(()=>{
   res.status(204).json({
      massage:"post deleted"
   })
})
})


module.exports = app;
