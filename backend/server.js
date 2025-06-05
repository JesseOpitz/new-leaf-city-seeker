
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs').promises;
require('dotenv').config();

const planGeneratorRoutes = require('./routes/planGenerator');
const { cleanupOldFiles } = require('./utils/fileCleanup');

const app = express();
const PORT = process.env.PORT || 8080;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: { error: 'Too many requests, please try again later.' }
});
app.use(limiter);

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGIN || 'https://new-leaf.net',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Create temp and downloads directories if they don't exist
const initDirectories = async () => {
  try {
    await fs.mkdir(path.join(__dirname, 'temp'), { recursive: true });
    await fs.mkdir(path.join(__dirname, 'downloads'), { recursive: true });
    console.log('✅ Directories initialized');
  } catch (error) {
    console.error('❌ Error creating directories:', error);
  }
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Serve static files from downloads directory
app.use('/downloads', express.static(path.join(__dirname, 'downloads')));

// Routes
app.use('/api', planGeneratorRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('❌ Global error:', error);
  
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }
  
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Start server and initialize cleanup
const startServer = async () => {
  try {
    await initDirectories();
    
    // Start file cleanup job (runs every 30 minutes)
    cleanupOldFiles();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 CORS enabled for: ${corsOptions.origin}`);
      console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('💤 Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('💤 Received SIGINT, shutting down gracefully');
  process.exit(0);
});
