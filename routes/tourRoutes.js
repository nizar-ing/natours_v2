const express = require("express");
const {
    getAllTours,
    createNewTour,
    getTourById,
    deleteTourById,
    updateTourById,
    aliasTopTours,
    getTourStats,
    getMonthlyPlan,
    getToursWithin,
    getDistances
} = require("../controllers/tourController");
const {protect, restrictTo} = require("../controllers/authController");
const reviewRouter = require("./reviewRoutes");

const tourRouter = express.Router();

// POST => /tours/f544dfd454e44/reviews
// GET => /tours/f544dfd454e44/reviews
// GET => /tours/f544dfd454e44/reviews/ghd5647rtw15s5dt

// tourRouter.route('/:tourId/reviews') ==> Here we have a violation of concerns, review route within a tour router. We gonna use express merge params advanced feature to resole this issue.
//     .post(protect, restrictTo('user'), createReview);
tourRouter.use('/:tourId/reviews', reviewRouter);


//tourRouter.param('id', checkId);
tourRouter.route('/top-5-cheap')
    .get(aliasTopTours, getAllTours);

tourRouter.route('/tour-stats')
    .get(getTourStats);

tourRouter.route('/monthly-plan/:year')
    .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);


tourRouter.route('/tours-within/:distance/center/:latlng/unit/:unit').get(getToursWithin);
tourRouter.route('/distances/:latlng/unit/:unit').get(getDistances);


tourRouter.route('/')
    .get(getAllTours)
    .post(protect, restrictTo('admin', 'lead-guide'), createNewTour);

tourRouter.route('/:id')
    .get(getTourById)
    .patch(protect, restrictTo('admin', 'lead-guide'), updateTourById)
    .delete(protect, restrictTo('admin', 'lead-guide'), deleteTourById);


module.exports = tourRouter;
