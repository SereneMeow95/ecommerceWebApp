const mongoose = require('mongoose');
const crypto = require('crypto'); //password hashing
const {v1: uuidv1} = require('uuid'); //generate unique string

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true
        },
        hashed_password: {
            type: String,
            trim: true,
        },
        about: {
            type: String,
            trim: true
        },
        salt: String,
        role: {
            type: Number,
            default: 0
        },
        history: {
            type: Array,
            default: []
        }
    },
    {timestamps: true}
);

//virtual field to encrypt the password and user authentication
userSchema
    .virtual('password')
    .set(function(password){ //take password
        this._password = password;
        this.salt= uuidv1();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function(){ //save the hashedpassword
        return this._password;
    });

userSchema.methods = {
    encryptPassword: function(password){
        if (!password) return "";
        try{
            return crypto
                .createHmac("sha1", this.salt)
                .update(password)
                .digest("hex");
        } catch (err){
            return "";
        }
    }
};

module.exports = mongoose.model("User", userSchema);


