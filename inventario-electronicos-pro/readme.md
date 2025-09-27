# 🏪 ElectroStock Pro - Sistema de Gestión de Inventario

Un sistema CRUD moderno y empresarial para la gestión de inventario de productos electrónicos, desarrollado con Node.js, Express y MySQL.

![ElectroStock Pro](https://img.shields.io/badge/ElectroStock-Pro-blue?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange?style=for-the-badge&logo=mysql)
![Express](https://img.shields.io/badge/Express-4.18+-black?style=for-the-badge&logo=express)

## 📋 Características Principales

### 🎨 Interfaz Moderna
- **Diseño empresarial** con paleta de colores profesional
- **Responsive design** que funciona en todos los dispositivos
- **Animaciones suaves** y micro-interacciones
- **Dashboard en tiempo real** con estadísticas clave

### ⚡ Funcionalidades CRUD Completas
- ✅ **Crear productos** con validación de datos
- 📖 **Leer/Consultar** productos con filtros avanzados
- ✏️ **Actualizar** información de productos existentes
- 🗑️ **Eliminar** productos con confirmación

### 🔍 Funcionalidades Avanzadas
- **Búsqueda en tiempo real** por nombre, descripción, marca o modelo
- **Filtrado por categorías** (Smartphones, Laptops, Tablets, etc.)
- **Gestión de imágenes** con subida de archivos
- **Alertas de stock bajo** automáticas
- **Notificaciones toast** para feedback del usuario

### 📊 Dashboard Inteligente
- Contador de productos total
- Stock total del inventario
- Alertas de productos con stock bajo
- Visualización de categorías

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web minimalista
- **MySQL2** - Driver de base de datos
- **Multer** - Gestión de archivos
- **Body-parser** - Parsing de datos
- **CORS** - Control de origen cruzado

### Frontend
- **HTML5** semántico
- **CSS3** moderno con variables CSS
- **JavaScript ES6+** vanilla
- **Font Awesome** para iconografía
- **Google Fonts (Inter)** para tipografía

### Base de Datos
- **MySQL** 8.0+
- Esquema optimizado con timestamps automáticos
- Índices para consultas eficientes

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 14+ instalado
- MySQL Server 8.0+
- Git (opcional)

### Paso 1: Clonar o descargar el proyecto
```bash
# Si usas Git
git clone <url-del-repositorio>
cd inventario-electronicos-pro

# O simplemente descarga y extrae los archivos
```

### Paso 2: Instalar dependencias
```bash
npm install
```

### Paso 3: Configurar la base de datos
1. **Crear la base de datos:**
```sql
CREATE DATABASE inventario_tienda;
USE inventario_tienda;
```

2. **Crear la tabla productos:**
```sql
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    categoria VARCHAR(100),
    imagen VARCHAR(255),
    marca VARCHAR(100),
    modelo VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

3. **Configurar credenciales de MySQL:**
Edita el archivo `config/db.js` con tus credenciales:
```javascript
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'tu_usuario',          // Cambiar
    password: 'tu_contraseña',   // Cambiar
    database: 'inventario_tienda'
});
```

### Paso 4: Crear carpetas necesarias
```bash
mkdir -p public/uploads
mkdir -p public/css
mkdir -p public/js
```

### Paso 5: Insertar datos de ejemplo (opcional)
```bash
node scripts/insertSampleData.js
```

Para resetear la tabla e insertar nuevos datos:
```bash
node scripts/insertSampleData.js --reset
```

### Paso 6: Iniciar el servidor
```bash
# Modo desarrollo (con auto-reload)
npm run dev

# Modo producción
npm start
```

El servidor estará disponible en: `http://localhost:3000`

## 📁 Estructura del Proyecto

```
inventario-electronicos-pro/
├── 📁 config/
│   └── db.js                 # Configuración de base de datos
├── 📁 controllers/
│   └── productosController.js # Lógica de negocio CRUD
├── 📁 routes/
│   └── productos.js          # Rutas de la API
├── 📁 public/
│   ├── 📁 uploads/           # Imágenes subidas
│   ├── 📁 css/              # Estilos adicionales
│   └── 📁 js/               # Scripts del cliente
├── 📁 views/
│   └── index.html           # Interfaz principal
├── 📁 scripts/
│   └── insertSampleData.js  # Script de datos de ejemplo
├── app.js                   # Servidor principal
├── package.json             # Dependencias y scripts
└── README.md               # Este archivo
```

## 🔧 API Endpoints

### Productos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/productos` | Obtener todos los productos |
| `GET` | `/api/productos/:id` | Obtener producto por ID |
| `GET` | `/api/productos/buscar?q=...&categoria=...` | Buscar productos |
| `POST` | `/api/productos` | Crear nuevo producto |
| `PUT` | `/api/productos/:id` | Actualizar producto |
| `DELETE` | `/api/productos/:id` | Eliminar producto |

### Ejemplos de uso

**Obtener todos los productos:**
```bash
curl http://localhost:3000/api/productos
```

**Crear un producto:**
```bash
curl -X POST http://localhost:3000/api/productos \
  -F "nombre=iPhone 15" \
  -F "precio=999.99" \
  -F "stock=10" \
  -F "categoria=smartphones" \
  -F "imagen=@imagen.jpg"
```

**Buscar productos:**
```bash
curl "http://localhost:3000/api/productos/buscar?q=iPhone&categoria=smartphones"
```

## 🎯 Funcionalidades Detalladas

### Gestión de Productos
- **Campos completos:** nombre, descripción, precio, stock, categoría, marca, modelo
- **Validación robusta:** campos obligatorios y tipos de datos
- **Subida de imágenes:** soporte para JPG, PNG, GIF (máx 5MB)
- **Timestamps automáticos:** creación y actualización

### Interfaz de Usuario
- **Dashboard responsive:** funciona en móvil, tablet y escritorio
- **Búsqueda inteligente:** busca en múltiples campos simultáneamente
- **Filtros dinámicos:** por categoría con actualización en tiempo real
- **Notificaciones:** feedback visual para todas las acciones

### Alertas de Stock
- 🔴 **Stock crítico:** ≤ 5 unidades
- 🟡 **Stock bajo:** ≤ 15 unidades
- 🟢 **Stock saludable:** > 15 unidades

## 🔒 Validaciones y Seguridad

### Frontend
- Validación de formularios en tiempo real
- Sanitización de entradas del usuario
- Confirmación para acciones destructivas

### Backend
- Validación de tipos de datos
- Sanitización de queries SQL
- Manejo de errores robusto
- Límites de tamaño para archivos

### Base de Datos
- Campos NOT NULL para datos críticos
- Tipos de datos apropiados (DECIMAL para precios)
- Índices para consultas eficientes

## 🎨 Personalización

### Colores (CSS Variables)
```css
:root {
    --primary-color: #2563eb;    /* Azul principal */
    --accent-color: #10b981;     /* Verde de éxito */
    --danger-color: #ef4444;     /* Rojo de peligro */
    --warning-color: #f59e0b;    /* Amarillo de advertencia */
}
```

### Categorías
Edita las opciones en:
- `views/index.html` (formulario y filtros)
- `scripts/insertSampleData.js` (datos de ejemplo)

### Campos Adicionales
Para agregar nuevos campos:
1. Actualizar esquema de base de datos
2. Modificar `productosController.js`
3. Actualizar formulario en `index.html`

## 🚀 Despliegue en Producción

### Variables de Entorno Recomendadas
```bash
NODE_ENV=production
PORT=3000
DB_HOST=localhost
DB_USER=usuario_produccion
DB_PASSWORD=contraseña_segura
DB_NAME=inventario_tienda
```

### Optimizaciones para Producción
- Usar connection pooling para MySQL
- Implementar rate limiting
- Agregar logs con Morgan
- Configurar HTTPS
- Usar PM2 para gestión de procesos

## 🐛 Solución de Problemas

### Error de conexión a MySQL
```bash
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solución:** Verificar que MySQL esté ejecutándose y las credenciales sean correctas.

### Error de permisos en uploads/
```bash
Error: EACCES: permission denied, open './public/uploads/...'
```
**Solución:**
```bash
chmod 755 public/uploads
```

### Puerto ya en uso
```bash
Error: listen EADDRINUSE :::3000
```
**Solución:** Cambiar puerto en `app.js` o cerrar proceso existente:
```bash
lsof -ti:3000 | xargs kill -9
```

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

**Robyn Jhordan Gonzalo**
- GitHub: https://github.com/Jhordan234
- Email: robyngonzalotarazona@gmail.com

## 🙏 Agradecimientos

- [Font Awesome](https://fontawesome.com/) por los íconos
- [Google Fonts](https://fonts.google.com/) por la tipografía Inter
- [Express.js](https://expressjs.com/) por el framework web
- [MySQL](https://mysql.com/) por la base de datos

---

⭐ **Si te gustó este proyecto, no olvides darle una estrella en GitHub!** ⭐
