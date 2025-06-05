
const fs = require('fs').promises;
const path = require('path');
const cron = require('node-cron');

/**
 * Delete files older than specified age (in minutes)
 */
const deleteOldFiles = async (directory, maxAgeMinutes = 30) => {
  try {
    const files = await fs.readdir(directory);
    const now = Date.now();
    const maxAge = maxAgeMinutes * 60 * 1000; // Convert to milliseconds
    
    let deletedCount = 0;
    
    for (const file of files) {
      const filePath = path.join(directory, file);
      
      try {
        const stats = await fs.stat(filePath);
        const fileAge = now - stats.mtime.getTime();
        
        if (fileAge > maxAge) {
          await fs.unlink(filePath);
          deletedCount++;
          console.log(`🗑️ Deleted old file: ${file}`);
        }
      } catch (error) {
        console.error(`❌ Error processing file ${file}:`, error);
      }
    }
    
    if (deletedCount > 0) {
      console.log(`✅ Cleanup completed: ${deletedCount} files deleted from ${directory}`);
    }
    
  } catch (error) {
    console.error(`❌ Error during cleanup of ${directory}:`, error);
  }
};

/**
 * Start the file cleanup cron job
 */
const cleanupOldFiles = () => {
  // Run every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    console.log('🧹 Starting scheduled file cleanup...');
    
    const tempDir = path.join(__dirname, '..', 'temp');
    const downloadsDir = path.join(__dirname, '..', 'downloads');
    
    await deleteOldFiles(tempDir, 30);
    await deleteOldFiles(downloadsDir, 30);
    
    console.log('✅ Scheduled cleanup completed');
  });
  
  console.log('⏰ File cleanup job scheduled (every 30 minutes)');
};

/**
 * Manual cleanup function for immediate use
 */
const runManualCleanup = async () => {
  console.log('🧹 Running manual file cleanup...');
  
  const tempDir = path.join(__dirname, '..', 'temp');
  const downloadsDir = path.join(__dirname, '..', 'downloads');
  
  await deleteOldFiles(tempDir, 30);
  await deleteOldFiles(downloadsDir, 30);
  
  console.log('✅ Manual cleanup completed');
};

module.exports = {
  cleanupOldFiles,
  runManualCleanup,
  deleteOldFiles
};
