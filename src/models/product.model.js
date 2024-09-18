import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
  Category: {
    type: String,
    required: true,
    trim: true, // Removes extra spaces
    enum: ['Electronics', 'Fashion', 'Home Appliances', 'Books', 'Health & Beauty', 'Sports','Cloth','Mobiles'], // Restricts to predefined categories
  },
  Brand: {
    type: String,
    required: true,
    trim: true,
  },
  Name: {
    type: String,
    required: true,
    trim: true,
    unique: true, // Ensures no two products have the same name
  },
  Description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500, // Limits the description length
  },
  Price: {
    type: Number,
    required: true,
    min: 0, // Price cannot be negative
  },
  Quantity: {
    type: Number,
    required: true,
    min: 0, // Quantity cannot be negative
    default: 1, // Default value if not provided
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  
}, {
  timestamps: true, // Adds createdAt and updatedAt fields automatically
});

export const Product = mongoose.model("Product", productSchema);
