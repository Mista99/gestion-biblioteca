const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

router.post('/books', bookController.createBook);
router.get('/books', bookController.getAllBooks);
router.delete('/books', bookController.deleteAllBooks);

module.exports = router;
