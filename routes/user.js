const express = require('express');
const router = express.Router();

const {requireSignin, isAuth, isAdmin} = require('../controllers/auth');

const {userById, read, update, purchaseHistory} = require('../controllers/user');

//const{sayHi} = require("../controllers/user");
//router.get("/", sayHi);

router.get('/secret/:userId', requireSignin, isAuth, isAdmin, (req, res) => {
    res.json({
        user: req.profile
    });
});

//see and update the profile
router.get('/user/:userId', requireSignin, isAuth, read);
router.put('/user/:userId', requireSignin, isAuth, update);
router.get('/orders/by/user/:userId', requireSignin, isAuth, purchaseHistory);


//everytime theres a userID in the route parameter, this method will run and make user info available in the request object
router.param('userId', userById);

module.exports = router;