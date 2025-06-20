

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

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 10,
  message: { error: 'Too many requests, please try again later.' },
  handler: (req, res) => {
    console.log('⚠️ Rate limit exceeded for IP:', req.ip);
    res.status(429).json({ error: 'Too many requests, please try again later.' });
  }
});
app.use(limiter);

// ✅ Comprehensive CORS configuration
const allowedOrigins = [
  'https://new-leaf.net',
  'https://www.new-leaf.net',
  'http://localhost:3000',
  'http://localhost:5173' // Add Vite dev server
];

console.log('🔒 CORS allowed origins:', allowedOrigins);

// Handle preflight requests first
app.options('*', (req, res) => {
  console.log('🔍 Preflight request from origin:', req.headers.origin);
  const origin = req.headers.origin;
  
  if (!origin || allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400');
    console.log('✅ Preflight approved for origin:', origin);
    res.status(200).end();
  } else {
    console.log('❌ Preflight rejected for origin:', origin);
    res.status(403).end();
  }
});

const corsOptions = {
  origin: (origin, callback) => {
    console.log('🔍 CORS check for origin:', origin);
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('✅ No origin - allowing request');
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      console.log('✅ Origin allowed:', origin);
      callback(null, true);
    } else {
      console.warn(`⛔ CORS blocked for origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logger
app.use((req, res, next) => {
  console.log(`📥 ${new Date().toISOString()} - ${req.method} ${req.path} from ${req.ip}`);
  console.log(`📥 Origin: ${req.headers.origin}`);
  console.log(`📥 Headers:`, req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`📥 Body:`, JSON.stringify(req.body, null, 2));
  }
  next();
});

// Init temp and downloads folders
const initDirectories = async () => {
  try {
    await fs.mkdir(path.join(__dirname, 'temp'), { recursive: true });
    await fs.mkdir(path.join(__dirname, 'downloads'), { recursive: true });
    console.log('✅ Directories initialized');
  } catch (error) {
    console.error('❌ Error creating directories:', error);
  }
};

// Health check
app.get('/health', (req, res) => {
  console.log('💓 Health check requested');
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Serve PDFs
app.use('/downloads', express.static(path.join(__dirname, 'downloads')));

// API routes
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

// Start server
const startServer = async () => {
  try {
    await initDirectories();
    cleanupOldFiles();
    console.log('✅ File cleanup job started');

    app.listen(PORT, () => {
      console.log('🚀 =========================');
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 CORS enabled for: ${allowedOrigins.join(', ')}`);
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

