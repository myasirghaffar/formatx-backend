const libre = require('libreoffice-convert');
const fs = require('fs');
const path = require('path');

libre.convertAsync = require('util').promisify(libre.convert);

exports.pdfToDoc = async (req, res) => {
  const ext = '.docx';
  const inputPath = req.file.path;
  const outputPath = `${inputPath}${ext}`;

  try {
    const file = fs.readFileSync(inputPath);
    const done = await libre.convertAsync(file, ext, undefined);
    fs.writeFileSync(outputPath, done);
    res.download(outputPath, 'converted.docx', (err) => {
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Conversion failed');
  }
};
