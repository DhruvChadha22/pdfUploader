const express = require('express');
const multer = require('multer');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const router = express.Router();
const prisma = new PrismaClient();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    const { originalname, path } = req.file;

    const file = fs.readFileSync(path);

    const pdf = await prisma.PDF.create({
      data: {
        name: originalname,
        file: file,
      }
    });

    fs.unlinkSync(path);

    res.json(pdf);
  } 
  catch (err) {
    console.error(err);
    res.status(500).json({ Error: 'Failed to upload PDF' });
  }
});

router.get('/pdfs', async (req, res) => {
  try {
    const pdfs = await prisma.PDF.findMany({
      select: {
        id: true,
        name: true,
        file: true,
      },
    });

    res.json(pdfs);
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({ Error: 'Failed to fetch PDFs' });
  }
});

router.get('/pdf/:id', async (req, res) => {
    const id = req.params.id;

    try {
      const pdf = await prisma.PDF.findOne({
        where: {
            id: id
        }
      });
  
      res.json(pdf);
    } 
    catch (error) {
      console.error(error);
      res.status(500).json({ Error: 'Failed to fetch PDF' });
    }
});

router.get('/pdf', async (req, res) => {
    const name = req.body.name;

    try {
      const pdf = await prisma.PDF.findOne({
        where: {
            name: name
        }
      });
  
      res.json(pdf);
    } 
    catch (error) {
      console.error(error);
      res.status(500).json({ Error: 'Failed to fetch PDF' });
    }
});

router.get("/", (req, res) => {
  res.redirect("/login");
});

module.exports = router;