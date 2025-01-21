require('dotenv').config(); // Make sure this is at the very top

const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

// dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

console.log('Mongo URI:', process.env.MONGO_URI);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    app.listen(PORT, () => {
      console.log("Server running on http://localhost:" + process.env.PORT);

    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB Atlas:", error.message);
  });

// Define the User schema
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    mobile: String,
    password: String,
    imageUrl: String
});

const User = mongoose.model('User', userSchema);

// File Upload Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Signup Route
app.post('/signup', upload.single('image'), async (req, res) => {
    const { username, email, mobile, password } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.json({ success: false, message: 'User already exists' });
    }

    const newUser = new User({ username, email, mobile, password, imageUrl });
    await newUser.save();
    res.json({ success: true, message: 'Signup successful' });
});

// Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });

    if (!user) {
        return res.json({ success: false, message: 'Invalid credentials' });
    }

    res.json({ success: true, message: 'Login successful' });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
