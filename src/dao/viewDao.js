const baseProducts = require('./models/products');

const getProducts = async (query) => {
    const limit = query.limit || 10;
    const page = query.page || 1;

    const result = await baseProducts.paginate({}, { lean: true, limit, page });

    return {
        status: 'success',
        payload: result.docs,
        totalPages: result.totalPages,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}` : null,
        nextLink: result.hasNextPage ? `/products?page=${result.nextPage}` : null,
    };
};
const getRealtimeProducts = async () => {
    try {
        const products = await baseProducts.find().lean().exec();
        return {
            status: 'success',
            payload: products,
        };
    } catch (err) {
        console.error('Error al obtener productos en tiempo real:', err);
        return {
            status: 'error',
            error: 'Error al obtener productos en tiempo real',
        };
    }
};


module.exports = {
    getProducts,
    getRealtimeProducts
};