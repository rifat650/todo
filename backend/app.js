const path=require('path');
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const postRoutes=require('./routes/posts')
mongoose.connect(process.env.DB_CONN_STR).then(() => {
   console.log('db connected successfully')
}).catch((err) => { console.log('connection failed') })


app.use(express.json())
app.use(cors())
app.use('/images/',express.static(path.join('backend/images')))
//access req body course way
/*
//-----need to install body parser-----
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))
*/
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
app.use('/api/posts',postRoutes);

module.exports = app;
