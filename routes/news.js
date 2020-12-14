const express = require('express');
const router = express.Router();

const {
    create,
    newsById,
    read,
    remove,
    update,
    list,
    // listBySearch,
    photo,
    listSearch
} = require('../controllers/news');
const {requireSignin, isAuth, isAdmin} = require('../controllers/auth');
const {userById} = require('../controllers/user');

router.get('/news/:newsId', read); //get a single product
router.post('/news/create/:userId', requireSignin, isAuth, isAdmin, create);
router.delete('/news/:newsId/:userId', requireSignin, isAuth, isAdmin, remove);
router.put('/news/:newsId/:userId', requireSignin, isAuth, isAdmin, update);

router.get('/news', list);
router.get('/news/search', listSearch);
// router.post('/news/by/search', listBySearch);
router.get('/news/photo/:newsId', photo);

router.param('userId', userById);
router.param('newsId', newsById);

module.exports = router;