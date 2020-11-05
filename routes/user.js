const express = require('express');
const router = express.Router();

const {requireSignin} = require('../controllers/auth');

const {userById} = require('../controllers/user');

router.get('/secret/:userId', requireSignin, (req, res) => {
    res.json({
        user: req.profile
    });
});

//everytime theres a userID in the route parameter, this method will run and make user info available in the request object
router.param('userId', userById);

module.exports = router;