import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    product_id: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    product_name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    seller_id: {
      type: Number, 
      required: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true 
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
