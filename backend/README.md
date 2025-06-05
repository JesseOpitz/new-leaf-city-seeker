
# New Leaf Backend Service

A production-ready Node.js backend service that generates personalized moving plans using OpenAI and delivers them via email or download links.

## Features

- 🤖 AI-powered personalized moving plans using OpenAI GPT-4
- 📧 Email delivery with PDF attachments using Nodemailer
- 📄 High-quality PDF generation with Puppeteer
- 🔒 Security features (CORS, rate limiting, input validation)
- 🧹 Automatic file cleanup to prevent disk bloat
- ⚡ Health checks and error handling
- 🚀 Production-ready configuration

## API Endpoints

### POST /api/generate-plan
Generates a personalized moving plan based on user input.

**Request Body:**
```json
{
  "city": "Honolulu, Hawaii",
  "email": "user@example.com",
  "questionnaire": {
    "movingDate": "August 2025",
    "budget": "$2500/month",
    "householdSize": 3,
    "income": "$90,000/year",
    "reason": "Better job opportunities"
  }
}
```

**Response (with email):**
```json
{
  "success": true,
  "message": "Your personalized moving plan for Honolulu, Hawaii has been sent to user@example.com",
  "city": "Honolulu, Hawaii"
}
```

**Response (without email):**
```json
{
  "success": true,
  "message": "Your personalized moving plan for Honolulu, Hawaii is ready for download",
  "downloadUrl": "/downloads/moving-plan-honolulu-hawaii.pdf",
  "city": "Honolulu, Hawaii",
  "filename": "moving-plan-honolulu-hawaii.pdf"
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

### GET /downloads/:filename
Serves generated PDF files for download (files auto-expire after 30 minutes).

## Environment Variables

Create a `.env` file in the backend directory:

```bash
# OpenAI Configuration
BACKEND_OPENAI_API_KEY=your_openai_api_key_here

# Email Configuration (Gmail recommended)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here

# Server Configuration
PORT=8080
NODE_ENV=production

# CORS Configuration
ALLOWED_ORIGIN=https://new-leaf.net
```

## Local Development

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your actual values
```

3. **Run locally:**
```bash
npm run dev
```

4. **Test the health endpoint:**
```bash
curl http://localhost:8080/health
```

## Production Deployment (Render)

1. **Create a new Web Service on Render**
2. **Configure the service:**
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Node Version:** 18+

3. **Set environment variables in Render:**
   - `BACKEND_OPENAI_API_KEY`
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - `NODE_ENV=production`
   - `ALLOWED_ORIGIN=https://new-leaf.net`

4. **Deploy:** Render will automatically build and deploy your service.

## Email Setup (Gmail)

1. **Enable 2FA** on your Gmail account
2. **Generate an App Password:**
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password as `EMAIL_PASS`

## Security Features

- **Rate Limiting:** 10 requests per 15 minutes per IP
- **Input Validation:** Comprehensive validation using Joi
- **CORS Protection:** Configured for specific origins
- **Helmet:** Security headers for Express
- **File Sanitization:** Prevents path traversal attacks
- **Error Handling:** No sensitive information exposed

## File Management

- PDFs are automatically cleaned up after 30 minutes
- Temp and downloads directories are created automatically
- Cleanup runs every 30 minutes via cron job

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `400` - Invalid input/validation errors
- `500` - Server errors
- `503` - External service unavailable

## Dependencies

- **express** - Web framework
- **openai** - OpenAI API integration
- **puppeteer** - PDF generation
- **nodemailer** - Email delivery
- **joi** - Input validation
- **cors** - Cross-origin resource sharing
- **helmet** - Security middleware
- **node-cron** - Scheduled tasks
- **express-rate-limit** - Rate limiting

## Performance Considerations

- Puppeteer runs in headless mode with optimized flags
- PDF generation includes caching and optimization
- File cleanup prevents disk space issues
- Rate limiting prevents abuse
- Graceful error handling prevents crashes

## Monitoring

- Health endpoint for uptime monitoring
- Comprehensive logging for debugging
- Graceful shutdown handling
- Error tracking and reporting
