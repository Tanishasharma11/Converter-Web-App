const express = require('express');
const path = require('path');
const multer = require('multer');

const app = express();
const port = 3000;

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads')); // Adjusting the path for uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Serve static files with correct MIME types
app.use(express.static(path.join(__dirname, '../public'), { // Adjusting the path for public folder
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'text/javascript');
    } else if (path.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html');
    }
  }
}));

// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html')); // Adjusting the path for index.html
});

// File upload endpoint
app.post('/upload', upload.fields([{ name: 'audioFile' }, { name: 'imageFile' }]), (req, res) => {
  // File upload logic here
  res.json({ message: 'Files uploaded successfully' });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
