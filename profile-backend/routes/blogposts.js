// routes/blogposts.js
const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');
const User = require('../models/Profiles');

// Create a new blog post
router.post('/', async (req, res) => {
  try {
    const { title, content, userId } = req.body;
    const files = req.files || [];

    const blogPost = new BlogPost({
      title,
      content,
      files: files.map(file => file.path),
      user: userId
    });

    const savedPost = await blogPost.save();

    res.status(201).json(savedPost);
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get all blog posts
router.get('/', async (req, res) => {
  try {
    const blogPosts = await BlogPost.find().populate('user', 'name profilePicture').exec();
    res.status(200).json(blogPosts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
