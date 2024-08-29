// app.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/pdb');
const userRoutes = require('./routes/profiles');
const blogRoutes = require('./routes/blogposts'); 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

connectDB();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.use('/api/users', upload.single('profilePicture'), userRoutes);
app.use('/api/blogposts', upload.array('files'), blogRoutes); 

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
