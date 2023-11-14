
const productsDAO = require("../dao/productDao")

const getProducts = async (req, res) => {
    try {
        const result = await productsDAO.getProducts(req.query);

        let prevLink;
        if (!req.query.page) {
            prevLink = `http://${req.hostname}:${8080}${req.originalUrl}?page=${result.prevPage}`;
        } else {
            const modifiedUrl = req.originalUrl.replace(`page=${req.query.page}`, `page=${result.prevPage}`);
            prevLink = `http://${req.hostname}:${8080}${modifiedUrl}`;
        }

        let nextLink;
        if (!req.query.page) {
            nextLink = `http://${req.hostname}:${8080}${req.originalUrl}?page=${result.nextPage}`;
        } else {
            const modifiedUrl = req.originalUrl.replace(`page=${req.query.page}`, `page=${result.nextPage}`);
            nextLink = `http://${req.hostname}:${8080}${modifiedUrl}`;
        }

        return {
            statusCode: 200,
            response: { 
                status: 'success', 
                payload: result.docs,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage ? prevLink : null,
                nextLink: result.hasNextPage ? nextLink : null
            }
        };
    } catch (err) {
        return {
            statusCode: 500,
            response: { status: 'error', error: err.message }
        };
    }
};
const getProductsById = async (req, res) => {
    const pid = req.params.pid;
    try {
        const producto = await productsDAO.getProductById(pid);
        if (!producto) {
            return res.status(404).json({ status: "error", error: `Producto con id = ${pid} no existe` });
        }
        return res.status(200).json({ status: "success", data: producto });
    } catch (error) {
        return res.status(500).json({ status: "error", error: "Error interno del servidor" });
    }
};

const postProducts = async (req, res) => {
    try {
        const { title, description, price, code, stock, category } = req.body;
        const nuevoProducto = await productsDAO.createProduct({
            title: title,
            description: description,
            price: price,
            code: code,
            stock: stock,
            category: category,
        });
        res.status(201).json({ message: 'Producto creado exitosamente', producto: nuevoProducto });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el producto' });
    }
};

const deleteProductById = async (req, res) => {
    const pid = req.params.pid;
    try {
        const productoBorrar = await productsDAO.getProductById(pid);
        if (!productoBorrar) {
            return res.status(404).json({ status: "error", error: `Producto con id = ${pid} no existe` });
        }
        await productsDAO.deleteProduct(pid);
        res.status(204).json(); 
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ status: "error", error: "Error interno del servidor" });
    }
};

module.exports = { 
    getProducts,
    getProductsById, 
    postProducts,
    deleteProductById
};