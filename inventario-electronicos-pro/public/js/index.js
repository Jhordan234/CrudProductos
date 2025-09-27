// Estado global de la aplicación
let productos = [];
let editandoProducto = null;

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', function() {
    cargarProductos();
    configurarEventListeners();
});

// Configurar event listeners
function configurarEventListeners() {
    // Búsqueda en tiempo real
    document.getElementById('search-input').addEventListener('input', filtrarProductos);
    document.getElementById('category-filter').addEventListener('change', filtrarProductos);
    
    // Formulario
    document.getElementById('producto-form').addEventListener('submit', guardarProducto);
    
    // Modal - cerrar con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            cerrarModal();
        }
    });
    
    // Modal - cerrar al hacer click fuera
    document.getElementById('producto-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            cerrarModal();
        }
    });
}

// Cargar productos desde la API
async function cargarProductos() {
    try {
        const response = await fetch('/api/productos');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}, response: ${await response.text()}`);
        }
        const data = await response.json();
        
        if (data.success) {
            productos = data.data;
            renderizarProductos(productos);
            actualizarEstadisticas();
        } else {
            mostrarNotificacion('Error al cargar productos', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion(`Error de conexión: ${error.message}`, 'error');
        mostrarEstadoVacio('Error de conexión', 'No se pudieron cargar los productos');
    }
}

// Renderizar lista de productos
function renderizarProductos(productosArray) {
    const container = document.getElementById('productos-container');
    
    if (productosArray.length === 0) {
        mostrarEstadoVacio('No hay productos', 'Comienza agregando tu primer producto al inventario');
        return;
    }

    const productosHTML = productosArray.map(producto => `
        <div class="product-card">
            <div class="product-image">
                ${producto.imagen ? 
                    `<img src="/uploads/${producto.imagen}" alt="${producto.nombre}" onerror="this.parentElement.innerHTML='<i class='fas fa-image'></i>'">` : 
                    '<i class="fas fa-box"></i>'
                }
            </div>
            <div class="product-info">
                <h3 class="product-name">${producto.nombre}</h3>
                <p class="product-description">${producto.descripcion || 'Sin descripción'}</p>
                
                <div class="product-meta">
                    <div class="meta-item">
                        <span class="meta-label">Precio</span>
                        <span class="meta-value price">${parseFloat(producto.precio).toLocaleString()}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Stock</span>
                        <span class="meta-value stock ${getStockClass(producto.stock)}">
                            <i class="fas fa-boxes"></i>
                            ${producto.stock}
                        </span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Categoría</span>
                        <span class="meta-value">${producto.categoria || 'Sin categoría'}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Marca</span>
                        <span class="meta-value">${producto.marca || 'Sin marca'}</span>
                    </div>
                </div>
            </div>
            <div class="product-actions">
                <button class="btn btn-primary btn-small" onclick="editarProducto(${producto.id})">
                    <i class="fas fa-edit"></i>
                    Editar
                </button>
                <button class="btn btn-danger btn-small" onclick="eliminarProducto(${producto.id})">
                    <i class="fas fa-trash"></i>
                    Eliminar
                </button>
            </div>
        </div>
    `).join('');

    container.innerHTML = `<div class="products-grid">${productosHTML}</div>`;
}

// Obtener clase CSS para el stock
function getStockClass(stock) {
    if (stock <= 5) return 'stock-low';
    if (stock <= 15) return 'stock-medium';
    return 'stock-high';
}

// Mostrar estado vacío
function mostrarEstadoVacio(titulo, mensaje) {
    const container = document.getElementById('productos-container');
    container.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-box-open"></i>
            <h3>${titulo}</h3>
            <p>${mensaje}</p>
        </div>
    `;
}

// Filtrar productos
function filtrarProductos() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const categoryFilter = document.getElementById('category-filter').value;
    
    const productosFiltrados = productos.filter(producto => {
        const matchSearch = !searchTerm || 
            producto.nombre.toLowerCase().includes(searchTerm) ||
            (producto.descripcion && producto.descripcion.toLowerCase().includes(searchTerm)) ||
            (producto.marca && producto.marca.toLowerCase().includes(searchTerm)) ||
            (producto.modelo && producto.modelo.toLowerCase().includes(searchTerm));
        
        const matchCategory = !categoryFilter || producto.categoria === categoryFilter;
        
        return matchSearch && matchCategory;
    });
    
    renderizarProductos(productosFiltrados);
}

// Actualizar estadísticas del header
function actualizarEstadisticas() {
    const totalProductos = productos.length;
    const totalStock = productos.reduce((sum, p) => sum + parseInt(p.stock), 0);
    const bajoStock = productos.filter(p => parseInt(p.stock) <= 5).length;
    
    document.getElementById('total-productos').textContent = totalProductos;
    document.getElementById('total-stock').textContent = totalStock.toLocaleString();
    document.getElementById('bajo-stock').textContent = bajoStock;
}

// Abrir modal
function abrirModal(modo, producto = null) {
    const modal = document.getElementById('producto-modal');
    const title = document.getElementById('modal-title');
    const form = document.getElementById('producto-form');
    const submitBtn = document.getElementById('submit-btn');
    
    editandoProducto = producto;
    
    if (modo === 'crear') {
        title.textContent = 'Agregar Producto';
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Guardar';
        form.reset();
    } else {
        title.textContent = 'Editar Producto';
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Actualizar';
        llenarFormulario(producto);
    }
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Cerrar modal
function cerrarModal() {
    const modal = document.getElementById('producto-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    editandoProducto = null;
}

// Llenar formulario con datos del producto
function llenarFormulario(producto) {
    document.getElementById('nombre').value = producto.nombre;
    document.getElementById('descripcion').value = producto.descripcion || '';
    document.getElementById('precio').value = producto.precio;
    document.getElementById('stock').value = producto.stock;
    document.getElementById('categoria').value = producto.categoria || '';
    document.getElementById('marca').value = producto.marca || '';
    document.getElementById('modelo').value = producto.modelo || '';
    document.getElementById('imagenActual').value = producto.imagen || '';
}

// Guardar producto (crear o actualizar)
async function guardarProducto(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submit-btn');
    const originalText = submitBtn.innerHTML;
    
    // Mostrar loading
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
    submitBtn.disabled = true;
    
    try {
        const formData = new FormData(e.target);
        const url = editandoProducto ? `/api/productos/${editandoProducto.id}` : '/api/productos';
        const method = editandoProducto ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            body: formData
        });
        
        if (!response.ok) {
            const text = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, response: ${text}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            mostrarNotificacion(data.message, 'success');
            cerrarModal();
            cargarProductos();
        } else {
            mostrarNotificacion(data.message || 'Error al guardar producto', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion(`Error al guardar producto: ${error.message}`, 'error');
    } finally {
        // Restaurar botón
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Editar producto
function editarProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (producto) {
        abrirModal('editar', producto);
    }
}

// Eliminar producto
async function eliminarProducto(id) {
    const producto = productos.find(p => p.id === id);
    
    if (!confirm(`¿Estás seguro de eliminar "${producto.nombre}"?`)) {
        return;
    }
    
    try {
        const response = await fetch(`/api/productos/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            mostrarNotificacion(data.message, 'success');
            cargarProductos();
        } else {
            mostrarNotificacion(data.message || 'Error al eliminar producto', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion(`Error al eliminar producto: ${error.message}`, 'error');
    }
}

// Mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${tipo}`;
    notification.innerHTML = `
        <i class="fas fa-${tipo === 'success' ? 'check' : tipo === 'error' ? 'times' : 'exclamation-triangle'}"></i>
        ${mensaje}
    `;
    
    document.body.appendChild(notification);
    
    // Mostrar con animación
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}
