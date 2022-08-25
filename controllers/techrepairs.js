const Techrepair = require('../models/techrepair');
const catchAsync = require('../utils/catchAsync');
const {cloudinary} = require('../cloudinary');

module.exports.index = catchAsync(async (req, res) => {
    const techrepairs = await Techrepair.find({});
    res.render('techrepairs/index', { techrepairs });
});

module.exports.renderNewForm = (req, res) => {
    res.render("techrepairs/new")
};

module.exports.createShop = catchAsync(async (req, res, next) => {
    const shop = new Techrepair(req.body.techrepair);
    shop.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    shop.author = req.user._id;
    await shop.save();
    req.flash('success', 'Successfuly made a new techrepair!');
    res.redirect(`/techrepairs/${shop._id}`);
});

module.exports.showShop = catchAsync(async (req, res) => {
    const { id } = req.params;
    const shop = await Techrepair.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!shop) {
        req.flash('error', 'Cannot find a techrepair!');
        return res.redirect('/techrepairs');
    }
    res.render('techrepairs/show', { shop });
});

module.exports.renderEditForm = catchAsync(async (req, res) => {
    const { id } = req.params;
    const shop = await Techrepair.findById(id);
    if(!shop) {
        req.flash('error', 'Cannot find a techrepair!');
        return res.redirect('/techrepairs');
    }
    res.render("techrepairs/edit", { shop });
});

module.exports.updateShop = catchAsync(async (req, res) => {
    const { id } = req.params;
    const shop = await Techrepair.findByIdAndUpdate(id, { ...req.body.techrepair }, { new: true });
    const images = req.files.map(f => ({url: f.path, filename: f.filename}));
    shop.images.push(...images);
    await shop.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await shop.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
    }
    req.flash('success', 'Successfully updated shop!');
    res.redirect(`/techrepairs/${shop._id}`);
});

module.exports.deleteShop = catchAsync(async (req, res) => {
    const { id } = req.params;
    const shop = await Techrepair.findById(id);
    if(!shop.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/techrepairs/${id}`);
    }
    await Techrepair.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted shop!');
    res.redirect('/techrepairs')
});