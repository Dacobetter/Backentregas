
const socket = io();
const table = document.getElementById("realProductsTable");

document.getElementById("createBtn").addEventListener("click", () => {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const code = document.getElementById('code').value;
    const category = document.getElementById('category').value = '';
    const stock = document.getElementById('stock').value;

    if (!title || !description || !price || !code || !stock || !category) {
        alert("Todos los campos deben estar llenos.");
        return;
    }

    const body = { 
        title,
        description,
        price,
        stock,
        category,
        code,   
    };

    fetch('/api/products', {
        method: 'post',
        body: JSON.stringify(body),
        headers:{
            'content-Type': 'application/json'
        },
    })
    .then(result => result.json())
    .then(result => {
        if (result.status === 'error') throw new Error(result.Error);
    })
    .then(() => fetch('/api/products'))
    .then(result => result.json())
    .then(result => {
        if (result.status === 'error') throw new Error(result.error);
        socket.emit('productList', result.payload);
        alert("Producto Agregado");
        document.getElementById("title").value = '';
        document.getElementById('description').value = '';
        document.getElementById('price').value = '';
        document.getElementById('code').value = '';
        document.getElementById('category').value = '';
        document.getElementById('stock').value = '';
        window.location.reload()

    })
    .catch(err => alert(`Error `));
});

deleteProduct = (id) => {
    fetch(`/api/products/${id}`,{
        method: 'delete',
    })
    .then(result => result.json())
    .then(result =>{
        if(result.status === 'error') throw new Error(result.error);
        socket.emit('productList', result.payload);
        window.location.reload()
        alert(`Producto Eliminado`);
        window.location.reload()
    })
    .catch(err => alert(`Producto Eliminado`));
    window.location.reload()
};