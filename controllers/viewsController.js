const Tour = require("../models/tourModel");
const catchAsync = require("../error-handlers/catchAsync");

const getOverview = catchAsync( async (req, res, next) => {
    // 1) Get our tours data from the tour collection
    const tours = await Tour.find();
    res.status(200).render('overview', {
        title: 'All Tours',
        tours
    })
});
const getTour = (req, res) => {
    res.status(200).render('tour', {
        title: 'The Forest Hiker Tour',
    });
};

module.exports = {getOverview, getTour}
