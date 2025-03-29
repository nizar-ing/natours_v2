const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
        review: {
            type: String,
            required: [true, "Review is required and cannot be empty"],
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        tour: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tour',
            required: [true, 'A Review must belong to a Tour']
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'A Review must belong to an author User']
        }
    },
    {
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        }
    });

reviewSchema.pre(/^find/, function (next) {
    // this.populate({
    //     path: 'tour',
    //     select: 'name'
    // }).populate({
    //     path: 'author',
    //     select: 'name photo'
    // });
    this.populate({
        path: 'author',
        select: 'name photo'
    });
    next();
})


const Review = mongoose.model('Review', reviewSchema);


module.exports = Review;
