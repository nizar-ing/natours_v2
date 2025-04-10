const mongoose = require('mongoose');
const validator = require('validator');
const slugify = require('slugify');
const req = require("express/lib/request");

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A tour name must have less or equal then 40 characters'],
        minlength: [10, 'A tour name must have more or equal then 10 characters'],
        // validate: {
        //     validator: validator.isAlpha,
        //     message: 'The tour must have a name that contains only characters'
        // }

        // we use the shorthand version since is a short built-in validator from a third part library
        //validate: [validator.isAlpha, 'The tour must have a name that contains only characters']
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium, difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: (value) => Math.round(value * 10) / 10 // 4.666666667 * 10 = 46.666666667 => rounded to 47 / 10 => we get our 4.7 :)
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                // this only points to current doc on NEW document creation not in update scenario
                return val < this.price;
            },
            message: 'Discount price ({VALUE}) should be below regular price'
        }
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a description']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    },
    startLocation: {
        // GeoJSON Type
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    // guides: Array -- embedded way
    guides: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});
//tourSchema.index({price: 1});
tourSchema.index({price: 1, ratingsAverage: -1});
tourSchema.index({slug: 1});

tourSchema.virtual('durationWeek').get(function () {
    return this.duration / 7;
});

// Virtual population setup
tourSchema.virtual('reviews', {
    ref: 'Review',     // Reference to the Review model
    foreignField: 'tour',  // Field in the Review model that references the Tour
    localField: '_id'      // Field in the Tour model used for matching
});

// DOCUMENT MIDDLEWARE: it runs before .save(), .create() mongoose methods but not .insertMany() for example
tourSchema.pre('save', function (next) { // the first argument here 'save' called the pre save *hook/middleware of the mongoose document.
    this.slug = slugify(this.name, {lower: true});
    next();
});

// tourSchema.pre('save', async function (next) {
//     const guidesPromises = this.guides.map(async (user_id) => await User.findById(user_id));
//     this.guides = await Promise.all(guidesPromises);
//     next();
// }); The embedded way of modeling sub documents


// tourSchema.pre('save', function (doc, next) {
//     console.log(doc);
//     next();
// });

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) { // It means all queries that start with "find" => find, findOne, findBy---- etc
    this.find({secretTour: {$ne: true}});
    this.start = Date.now();
    next();
});

tourSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt'
    });
    next();
})


// tourSchema.post(/^find/, function (docs, next) { // It means all queries that start with "find" => find, findOne, findBy---- etc
//     console.log(`Query took ${Date.now()} - ${this.start} milliseconds`);
//     console.log(docs);
//     next();
// });

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({$match: {secretTour: {$ne: true}}});
    next();
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
