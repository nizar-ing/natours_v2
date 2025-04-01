const catchAsync = require("../error-handlers/catchAsync");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const {deleteOne, updateOne, getOne, getAll} = require("./handlerFactory");

const filterObj = (obj, ...allowedFields) => {
    let newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

const updateMe = catchAsync(async (req, res, next) => {
    // 1) create error if user POSTs a password data
    const {password, passwordConfirm} = req.body;
    if(password || passwordConfirm) return next(new AppError("This route is not for password updates. Please use '/update-my-password' " , 400));

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        status: "success",
        data: {
            user: updatedUser
        }
    });
});
const deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {active: false});
    res.status(204).json({
        status: "success",
        data: null
    });
});


// const getAllUsers = catchAsync(async (req, res, next) => {
//     const users = await User.find();
//     res.status(200).json({
//         status: "success",
//         results: users.length,
//         data: {
//             users
//         },
//     });
// });
const getAllUsers = getAll(User);
const getUserById = (req, res) => getOne(User);
const createNewUser = (req, res) => {
    res.status(500).json({
        status: 'Error',
        message: 'This route is not defined! Please use /signup instead',
    });
};

// const updateUserById = (req, res) => {
//     res.status(500).json({
//         status: 'Error',
//         message: 'This route is not defined yet!',
//     });
// };

// DO NOT UPDATE PASSWORDS WITH THIS!
const updateUserById = updateOne(User);


// const deleteUserById = (req, res) => {
//     res.status(500).json({
//         status: 'Error',
//         message: 'This route is not defined yet!',
//     });
// };
const deleteUserById = deleteOne(User);

module.exports = {getAllUsers, createNewUser, deleteUserById, getUserById, updateUserById, updateMe, deleteMe};
