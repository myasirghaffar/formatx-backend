const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const pdfController = require('../controllers/pdfController');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Allow PDF files for PDF operations
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        }
        // Allow Word documents
        else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
                 file.mimetype === 'application/msword') {
            cb(null, true);
        }
        // Allow PowerPoint files
        else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || 
                 file.mimetype === 'application/vnd.ms-powerpoint') {
            cb(null, true);
        }
        // Allow Excel files
        else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                 file.mimetype === 'application/vnd.ms-excel') {
            cb(null, true);
        }
        // Allow image files
        else if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Invalid file type!'), false);
        }
    },
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    }
});

// PDF Operations
router.post('/merge', upload.array('files', 10), pdfController.mergePDFs);
router.post('/compress', upload.single('file'), pdfController.compressPDF);

// PDF to Office conversions
router.post('/pdf-to-word', upload.single('file'), pdfController.pdfToWord);
router.post('/pdf-to-powerpoint', upload.single('file'), pdfController.pdfToPowerPoint);
router.post('/pdf-to-excel', upload.single('file'), pdfController.pdfToExcel);

// Office to PDF conversions
router.post('/word-to-pdf', upload.single('file'), pdfController.wordToPdf);
router.post('/powerpoint-to-pdf', upload.single('file'), pdfController.powerPointToPdf);
router.post('/excel-to-pdf', upload.single('file'), pdfController.excelToPdf);

// Image conversions
router.post('/jpg-to-pdf', upload.array('files', 10), pdfController.jpgToPdf);
router.post('/pdf-to-jpg', upload.single('file'), pdfController.pdfToJpg);

// Health check
router.get('/health', (req, res) => {
    res.json({ status: 'PDF routes working' });
});

module.exports = router; 