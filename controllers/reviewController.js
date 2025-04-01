const catchAsync = require("../error-handlers/catchAsync");
const Review = require("../models/reviewModel");
const {deleteOne, updateOne, createOne, getOne, getAll} = require("./handlerFactory");



const setTourUserIds = (req, res, next) => {
    // Allow nested routes
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.author) req.body.author = req.user.id;
    next();
}

// const getAllReviews = catchAsync(async (req, res, next) => {
//     let filter = {};
//     if (req.params.tourId) filter = {tour: req.params.tourId};
//     const reviews = await Review.find(filter);
//
//     res.status(200).json({
//         status: 'success',
//         results: reviews.length,
//         data: {
//             reviews
//         }
//     });
// });
const getAllReviews = getAll(Review);


const getReviewById = getOne(Review);
const createReview = createOne(Review);
const updateReviewById = updateOne(Review);
const deleteReviewById = deleteOne(Review);

module.exports = {getAllReviews, getReviewById, createReview, deleteReviewById, updateReviewById, setTourUserIds};
