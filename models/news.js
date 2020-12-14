const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema(
    {
        newsTitle: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        description: {
            type: String,
            required: true,
            maxlength: 10000
        },
        photo: {
            data: Buffer, //Buffer data type
            contentType: String
        },
    },
    {timestamps: true}
);

module.exports = mongoose.model("News", newsSchema);


