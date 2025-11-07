import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid"; // install: npm install uuid


const productSchema = new mongoose.Schema(
  {
    product_id: {
    type: String,
    default: () => "PROD-" + uuidv4().split("-")[0],
    unique: true,
    },
    product_name: {
      type: String,
      required: true
    },
    seller_name: {
      type: String,
      required: true
    },
    seller_email: {
  type: String,
  required: true,
  trim: true
},

seller_id: {
  type: Number, 
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
    category_id: {type : Number},
    category_name: { type: String }
  },
  {
    timestamps: true 
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
