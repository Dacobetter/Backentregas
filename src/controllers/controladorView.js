const productDao = require('../dao/viewDAO.JS');

const getView = async (req, res) => {
    try {
        const result = await productDao.getProducts(req.query);

        if (result.status === 'success') {
            const totalPages = [];
            for (let index = 1; index <= result.totalPages; index++) {
                const link = index === 1 ? `/products` : `/products?page=${index}`;
                totalPages.push({ page: index, link });
            }

            const user = req.session.user;

            res.render('home', {
                user,
                products: result.payload,
                paginateInfo: {
                    hasPrevPage: result.hasPrevPage,
                    hasNextPage: result.hasNextPage,
                    prevLink: result.prevLink,
                    nextLink: result.nextLink,
                    totalPages,
                },
            });
        } else {
            res.status(500).json({ status: 'error', error: 'Error al obtener productos' });
        }
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
};
const getRealtimeProducts = async (req, res) => {
    try {
        const result = await productDao.getRealtimeProducts();

        if (result.status === 'success') {
            res.render('realTimeProducts', { products: result.payload });
        } else {
            res.status(500).json({ status: 'error', error: 'Error al obtener productos en tiempo real' });
        }
    } catch (err) {
        console.error('Error al obtener productos en tiempo real:', err);
        res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
};


module.exports = {
    getView,
    getRealtimeProducts
};