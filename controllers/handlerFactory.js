const catchAsync = require("../error-handlers/catchAsync");
const AppError = require("../utils/appError");
const Tour = require("../models/tourModel");

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

const createOne = (Model) => catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            data: doc
        }
    })

})

module.exports = {deleteOne, updateOne, createOne}

