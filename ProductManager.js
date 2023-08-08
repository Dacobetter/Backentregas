const fs = require('fs').promises;

class ProductManager {
    #items
    #lastId
    #filePath
    constructor(filePath) {
        this.#items = []
        this.#lastId = 0
        this.#filePath = filePath;
    }
    async iniciar() {
        try {
            const data = await fs.readFile(this.#filePath, 'utf-8')
            this.#items = JSON.parse(data)
            this.#lastId = this.#items.length > 0 ? this.#items[this.#items.length - 1].id : 0;

        }
        catch (error) {
            console.log("No fue encontrado ", error)
            this.#items = []
            this.#lastId = 0
        }
    }
    async guardarArchivo() {
        try {
            const data = JSON.stringify(this.#items, null, 2)
            await fs.writeFile(this.#filePath, data, 'utf-8')
        } catch (error) {
            console.error("Error al escribir el archivo JSON:", error);
        }
    }
    async addProducto(item) {
        if (!item.title || !item.description || !item.price || !item.thumbnail || !item.code || !item.stock) {
            return 'Requiere llenar los campos'

        }
        const found = this.#items.find(product => product.code === item.code)
        if (found) {
            return 'El código ya hay un codigo similar Error'
        }

        this.#lastId += 1
        item.id = this.#lastId
        this.#items.push(item)
        await this.guardarArchivo()
        return 'Producto Agregado'

    }
    async updateProduct(id, nuevoValor) {
        const producIndex = this.#items.findIndex(item => item.id === id)

        if (producIndex === -1) {
            return "Producto no encontrado"
        }
        const uptadeProduct = { ...this.#items[producIndex], ...nuevoValor }
        if ("id" in nuevoValor) {
            return "error no se puede cambiar"
        }
        this.#items[producIndex] = uptadeProduct
        await this.guardarArchivo()
        return "Actualizacion realizada"

    }
    async deleteProduct(id) {
        const initialLength = this.#items.length
        this.#items = this.#items.filter(item => item.id !== id)

        if (this.#items.length === initialLength) {
            return 'Error: Producto no encontrado'
        }

        await this.guardarArchivo()
        return 'Producto eliminado'
    }
    getProductos() {
        return this.#items
    }
    getProductoById(id) {
        const found = this.#items.find(item => item.id === id)
        if (!found) {
            return 'Not Found'
        }
        return found
    }
}

module.exports = ProductManager;
