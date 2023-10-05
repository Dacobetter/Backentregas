const mongoose = require("mongoose")


const cartCollection = 'carts'


const cartSchema = new mongoose.Schema({
  products: [{
    _id: false,
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", 
      required: true
    },
    quantity: {
      type: Number,
      required: true
    }
  }]
})