const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

exports.mergePDFs = async (req, res) => {
  try {
    const mergedPdf = await PDFDocument.create();

    for (let file of req.files) {
      const pdfBytes = fs.readFileSync(file.path);
      const pdf = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
      fs.unlinkSync(file.path); // cleanup
    }

    const pdfBytes = await mergedPdf.save();
    const outputPath = path.join(__dirname, `../uploads/merged.pdf`);
    fs.writeFileSync(outputPath, pdfBytes);

    res.download(outputPath, 'merged.pdf', () => {
      fs.unlinkSync(outputPath);
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Merging failed");
  }
};
