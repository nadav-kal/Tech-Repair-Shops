const express = require('express');
const router = express.Router();
const techrepairs = require('../controllers/techrepairs');
const {isLoggedIn, validateTechrepair, isAuthor} = require('../middleware');
const multer = require('multer');
const {storage} = require('../cloudinary')
const upload = multer({storage});

router.route('/')
    .get(techrepairs.index)
    .post(isLoggedIn, upload.array('image'), validateTechrepair, techrepairs.createShop);

router.get('/new', isLoggedIn, techrepairs.renderNewForm);

router.route('/:id')
    .get(techrepairs.showShop)
    .put(isLoggedIn, isAuthor, upload.array('image'), validateTechrepair, techrepairs.updateShop)
    .delete(isLoggedIn, isAuthor, techrepairs.deleteShop);

router.get('/:id/edit', isLoggedIn, isAuthor, techrepairs.renderEditForm);

module.exports = router;