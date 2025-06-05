
const path = require('path');

/**
 * Sanitize filename to prevent path traversal and ensure valid characters
 */
const sanitizeFilename = (filename) => {
  // Remove or replace invalid characters
  return filename
    .replace(/[^a-z0-9\-_.]/gi, '-')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
};

/**
 * Escape HTML to prevent XSS attacks
 */
const escapeHtml = (unsafe) => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/**
 * Generate a unique filename with timestamp
 */
const generateUniqueFilename = (baseName, extension = '.pdf') => {
  const timestamp = Date.now();
  const sanitized = sanitizeFilename(baseName);
  return `${sanitized}-${timestamp}${extension}`;
};

/**
 * Check if email is valid format
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

module.exports = {
  sanitizeFilename,
  escapeHtml,
  generateUniqueFilename,
  isValidEmail
};
