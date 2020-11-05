const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        description: {
            type: String,
            required: true,
            maxlength: 2000
        },
        price: {
            type: Number,
            trim: true,
            required: true,
            maxlength: 32
        },
        category: {
            type: ObjectId, //from mongoose schema
            ref: 'Category',
            require: true
        },
        quantity: {
            type: Number,
        },
        photo: {
            data: Buffer, //Buffer data type
            contentType: String
        },
        shipping: {
            required: false, //for this bookstore scenario, not all purchased books need to be shipped thats why he put it as false
            type: Boolean
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("Product", productSchema);


