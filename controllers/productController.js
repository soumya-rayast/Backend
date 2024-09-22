import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// Constants
const MAX_IMAGES = 4;

// Function to add a product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, bestseller, quantity, discountPercentage } = req.body;

        // Validate required fields
        if (!name || !price || !category || !quantity) {
            return res.status(400).json({ success: false, message: "Missing required fields." });
        }

        // Validate numeric fields
        if (isNaN(price) || isNaN(quantity) || isNaN(discountPercentage)) {
            return res.status(400).json({ success: false, message: "Price, quantity, and discount percentage must be numbers." });
        }

        const images = [];
        for (let i = 1; i <= MAX_IMAGES; i++) {
            const image = req.files[`image${i}`] && req.files[`image${i}`][0];
            if (image) {
                images.push(image);
            }
        }

        const imagesUrl = await Promise.all(
            images.map(async (item) => {
                try {
                    const result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                    return result.secure_url;
                } catch (uploadError) {
                    console.error(`Error uploading image: ${uploadError.message}`);
                    return null; // Return null if the upload fails
                }
            })
        );

        const filteredImagesUrl = imagesUrl.filter(url => url); // Filter out null URLs

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true",
            image: filteredImagesUrl,
            quantity: Number(quantity),
            discountPercentage: Number(discountPercentage),
            date: Date.now(),
        };

        const product = new productModel(productData);
        await product.save();

        res.status(201).json({ success: true, message: "Product Added" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Function to list all products
const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.status(200).json({ success: true, products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Function to remove a product
const removeProduct = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, message: "Product ID is required." });
        }

        await productModel.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Product Removed" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Function to get information about a single product
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.params; // Assuming you're using route parameters
        if (!productId) {
            return res.status(400).json({ success: false, message: "Product ID is required." });
        }

        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }

        res.status(200).json({ success: true, product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { listProducts, addProduct, removeProduct, singleProduct };
