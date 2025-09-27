-- ElectroStock Pro - Configuración de Base de Datos
-- Ejecuta este script en tu cliente MySQL

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS inventario_tienda;
USE inventario_tienda;

-- Crear tabla productos
CREATE TABLE IF NOT EXISTS productos (
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

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_categoria ON productos(categoria);
CREATE INDEX idx_marca ON productos(marca);
CREATE INDEX idx_stock ON productos(stock);
CREATE INDEX idx_nombre ON productos(nombre);

-- Mostrar estructura de la tabla
DESCRIBE productos;

-- Verificar que la tabla esté vacía
SELECT COUNT(*) as total_productos FROM productos;
