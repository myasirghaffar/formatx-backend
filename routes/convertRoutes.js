const express = require('express');
const router = express.Router();
const multer = require('multer');
const { pdfToDoc } = require('../controllers/convertController');

const upload = multer({ dest: 'uploads/' });
router.post('/pdf-to-word', upload.single('file'), pdfToDoc);

module.exports = router;
