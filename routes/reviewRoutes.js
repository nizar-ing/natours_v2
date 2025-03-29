const express = require('express');
const {getAllReviews, createReview} = require('../controllers/reviewController');
const {protect, restrictTo} = require("../controllers/authController");
const reviewRouter = express.Router({mergeParams: true});

// it handles both urls: POST /tours/46wed8744dddd4/reviews or: POST /reviews
//  GET /tours/fg564trz546484/reviews
reviewRouter.route('/')
    .get(getAllReviews)
    .post(protect, restrictTo('user'), createReview)

module.exports = reviewRouter;
