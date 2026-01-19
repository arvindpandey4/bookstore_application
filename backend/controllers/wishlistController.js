const Wishlist = require('../models/Wishlist');

// @desc    Get user wishlist
// @route   GET /wishlist
// @access  Private
const getWishlist = async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ userId: req.user._id }).populate('items.bookId');

        if (!wishlist) {
            return res.json({ success: true, data: [] });
        }

        res.json({
            success: true,
            data: wishlist.items
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add book to wishlist
// @route   POST /wishlist/add
// @access  Private
const addToWishlist = async (req, res) => {
    try {
        const { bookId } = req.body;
        let wishlist = await Wishlist.findOne({ userId: req.user._id });

        if (!wishlist) {
            wishlist = await Wishlist.create({
                userId: req.user._id,
                items: [{ bookId }]
            });
        } else {
            // Check if already in wishlist
            const exists = wishlist.items.find(item => item.bookId.toString() === bookId);
            if (exists) {
                return res.status(400).json({ success: false, message: 'Book already in wishlist' });
            }
            wishlist.items.push({ bookId });
            await wishlist.save();
        }

        await wishlist.populate('items.bookId');

        res.json({
            success: true,
            message: 'Added to wishlist',
            data: wishlist.items
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Remove book from wishlist
// @route   DELETE /wishlist/:bookId
// @access  Private
const removeFromWishlist = async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ userId: req.user._id });

        if (wishlist) {
            wishlist.items = wishlist.items.filter(
                (item) => item.bookId.toString() !== req.params.bookId
            );
            await wishlist.save();
            await wishlist.populate('items.bookId');
        }

        res.json({
            success: true,
            message: 'Removed from wishlist',
            data: wishlist ? wishlist.items : []
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist
};
