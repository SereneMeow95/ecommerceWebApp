const User = require('../models/user');

//signup is a method that can be used in routes
exports.signup = (req, res) => {
    //console.log('req.body', req.body);
    const user = new User(req.body);
    user.save((err, user) => {
        if(err){
            return res.status(400).json({
                err
            });
        }
        res.json({
            user
        });
    });
};