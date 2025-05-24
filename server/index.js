const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const { Server } = require('socket.io');
const http = require('http');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://yadavsk07.github.io"],
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes
// Auth routes
app.post('/api/register', async (req, res) => {
  const { email, password, userType } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = require('crypto').randomUUID();

  db.query(
    'INSERT INTO users (id, email, password, user_type) VALUES (?, ?, ?, ?)',
    [userId, email, hashedPassword, userType],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Registration failed' });
      }
      res.status(201).json({ message: 'User registered successfully' });
    }
  );
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  db.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    async (err, results) => {
      if (err || results.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = results[0];
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, userType: user.user_type },
        process.env.JWT_SECRET
      );

      res.json({ token });
    }
  );
});

// Profile routes
app.post('/api/profile', authenticateToken, upload.single('profileImage'), (req, res) => {
  console.log('Received profile creation request:', {
    body: req.body,
    file: req.file,
    user: req.user
  });

  const { organizationName, contactNumber, aboutOrganization, organizationType, location, website, previously_sponsored_events } = req.body;
  const profileImage = req.file ? `/uploads/${req.file.filename}` : null;
  const userId = req.user.id;

  console.log('Processed profile data:', {
    userId,
    organizationName,
    contactNumber,
    aboutOrganization,
    organizationType,
    location,
    website,
    profileImage,
    previously_sponsored_events,
    userType: req.user.userType
  });

  const table = req.user.userType === 'organizer' ? 'organizers' : 'sponsors';
  
  let query;
  let values;

  if (req.user.userType === 'sponsor') {
    query = `INSERT INTO ${table} (user_id, organization_name, contact_number, about_organization, organization_type, location, website, profile_image, previously_sponsored_events) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
     organization_name = VALUES(organization_name),
     contact_number = VALUES(contact_number),
     about_organization = VALUES(about_organization),
     organization_type = VALUES(organization_type),
     location = VALUES(location),
     website = VALUES(website),
     profile_image = VALUES(profile_image),
     previously_sponsored_events = VALUES(previously_sponsored_events)`;
    values = [
      userId,
      organizationName || '',
      contactNumber || '',
      aboutOrganization || '',
      organizationType || '',
      location || '',
      website || '',
      profileImage,
      previously_sponsored_events || ''
    ];
  } else {
    query = `INSERT INTO ${table} (user_id, organization_name, contact_number, about_organization, organization_type, location, website, profile_image) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
     organization_name = VALUES(organization_name),
     contact_number = VALUES(contact_number),
     about_organization = VALUES(about_organization),
     organization_type = VALUES(organization_type),
     location = VALUES(location),
     website = VALUES(website),
     profile_image = VALUES(profile_image)`;
    values = [
      userId,
      organizationName || '',
      contactNumber || '',
      aboutOrganization || '',
      organizationType || '',
      location || '',
      website || '',
      profileImage
    ];
  }

  console.log('Executing query:', query);
  console.log('With values:', values);

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        error: 'Profile creation failed',
        details: err.message,
        code: err.code
      });
    }

    // Return the created profile data with full image URL
    const responseData = {
      message: 'Profile created successfully',
      profile: {
        ...req.body,
        profile_image: profileImage ? `http://localhost:5000${profileImage}` : null
      }
    };
    
    console.log('Sending response:', responseData);
    res.status(201).json(responseData);
  });
});

app.get('/api/profile', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const table = req.user.userType === 'organizer' ? 'organizers' : 'sponsors';

  console.log('Fetching profile for user:', { userId, table });

  db.query(
    `SELECT * FROM ${table} WHERE user_id = ?`,
    [userId],
    (err, results) => {
      if (err) {
        console.error('Error fetching profile:', err);
        return res.status(500).json({ error: 'Failed to fetch profile' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Profile not found' });
      }

      // Add full URL to profile image
      const profileData = {
        ...results[0],
        profile_image: results[0].profile_image ? `http://localhost:5000${results[0].profile_image}` : null
      };

      console.log('Sending profile data:', profileData);
      res.json(profileData);
    }
  );
});

// Posts routes
app.post('/api/posts', authenticateToken, upload.single('image'), (req, res) => {
  console.log('Received post request:', {
    body: req.body,
    file: req.file,
    user: req.user
  });

  const content = req.body.content || '';
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  const postId = require('crypto').randomUUID();
  const userId = req.user.id;

  // First, get the user's profile data
  const table = req.user.userType === 'organizer' ? 'organizers' : 'sponsors';
  
  db.query(
    `SELECT organization_name, profile_image FROM ${table} WHERE user_id = ?`,
    [userId],
    (err, profileResults) => {
      if (err) {
        console.error('Error fetching profile:', err);
        return res.status(500).json({ error: 'Failed to get profile data' });
      }

      // Then create the post
      const query = 'INSERT INTO posts (id, author_id, content, image_url, created_at) VALUES (?, ?, ?, ?, NOW())';
      const values = [postId, userId, content, imageUrl];

      console.log('Executing post query:', query);
      console.log('With values:', values);

      db.query(query, values, (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ 
            error: 'Post creation failed',
            details: err.message,
            code: err.code
          });
        }
        
        // Emit new post with profile data
        const profileData = profileResults[0] || {};
        const profileImageUrl = profileData.profile_image ? `http://localhost:5000${profileData.profile_image}` : null;
        
        const newPost = {
          id: postId,
          author_id: userId,
          content: content,
          image_url: imageUrl ? `http://localhost:5000${imageUrl}` : null,
          organization_name: profileData.organization_name,
          profile_image: profileImageUrl,
          created_at: new Date()
        };

        console.log('Emitting new post:', newPost);
        io.emit('newPost', newPost);
        
        res.status(201).json({ message: 'Post created successfully', post: newPost });
      });
    }
  );
});

app.get('/api/posts', (req, res) => {
  db.query(
    `SELECT p.*, u.email, 
     COALESCE(o.organization_name, s.organization_name) as organization_name,
     COALESCE(o.profile_image, s.profile_image) as profile_image
     FROM posts p 
     JOIN users u ON p.author_id = u.id 
     LEFT JOIN organizers o ON u.id = o.user_id 
     LEFT JOIN sponsors s ON u.id = s.user_id
     ORDER BY p.created_at DESC`,
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to fetch posts' });
      }
      
      // Add full URLs to image paths
      const postsWithFullUrls = results.map(post => ({
        ...post,
        image_url: post.image_url ? `http://localhost:5000${post.image_url}` : null,
        profile_image: post.profile_image ? `http://localhost:5000${post.profile_image}` : null
      }));
      
      res.json(postsWithFullUrls);
    }
  );
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 