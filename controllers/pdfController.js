const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const libreoffice = require('libreoffice-convert');
const { promisify } = require('util');
const libreofficeConvert = promisify(libreoffice.convert);

// Helper function to clean up temporary files
const cleanupFiles = (files) => {
    files.forEach(file => {
        if (fs.existsSync(file)) {
            try {
                fs.unlinkSync(file);
            } catch (error) {
                console.error(`Error deleting file ${file}:`, error);
            }
        }
    });
};

// Merge multiple PDFs into one
const mergePDFs = async (req, res) => {
    try {
        if (!req.files || req.files.length < 2) {
            return res.status(400).json({ 
                error: 'At least 2 PDF files are required for merging' 
            });
        }

        const mergedPdf = await PDFDocument.create();
        
        for (const file of req.files) {
            const pdfBytes = fs.readFileSync(file.path);
            const pdf = await PDFDocument.load(pdfBytes);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        const mergedPdfBytes = await mergedPdf.save();
        
        // Clean up uploaded files
        cleanupFiles(req.files.map(file => file.path));

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="merged.pdf"');
        res.send(Buffer.from(mergedPdfBytes));

    } catch (error) {
        console.error('Error merging PDFs:', error);
        
        // Clean up files on error
        if (req.files) {
            cleanupFiles(req.files.map(file => file.path));
        }
        
        res.status(500).json({ 
            error: 'Failed to merge PDFs',
            details: error.message 
        });
    }
};

// Compress a single PDF
const compressPDF = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                error: 'PDF file is required for compression' 
            });
        }

        const pdfBytes = fs.readFileSync(req.file.path);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        
        // For now, just return the original PDF
        // In a real implementation, you would add compression logic here
        const compressedPdfBytes = await pdfDoc.save();
        
        // Clean up uploaded file
        cleanupFiles([req.file.path]);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="compressed.pdf"');
        res.send(Buffer.from(compressedPdfBytes));

    } catch (error) {
        console.error('Error compressing PDF:', error);
        
        // Clean up file on error
        if (req.file) {
            cleanupFiles([req.file.path]);
        }
        
        res.status(500).json({ 
            error: 'Failed to compress PDF',
            details: error.message 
        });
    }
};

// PDF to Word conversion
const pdfToWord = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                error: 'PDF file is required for conversion' 
            });
        }

        const inputPath = req.file.path;
        const outputPath = inputPath.replace('.pdf', '.docx');
        
        const pdfBuffer = fs.readFileSync(inputPath);
        const docxBuffer = await libreofficeConvert(pdfBuffer, '.pdf', '.docx');
        
        // Clean up uploaded file
        cleanupFiles([inputPath]);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', 'attachment; filename="converted.docx"');
        res.send(docxBuffer);

    } catch (error) {
        console.error('Error converting PDF to Word:', error);
        
        // Clean up file on error
        if (req.file) {
            cleanupFiles([req.file.path]);
        }
        
        res.status(500).json({ 
            error: 'Failed to convert PDF to Word',
            details: error.message 
        });
    }
};

// PDF to PowerPoint conversion
const pdfToPowerPoint = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                error: 'PDF file is required for conversion' 
            });
        }

        const inputPath = req.file.path;
        const pdfBuffer = fs.readFileSync(inputPath);
        const pptxBuffer = await libreofficeConvert(pdfBuffer, '.pdf', '.pptx');
        
        // Clean up uploaded file
        cleanupFiles([inputPath]);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
        res.setHeader('Content-Disposition', 'attachment; filename="converted.pptx"');
        res.send(pptxBuffer);

    } catch (error) {
        console.error('Error converting PDF to PowerPoint:', error);
        
        // Clean up file on error
        if (req.file) {
            cleanupFiles([req.file.path]);
        }
        
        res.status(500).json({ 
            error: 'Failed to convert PDF to PowerPoint',
            details: error.message 
        });
    }
};

// PDF to Excel conversion
const pdfToExcel = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                error: 'PDF file is required for conversion' 
            });
        }

        const inputPath = req.file.path;
        const pdfBuffer = fs.readFileSync(inputPath);
        const xlsxBuffer = await libreofficeConvert(pdfBuffer, '.pdf', '.xlsx');
        
        // Clean up uploaded file
        cleanupFiles([inputPath]);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="converted.xlsx"');
        res.send(xlsxBuffer);

    } catch (error) {
        console.error('Error converting PDF to Excel:', error);
        
        // Clean up file on error
        if (req.file) {
            cleanupFiles([req.file.path]);
        }
        
        res.status(500).json({ 
            error: 'Failed to convert PDF to Excel',
            details: error.message 
        });
    }
};

// Word to PDF conversion
const wordToPdf = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                error: 'Word file is required for conversion' 
            });
        }

        const inputPath = req.file.path;
        const wordBuffer = fs.readFileSync(inputPath);
        const pdfBuffer = await libreofficeConvert(wordBuffer, '.docx', '.pdf');
        
        // Clean up uploaded file
        cleanupFiles([inputPath]);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="converted.pdf"');
        res.send(pdfBuffer);

    } catch (error) {
        console.error('Error converting Word to PDF:', error);
        
        // Clean up file on error
        if (req.file) {
            cleanupFiles([req.file.path]);
        }
        
        res.status(500).json({ 
            error: 'Failed to convert Word to PDF',
            details: error.message 
        });
    }
};

// PowerPoint to PDF conversion
const powerPointToPdf = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                error: 'PowerPoint file is required for conversion' 
            });
        }

        const inputPath = req.file.path;
        const pptxBuffer = fs.readFileSync(inputPath);
        const pdfBuffer = await libreofficeConvert(pptxBuffer, '.pptx', '.pdf');
        
        // Clean up uploaded file
        cleanupFiles([inputPath]);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="converted.pdf"');
        res.send(pdfBuffer);

    } catch (error) {
        console.error('Error converting PowerPoint to PDF:', error);
        
        // Clean up file on error
        if (req.file) {
            cleanupFiles([req.file.path]);
        }
        
        res.status(500).json({ 
            error: 'Failed to convert PowerPoint to PDF',
            details: error.message 
        });
    }
};

// Excel to PDF conversion
const excelToPdf = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                error: 'Excel file is required for conversion' 
            });
        }

        const inputPath = req.file.path;
        const xlsxBuffer = fs.readFileSync(inputPath);
        const pdfBuffer = await libreofficeConvert(xlsxBuffer, '.xlsx', '.pdf');
        
        // Clean up uploaded file
        cleanupFiles([inputPath]);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="converted.pdf"');
        res.send(pdfBuffer);

    } catch (error) {
        console.error('Error converting Excel to PDF:', error);
        
        // Clean up file on error
        if (req.file) {
            cleanupFiles([req.file.path]);
        }
        
        res.status(500).json({ 
            error: 'Failed to convert Excel to PDF',
            details: error.message 
        });
    }
};

// JPG to PDF conversion
const jpgToPdf = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ 
                error: 'At least one image file is required for conversion' 
            });
        }

        const pdfDoc = await PDFDocument.create();
        
        for (const file of req.files) {
            const imageBytes = fs.readFileSync(file.path);
            let image;
            
            // Determine image type and embed accordingly
            if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
                image = await pdfDoc.embedJpg(imageBytes);
            } else if (file.mimetype === 'image/png') {
                image = await pdfDoc.embedPng(imageBytes);
            } else {
                // For other formats, try to embed as PNG
                image = await pdfDoc.embedPng(imageBytes);
            }
            
            const page = pdfDoc.addPage([image.width, image.height]);
            page.drawImage(image, {
                x: 0,
                y: 0,
                width: image.width,
                height: image.height,
            });
        }

        const pdfBytes = await pdfDoc.save();
        
        // Clean up uploaded files
        cleanupFiles(req.files.map(file => file.path));

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="converted.pdf"');
        res.send(Buffer.from(pdfBytes));

    } catch (error) {
        console.error('Error converting images to PDF:', error);
        
        // Clean up files on error
        if (req.files) {
            cleanupFiles(req.files.map(file => file.path));
        }
        
        res.status(500).json({ 
            error: 'Failed to convert images to PDF',
            details: error.message 
        });
    }
};

// PDF to JPG conversion
const pdfToJpg = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                error: 'PDF file is required for conversion' 
            });
        }

        // For PDF to JPG, we'll use LibreOffice to convert to images
        const inputPath = req.file.path;
        const pdfBuffer = fs.readFileSync(inputPath);
        const jpgBuffer = await libreofficeConvert(pdfBuffer, '.pdf', '.jpg');
        
        // Clean up uploaded file
        cleanupFiles([inputPath]);

        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Content-Disposition', 'attachment; filename="converted.jpg"');
        res.send(jpgBuffer);

    } catch (error) {
        console.error('Error converting PDF to JPG:', error);
        
        // Clean up file on error
        if (req.file) {
            cleanupFiles([req.file.path]);
        }
        
        res.status(500).json({ 
            error: 'Failed to convert PDF to JPG',
            details: error.message 
        });
    }
};

module.exports = {
    mergePDFs,
    compressPDF,
    pdfToWord,
    pdfToPowerPoint,
    pdfToExcel,
    wordToPdf,
    powerPointToPdf,
    excelToPdf,
    jpgToPdf,
    pdfToJpg
}; 