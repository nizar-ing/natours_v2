const catchAsync = require("../error-handlers/catchAsync");
const Review = require("../models/reviewModel");
const {deleteOne} = require("./handlerFactory");


const getAllReviews = catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = {tour: req.params.tourId};
    const reviews = await Review.find(filter);

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews
        }
    });
});

const createReview = catchAsync(async (req, res, next) => {
    // Allow nested routes
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.author) req.body.author = req.user.id;
    const newReview = await Review.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            review: newReview
        }
    });
});

const deleteReviewById = deleteOne(Review);

module.exports = {getAllReviews, createReview, deleteReviewById};
