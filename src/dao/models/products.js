const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")
const productsCollection = 'products'


const productSchema = new mongoose.Schema({
        title: {type:String, require: true, unique:true},
        description: String,
        price: Number,
        thumbnail: String,
        code: {type:String, require: true, unique:true},
        category: { type: String, required: true },
        stock: {type:Number, require: true}
})
mongoose.set('strictQuery', false)
productSchema.plugin(mongoosePaginate)
const productModel = mongoose.model(productsCollection, productSchema)

module.exports = productModel;