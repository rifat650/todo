const User = require('./../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createUser = (req, res) => {
   bcrypt.hash(req.body.password, 10).then((hash) => {

      User.create({
         email: req.body.email,
         password: hash
      }).then(result => {
         res.status(201).json({
            massage: 'user created',
            result
         })
      }).catch(error => {
         res.status(500).json({
            message: 'invalid authentication credentials'
         })
      })

   })
}

exports.userLogin = async (req, res) => {
   try {
      // Check if email and password are provided
      if (!req.body.email || !req.body.password) {
         return res.status(400).json({
            message: 'Email and password are required'
         });
      }

      // Find user by email
      const user = await User.findOne({ email: req.body.email });

      // If no user found, return early
      if (!user) {
         return res.status(401).json({
            message: 'Authentication failed'
         });
      }

      // Compare passwords
      const isValidPassword = await bcrypt.compare(req.body.password, user.password);

      // If password doesn't match, return early
      if (!isValidPassword) {
         return res.status(401).json({
            message: 'Authentication failed'
         });
      }

      // Generate JWT token
      const token = jwt.sign(
         {
            email: user.email,
            userId: user._id
         },
         "secret_this_should_be_longer",
         { expiresIn: '1h' }
      );

      // Send successful response
      return res.status(200).json({
         token,
         expiresIn: 3600,
         userId: user._id
      });

   } catch (error) {
      console.error('Login error:', error);
      // Only send error response if headers haven't been sent
      if (!res.headersSent) {
         return res.status(500).json({
            message: 'Internal server error'
         });
      }
   }
};
