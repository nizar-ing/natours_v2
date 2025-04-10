const mongoose = require("mongoose");
const Tour = require("./tourModel");
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

reviewSchema.index({tour: 1, author: 1}, {unique: true});

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

reviewSchema.statics.calcAverageRatings = async function(tourId){
    const stats = await this.aggregate([
        {
            $match: { tour: tourId}
        },
        {
            $group: {
                _id: '$tour',
                nbRating: {$sum: 1},
                avgRating: {$avg: '$rating'},

            }
        }
    ]);
    //console.log(stats);
    if(stats.length > 0){
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nbRating,
            ratingsAverage: stats[0].avgRating,
        });
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5,
        });
    }
}
reviewSchema.post('save', function () {
    // "this" points to the current Review Model
    this.constructor.calcAverageRatings(this.tour);
});

//findByIdAndUpdate + findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne();
    //console.log(this.r);
    next();
});
reviewSchema.post(/^findOneAnd/, async function () {
    // await this.findOne(); we cannot use this here since wo don't have access to the current query. the query has already executed.
    await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);


module.exports = Review;
