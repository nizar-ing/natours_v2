const express = require("express");
const {getAllUsers, createNewUser, deleteUserById, getUserById, updateUserById, updateMe, deleteMe, getMe} = require("../controllers/userController");
const {signup, login, forgotPassword, resetPassword, protect, updatePassword, restrictTo} = require("../controllers/authController");

const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.post('/forgot-password', forgotPassword);
userRouter.patch('/reset-password/:token', resetPassword);

// After that we should protect our routes. Only for authenticated users. So, we can use an elegant trick for that since we already know that this module will be taken sequentially.
// that means this "protect" middleware here will be the fifth middleware in the stack before the other incoming middlewares.
userRouter.use(protect);

userRouter.patch('/update-my-password', updatePassword);

userRouter.get('/me', getMe, getUserById);
userRouter.patch('/update-me', updateMe);
userRouter.delete('/delete-me', deleteMe);

// The incoming middlewares should be restricted to the administrator.
userRouter.use(restrictTo('admin'));

userRouter.route('/')
    .get(getAllUsers)
    .post(createNewUser)

userRouter.route('/:id')
    .get(getUserById)
    .patch(updateUserById)
    .delete(deleteUserById)

module.exports = userRouter;
