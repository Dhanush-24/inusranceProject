const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

// POST route to create news
router.post('/news', newsController.createNews);

// GET route to fetch all news (optional)
router.get('/news', newsController.getAllNews);

module.exports = router;
