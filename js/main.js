/* CARRITO */
let productosEnCarrito = []

/* VERIFICAR SI YA ESTA CARGADO EL CARRITO */
if (localStorage.getItem("carrito")) {
    productosEnCarrito = JSON.parse(localStorage.getItem("carrito"))
} else {
    localStorage.setItem("carrito", JSON.stringify(productosEnCarrito))
}

/* METODOS DE BUSQUEDA */
function buscarInfo(buscado, array) {
    let busqueda = array.filter(
        (cosmetico) => cosmetico.desc.toLowerCase().includes(buscado.toLowerCase()) ||
            cosmetico.nombre.toLowerCase().includes(buscado.toLowerCase())
    )
    if (busqueda.length == 0) {
        coincidencia.innerHTML = ""
        let nuevoDiv = document.createElement("div")
        nuevoDiv.innerHTML = `<p>No hay coincidencias</p>`
        coincidencia.appendChild(nuevoDiv)
        mostrarProductos(array)
    } else {
        coincidencia.innerHTML = ""
        mostrarProductos(busqueda)
    }
}
/* METODOS DE ORDENAMIENTO */
function ordenarMayorMenor(array) {
    let mayorMenor = [].concat(array)
    mayorMenor.sort((a, b) => (b.precio - a.precio))
    mostrarProductos(mayorMenor)
}

function ordenarMenorMayor(array) {
    let menorMayor = [].concat(array)
    menorMayor.sort((a, b) => (a.precio - b.precio))
    mostrarProductos(menorMayor)
}

function ordenarAlfabeticamente(array) {
    let alfabeticamente = [].concat(array)
    alfabeticamente.sort((a, b) => {
        return a.nombre.localeCompare(b.nombre);
    })
    mostrarProductos(alfabeticamente)
}
/* CAPTURAR ELEMENTOS DEL DOM */
let pTotal = document.querySelector("#precioTotal")
let divTotal = document.querySelector("precioTotal")
let divProductos = document.getElementById("productos")
let btnGuardarCosmetico = document.getElementById("guardarCosmeticoBtn")
let buscador = document.getElementById("buscador")
let modalBody = document.getElementById("modal-body")
let btnFinalizar = document.getElementById("botonFinalizarCompra")
let botonCarrito = document.getElementById("botonCarrito")
let coincidencia = document.getElementById("coincidencia")
let selectOrden = document.getElementById("selectOrden")

/* OBTENER PRODUCTOS DEL JSON */
function getProductos() {
    return fetch('../js/productos.json').then((resp) => resp.json())
}

/* MOSTRAR PRODUCTOS CONSUMIENDO EL JSON */
function mostrarProductos(cosmeticos) {
    divProductos.innerHTML = ""
    cosmeticos.forEach(({ id, nombre, precio, desc, img }) => {
        //div contenedor de la tarjeta
        let nuevoCosmetico = document.createElement("div")
        nuevoCosmetico.classList.add("col-12", "col-md-6", "col-lg-4", "my-4", "alinear")
        //modificar dom 
        nuevoCosmetico.innerHTML = `
            <div id= "${id}" class="card">
                <img src="../images/${img}" class="card-img-top" alt="${nombre}">
                <div class="card-body">
                    <h5 class="card-title">${nombre}</h5>
                    <p class="card-text">${desc}</p>
                    <button id="agregarBtn${id}" class="btn btn_prod btn-outline-success">$${precio}</button>
                </div>
            </div> `

        //agregar elemento al div padre
        divProductos.appendChild(nuevoCosmetico)
        let btnAgregar = document.getElementById(`agregarBtn${id}`)
        //restructurar el objeto 
        let cosmetico = { id, nombre, precio, desc, img }
        //evento para agregar al carrito
        btnAgregar.addEventListener("click", () => {
            Swal.fire({
                title: '¿Desea agregar este producto al carrito?',
                text: `${nombre}`,
                imageUrl: `../images/${img}`,
                imageWidth: 200,
                imageHeight: 200,
                showCancelButton: true,
                confirmButtonColor: '#0d1321',
                cancelButtonColor: '#979dac',
                confirmButtonText: 'Sí, agregar'
            }).then((result) => {
                if (result.isConfirmed) {
                    Toastify({
                        className: "notificacion",
                        text: "Producto agregado al carrito",
                        duration: 2000
                    }).showToast();
                    agregarAlCarrito(cosmetico)
                }
            })
        })
    })
}
function cargarProductosCarrito(array) {
    modalBody.innerHTML = ""
    array.forEach(productoCarrito => {
        modalBody.innerHTML += ` <div class="card mb-3"  style="max-width: 540px;">
        <div class="row g-0" id ="productoCarrito${productoCarrito.id}" >
            <div class="col-md-4">
                <img src="../images/${productoCarrito.img}" class="img-fluid rounded-start" alt="${productoCarrito.nombre}">
            </div>
            <div class="col-md-8">
                <div class="card-body">
                    <h6 class="card-title style="font-size: 20px"">${productoCarrito.nombre}</h6>
                    <p class="card-text" style="font-size: 15px">$${productoCarrito.precio}</p>
                    <button class= "btn btn-danger" id="botonEliminar${productoCarrito.id}"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
        </div>
        </div>`
    });

    array.forEach((productoCarrito, indice) => {
        document.getElementById(`botonEliminar${productoCarrito.id}`).addEventListener("click", () => {
            let cardProducto = document.getElementById(`productoCarrito${productoCarrito.id}`)
            cardProducto.remove()
            productosEnCarrito.splice(indice, 1)
            localStorage.setItem("carrito", JSON.stringify(productosEnCarrito))
            actualizarTotal(productosEnCarrito)
        })
    });
    actualizarTotal(array)
}

/* ACTUALIZAR TOTAL EN EL MODAL */
function actualizarTotal(array) {
    let total = 0;
    array.forEach(productoCarrito => {
        total += productoCarrito.precio;
    });
    pTotal.classList.add("pTotal")
    pTotal.textContent = `$${total.toFixed(2)}`;
}

function agregarAlCarrito(cosmetico) {
    productosEnCarrito.push(cosmetico)
    localStorage.setItem("carrito", JSON.stringify(productosEnCarrito))
}
/* FINALIZAR COMPRA */
function finalizarCompra(array) {
    Swal.fire({
        title: '¿Desea finalizar la compra?',
        showCancelButton: true,
        confirmButtonColor: '#0d1321',
        cancelButtonColor: '#979dac',
        confirmButtonText: 'Sí, finalizar'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('Gracias por su compra')
            array.length = 0
        }
    })
}
getProductos().then(cosmeticos => {
    mostrarProductos(cosmeticos)

    buscador.addEventListener("input", () => {
        buscarInfo(buscador.value, cosmeticos)/*  */
    })

    selectOrden.addEventListener("change", () => {
        selectOrden.value == 1
            ? ordenarMayorMenor(cosmeticos)
            : selectOrden.value == 2
                ? ordenarMenorMayor(cosmeticos)
                : selectOrden.value == 3
                    ? ordenarAlfabeticamente(cosmeticos)
                    : mostrarProductos(cosmeticos);
    })
    botonCarrito.addEventListener("click", () => {
        cargarProductosCarrito(productosEnCarrito)
    })
    botonCarrito.addEventListener("click", () => {
        cargarProductosCarrito(productosEnCarrito)
    })
    btnFinalizar.addEventListener("click", () => {
        finalizarCompra(productosEnCarrito)
    })
});
