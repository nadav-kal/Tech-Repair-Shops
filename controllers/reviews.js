const Techrepair = require('../models/techrepair');
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review');

module.exports.createReview = catchAsync(async (req, res) => {
    const { id } = req.params;
    const shop = await Techrepair.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    shop.reviews.push(review);
    await review.save();
    await shop.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/techrepairs/${shop._id}`);
});

module.exports.deleteReview = catchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    const shop = await Techrepair.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }, { new: true });
    const review = await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/techrepairs/${id}`);
});