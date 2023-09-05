
const socket = io();
const table = document.getElementById("realProductsTable");

document.getElementById("createBtn").addEventListener("click", () => {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const code = document.getElementById('code').value;
    const stock = document.getElementById('stock').value;

    if (!title || !description || !price || !code || !stock) {
        alert("Todos los campos deben estar llenos.");
        return;
    }

    const body = {
        title,
        description,
        price,
        code,
        stock,
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
        document.getElementById('stock').value = '';

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
        alert(`Producto Eliminado`);
    })
    .catch(err => alert(`Error`));
};

socket.on('updatedProducts', data => {
    table.innerHTML = `
    <tr>
        <td>Productos</td>
        <td>Descripción</td>
        <td>Código</td>
        <td>Precio</td>
        <td>Stock</td>
    </tr>`;

    for (product of data) {
        let tr = document.createElement("tr");
        tr.innerHTML = `
            <td onclick="deleteProduct(${product.id})">Eliminar</td>
            <td>${product.description}</td>
            <td>${product.code}</td>
            <td>${product.price}</td>
            <td>${product.stock}</td>
        `;
        table.getElementsByTagName("tbody")[0].appendChild(tr);
    }
});
