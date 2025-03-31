const express = require('express');
const {getAllReviews, createReview, deleteReviewById, updateReviewById, setTourUserIds} = require('../controllers/reviewController');
const {protect, restrictTo} = require("../controllers/authController");
const reviewRouter = express.Router({mergeParams: true});

// it handles both urls: POST /tours/46wed8744dddd4/reviews or: POST /reviews
//  GET /tours/fg564trz546484/reviews
reviewRouter.route('/')
    .get(getAllReviews)
    .post(protect, restrictTo('user'), setTourUserIds, createReview);

reviewRouter.route('/:id')
    .patch(updateReviewById)
    .delete(deleteReviewById)

module.exports = reviewRouter;
