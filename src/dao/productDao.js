const products = require("./models/products")

const getProducts = async (query) => {
    const limit = query.limit || 10;
    const page = query.page || 1;
    const filterOptions = {};

    if (query.stock) filterOptions.stock = query.stock;
    if (query.category) filterOptions.category = query.category;

    const paginateOptions = { lean: true, limit, page };

    if (query.sort === 'asc') paginateOptions.sort = { price: 1 };
    if (query.sort === 'desc') paginateOptions.sort = { price: -1 };

    return await products.paginate(filterOptions, paginateOptions);
};

const getProductById = async (productId) => {
    return await products.findById(productId);
};

const createProduct = async (productData) => {
    const { title, description, price, code, stock, category } = productData;
    const newProduct = new products({
        title: title,
        description: description,
        price: price,
        code: code,
        stock: stock,
        category: category,
    });
    return await newProduct.save();
};

const deleteProduct = async (productId) => {
    return await products.deleteOne({ _id: productId });
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    deleteProduct
};