const express = require('express');
const {
    getAllReviews,
    createReview,
    deleteReviewById,
    updateReviewById,
    setTourUserIds,
    getReviewById
} = require('../controllers/reviewController');
const {protect, restrictTo} = require("../controllers/authController");
const reviewRouter = express.Router({mergeParams: true});

// Here with reviews we have to exploit all resources after authentication.
reviewRouter.use(protect);

// it handles both urls: POST /tours/46wed8744dddd4/reviews or: POST /reviews
//  GET /tours/fg564trz546484/reviews
reviewRouter.route('/')
    .get(getAllReviews)
    .post(restrictTo('user'), setTourUserIds, createReview);

reviewRouter.route('/:id')
    .get(getReviewById)
    .patch(restrictTo('user', 'admin'), updateReviewById)
    .delete(restrictTo('user', 'admin'), deleteReviewById);

module.exports = reviewRouter;
