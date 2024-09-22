import Review from '../models/reviewModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';

export const createReview = async (req, res) => {
    const { itemId, review, rating } = req.body;

    if (!itemId || !review || !rating) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (!req.user || !req.user._id) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    try {
        const newReview = new Review({
            itemId,
            userId: req.user._id,
            review,
            rating,
        });

        await newReview.save();
        res.status(201).json({ success: true, message: 'Review submitted successfully' });
    } catch (error) {
        console.error('Error saving review:', error); 
        res.status(500).json({ success: false, message: 'Server error' });
    }
};



export const getReviewsByItemId = async (req, res) => {
    const { itemId } = req.params;

    try {
        const reviews = await Review.find({ itemId }).populate('userId', 'name');
        res.json({ success: true, reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};