const express = require('express');
const router = express.Router();
const multer = require('multer');
const { mergePDFs } = require('../controllers/mergeController');

const upload = multer({ dest: 'uploads/' });
router.post('/', upload.array('files'), mergePDFs);

module.exports = router;
