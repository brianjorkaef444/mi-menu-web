// Variables globales
let menuData = [];
let carrito = {};

// Referencias a elementos del DOM
const main = document.querySelector('main');
const pedidoContainer = document.getElementById('productos-pedido');
const subtotalElem = document.querySelector('.subtotal');
const totalPagarElem = document.querySelector('.total-pagar');

// Función para cargar menú desde JSON (o puedes reemplazarlo con un array local)
function cargarMenu() {
  fetch('menu.json')
    .then(response => response.json())
    .then(data => {
      menuData = data;
      mostrarMenu();
    })
    .catch(error => console.error('Error cargando menú:', error));
}

// Función para mostrar productos en el menú
function mostrarMenu() {
  main.innerHTML = ''; // limpiar contenedor

  menuData.forEach(item => {
    const card = document.createElement('article');
    card.classList.add('card');
    card.innerHTML = `
      <img src="${item.imagen}" alt="${item.nombre}" />
      <div class="card-content">
        <h3>${item.nombre}</h3>
        <p>${item.descripcion}</p>
        <p><strong>Precio: $${item.precio.toFixed(2)}</strong></p>
        <a href="https://www.youtube.com/watch?v=${item.videoId}" target="_blank" rel="noopener noreferrer">Ver Video Receta</a>
        <button class="btn-agregar" data-id="${item.id}">Agregar al carrito</button>
      </div>
    `;
    main.appendChild(card);
  });

  // Agregar evento a los botones
  document.querySelectorAll('.btn-agregar').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      agregarAlCarrito(id);
    });
  });
}

// Función para agregar producto al carrito
function agregarAlCarrito(id) {
  if (carrito[id]) {
    carrito[id].cantidad++;
  } else {
    const producto = menuData.find(item => item.id === id);
    carrito[id] = { ...producto, cantidad: 1 };
  }
  alert(`Agregaste ${carrito[id].nombre} al carrito.`);
  mostrarCarrito();
}

// Función para eliminar producto del carrito
function eliminarDelCarrito(id) {
  if (carrito[id]) {
    carrito[id].cantidad--;
    if (carrito[id].cantidad <= 0) {
      delete carrito[id];
    }
  }
  mostrarCarrito();
}

// Función para mostrar carrito
function mostrarCarrito() {
  pedidoContainer.innerHTML = '';

  const productos = Object.values(carrito);

  if (productos.length === 0) {
    pedidoContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
    subtotalElem.textContent = '';
    totalPagarElem.textContent = '';
    return;
  }

  productos.forEach(producto => {
    const div = document.createElement('div');
    div.classList.add('producto-pedido');
    div.innerHTML = `
      <span class="nombre">${producto.nombre} (x${producto.cantidad})</span>
      <span class="precio">Subtotal: $${(producto.precio * producto.cantidad).toFixed(2)}</span>
      <button class="eliminar" data-id="${producto.id}">Eliminar</button>
    `;
    pedidoContainer.appendChild(div);
  });

  // Agregar eventos a botones eliminar
  document.querySelectorAll('.eliminar').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      eliminarDelCarrito(id);
    });
  });

  // Calcular subtotal y total
  const subtotal = productos.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
  subtotalElem.textContent = `Subtotal: $${subtotal.toFixed(2)}`;
  totalPagarElem.textContent = `Total a pagar: $${subtotal.toFixed(2)}`;
}

// Inicializar menú
cargarMenu();
