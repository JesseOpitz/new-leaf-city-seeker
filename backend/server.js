
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

console.log('🚀 =========================');
console.log('🚀 SERVER STARTING UP');
console.log('🚀 =========================');
console.log('🚀 Node version:', process.version);
console.log('🚀 Environment:', process.env.NODE_ENV || 'development');
console.log('🚀 Port:', PORT);
console.log('🚀 OpenAI API Key present:', !!process.env.BACKEND_OPENAI_API_KEY);
console.log('🚀 Email user present:', !!process.env.EMAIL_USER);
console.log('🚀 Email pass present:', !!process.env.EMAIL_PASS);
console.log('🚀 Allowed origin:', process.env.ALLOWED_ORIGIN || 'https://new-leaf.net');

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX) || 10, // limit each IP to requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
  handler: (req, res) => {
    console.log('⚠️ Rate limit exceeded for IP:', req.ip);
    res.status(429).json({ error: 'Too many requests, please try again later.' });
  }
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

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📥 ${new Date().toISOString()} - ${req.method} ${req.path} from ${req.ip}`);
  console.log(`📥 Headers:`, req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`📥 Body:`, JSON.stringify(req.body, null, 2));
  }
  next();
});

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
  console.log('💓 Health check requested');
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Serve static files from downloads directory
app.use('/downloads', express.static(path.join(__dirname, 'downloads')));

// Routes
app.use('/api', planGeneratorRoutes);

// 404 handler
app.use('*', (req, res) => {
  console.log(`❌ 404 - Endpoint not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('❌ =========================');
  console.error('❌ GLOBAL ERROR HANDLER');
  console.error('❌ =========================');
  console.error('❌ Error type:', error.constructor.name);
  console.error('❌ Error message:', error.message);
  console.error('❌ Error stack:', error.stack);
  console.error('❌ Request path:', req.path);
  console.error('❌ Request method:', req.method);
  
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
    console.log('✅ File cleanup job started');
    
    app.listen(PORT, () => {
      console.log('🚀 =========================');
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 CORS enabled for: ${corsOptions.origin}`);
      console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('🚀 Server ready to accept requests');
      console.log('🚀 =========================');
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
