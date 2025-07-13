const fs = require('fs');
const path = require('path');

// Check if file exists
const fileExists = (filePath) => {
    return fs.existsSync(filePath);
};

// Get file size in bytes
const getFileSize = (filePath) => {
    if (!fileExists(filePath)) {
        throw new Error('File does not exist');
    }
    return fs.statSync(filePath).size;
};

// Get file extension
const getFileExtension = (filename) => {
    return path.extname(filename).toLowerCase();
};

// Validate PDF file
const isValidPDF = (file) => {
    return file.mimetype === 'application/pdf' && 
           getFileExtension(file.originalname) === '.pdf';
};

// Generate unique filename
const generateUniqueFilename = (originalName) => {
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1E9);
    const extension = getFileExtension(originalName);
    return `${timestamp}-${random}${extension}`;
};

// Clean up files
const cleanupFiles = (filePaths) => {
    filePaths.forEach(filePath => {
        if (fileExists(filePath)) {
            try {
                fs.unlinkSync(filePath);
            } catch (error) {
                console.error(`Error deleting file ${filePath}:`, error);
            }
        }
    });
};

// Create directory if it doesn't exist
const ensureDirectoryExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

module.exports = {
    fileExists,
    getFileSize,
    getFileExtension,
    isValidPDF,
    generateUniqueFilename,
    cleanupFiles,
    ensureDirectoryExists
}; 