const Post = require('./../models/post');
exports.createPost = (req, res) => {
   const url = req.protocol + '://' + req.get('host')
   Post.create({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + '/images/' + req.file.filename,
      creator: req.userData.userId
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
   }).catch(error => {
      res.status(500).json({
         message: 'creating a post failed '
      })
   })
}

exports.updatePost = async (req, res) => {
   try {
      // Handle image path
      let imagePath = req.body.imagePath;
      if (req.file) {
         const url = req.protocol + '://' + req.get('host');
         imagePath = url + '/images/' + req.file.filename;
      }

      // Validate if post ID exists
      if (!req.params.id) {
         return res.status(400).json({
            message: 'Post ID is required'
         });
      }

      // Create post object with updated data
      const post = new Post({
         _id: req.body.id,
         title: req.body.title,
         content: req.body.content,
         imagePath: imagePath,
         creator: req.userData.userId
      });

      // Try to update the post
      const result = await Post.updateOne(
         {
            _id: req.params.id,
            creator: req.userData.userId
         },
         post
      );

      // Check if post was found and user is authorized
      if (result.matchedCount > 0) {
         if (result.modifiedCount > 0) {
            return res.status(200).json({
               message: 'Update successful',
               post: post
            });
         } else {
            // If matched but not modified (no changes made)
            return res.status(200).json({
               message: 'No changes made to the post'
            });
         }
      } else {
         // If no post matched (either doesn't exist or user is not creator)
         return res.status(401).json({
            message: 'Not authorized to edit this post'
         });
      }

   } catch (error) {
      console.error('Update post error:', error);
      // Only send error response if headers haven't been sent
      if (!res.headersSent) {
         return res.status(500).json({
            message: 'Failed to update post. Please try again.'
         });
      }
   }
};
exports.getPosts = async (req, res) => {
   try {
      const pageSize = +req.query.pagesize;
      const currentPage = +req.query.page;
      const postQuery = Post.find();

      // Only apply pagination if both parameters are provided
      if (pageSize && currentPage) {
         postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
      }

      // Execute queries in parallel
      const [posts, totalPosts] = await Promise.all([
         postQuery.exec(),
         Post.countDocuments()
      ]);

      res.status(200).json({
         message: 'Posts fetched successfully',
         posts: posts,
         maxPosts: totalPosts
      });

   } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({
         message: 'Fetching posts failed'
      });
   }
};

exports.getPost = async (req, res) => {
   try {
      const post = await Post.findById(req.params.id);

      if (!post) {
         return res.status(404).json({
            message: "Post not found"
         });
      }

      return res.status(200).json(post);

   } catch (error) {
      console.error('Error fetching post:', error);
      return res.status(500).json({
         message: 'Fetching post failed'
      });
   }
};

exports.deletePost = (req, res) => {

   Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then((result) => {
      if (result.deletedCount > 0) {
         res.status(204).json({
            massage: "post deleted"
         })
      } else {
         res.status(401).json({
            message: 'Not authorized'
         })
      }
   }).catch(error => {
      res.status(500).json({
         message: 'fetching post failed'
      })
   })
}