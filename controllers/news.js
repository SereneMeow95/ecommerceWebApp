const formidable = require('formidable');
const _ = require("lodash");
const fs = require('fs');
const News = require('../models/news');
const {errorHandler} = require('../helpers/dbErrorHandler');

exports.newsById = (req, res, next, id) => {
    News.findById(id)
        .exec((err, news) => {
            if(err || !news) {
                console.log("NEWS NOT FOUND", err)
                return res.status(400).json({
                    error: "News not found!"
                });
            }
            req.news = news;
            next();
        });
};

exports.read = (req, res) => {
    req.news.photo = undefined;
    return res.json(req.news);
}

//create new product
exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if(err) {
            return res.status(400).json({
                error: 'Image could not be uploaded.'
            });
        }

        //check for all fields
        const {newsTitle, description} = fields;

        if (!newsTitle || !description) {
            return res.status(400).json({
                error: "All fields are required."
            });
        }

        let news = new News(fields);

        //restrict photo size
        if (files.photo) {
            if (files.photo.size > 10000000) {
                return res.status(400).json({
                    error: "Image should be lesser than 1mb in size."
                });
            }
            news.photo.data = fs.readFileSync(files.photo.path);
            news.photo.contentType = files.photo.type;
        }

        news.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
};

exports.remove = (req, res) => {
    let news = req.news
    news.remove((err, deletedNews) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: "News deleted successfully."
        });
    });
};

exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if(err) {
            return res.status(400).json({
                error: 'Image could not be uploaded.'
            });
        }

        let news = req.news;
        news = _.extend(news, fields);

        //restrict photo size
        if (files.photo) {
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: "Image should be lesser than 1mb in size."
                });
            }
            news.photo.data = fs.readFileSync(files.photo.path);
            news.photo.contentType = files.photo.type;
        }

        news.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
};

/*
*arrival
* by arrival = /products?sortBy=createdAt&order=desc&limit=4
* if no params are sent, then all products are returned
 */

//return and list the product based on req query
exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    // let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    News.find()
        .select("-photo")
        .sort([[sortBy, order]])
        // .limit(limit)
        .exec((err, news) =>{
            if (err){
                return res.status(400).json({
                    error: "News not found."
                });
            }
            res.json(news);
        });
};

/*
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */

// exports.listBySearch = (req, res) => {
//     let order = req.body.order ? req.body.order : "desc";
//     let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
//     let limit = req.body.limit ? parseInt(req.body.limit) : 100;
//     let skip = parseInt(req.body.skip);
//     let findArgs = {};
//
//     for (let key in req.body.filters) {
//         if (req.body.filters[key].length > 0) {
//             if (key === "price") {
//                 // gte -  greater than price [0-10]
//                 // lte - less than
//                 findArgs[key] = {
//                     $gte: req.body.filters[key][0],
//                     $lte: req.body.filters[key][1]
//                 };
//             } else {
//                 findArgs[key] = req.body.filters[key];
//             }
//         }
//     }
//
//     Product.find(findArgs)
//         .select("-photo")
//         .populate("category")
//         .sort([[sortBy, order]])
//         .skip(skip)
//         .limit(limit)
//         .exec((err, data) => {
//             if (err) {
//                 return res.status(400).json({
//                     error: "Products not found."
//                 });
//             }
//             res.json({
//                 size: data.length,
//                 data
//             });
//         });
// };

//return product photo
exports.photo = (req, res, next) => {
    if (req.news.photo.data){
        res.set('Content-Type', req.news.photo.contentType);
        return res.send(req.news.photo.data);
    }
    next();
};

exports.listSearch = (req, res) => {
    //create query object to hold search value and category value
    const query = {};

    //assign search value to query.name
    if(req.query.search) {
        query.name = {$regex: req.query.search, $options: 'i'};

        //find the product based on query object with 2 properties
        //search and category
        News.find(query, (err, news) => {
            if(err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(news);
        }).select('-photo');
    }
};