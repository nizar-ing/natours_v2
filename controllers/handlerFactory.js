const catchAsync = require("../error-handlers/catchAsync");
const AppError = require("../utils/appError");
const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/apiFeatures");

/*
* const deleteTourById = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if(!tour){
        return next(new AppError(`No Tour found with this ID: ${req.params.id}`, 404));
    }
    res.status(204).json(
        {
            status: 'success',
            data: null
        }
    );
});
* */

const getAll = (Model) => catchAsync(async (req, res, next) => {
    // For handling reviews on a given tour
    let filter = {};
    if (req.params.tourId) filter = {tour: req.params.tourId};

    // EXECUTE THE QUERY
    const apiFeatures = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sorting()
        .fieldsSelecting()
        .paginate();

    //const docs = await apiFeatures.query.explain() for performance optimization by using indexes until just the development process not in production.
    const docs = await apiFeatures.query; // then and at the end of the day we have to execute the final query.
    res.status(200).json(
        {
            status: 'success',
            results: docs.length,
            data: {
                data: docs
            }
        }
    );
});
const getOne = (Model, populateOptions) => catchAsync(async (req, res, next) => {
    //const doc = await .populate('reviews'); // <=> Tour.findOne({_id: req.params.id})
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);
    const doc = await query;
    if (!doc) {
        // we should use return here in order to finish this current middleware immediately. We cannot have 2 responses in a single pipeline cycle.
        return next(new AppError(`No Document found with this ID: ${req.params.id}`, 404));
    }
    res.status(200).json(
        {
            status: 'success',
            data: {
                data: doc
            }
        }
    );
})
const createOne = (Model) => catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            data: doc
        }
    })

})
const updateOne = (Model) => catchAsync(async (req, res, next) => {
    const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
    if (!updatedDoc) {
        return next(new AppError(`No Document found with this ID: ${req.params.id}`, 404));
    }
    res.status(200).json(
        {
            status: 'success',
            data: {
                data: updatedDoc
            }
        }
    );
});
const deleteOne = (Model) => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
        return next(new AppError(`No document found with this ID: ${req.params.id}`, 404));
    }
    res.status(204).json(
        {
            status: 'success',
            data: null
        }
    );
});


module.exports = {deleteOne, updateOne, createOne, getOne, getAll};

