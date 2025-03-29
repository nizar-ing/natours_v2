const catchAsync = require("../error-handlers/catchAsync");
const AppError = require("../utils/appError");

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
    if(!doc){
        return next(new AppError(`No document found with this ID: ${req.params.id}`, 404));
    }
    res.status(204).json(
        {
            status: 'success',
            data: null
        }
    );
});

module.exports = {deleteOne}

