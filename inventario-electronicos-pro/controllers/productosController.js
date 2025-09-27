const db = require('../config/db');
const path = require('path');
const fs = require('fs');

const getProductos = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM productos');
        res.json({ success: true, data: results });
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).json({ success: false, message: 'Error al obtener productos', error: err.message });
    }
};

const createProducto = async (req, res) => {
    try {
        const { nombre, descripcion, precio, stock, categoria, marca, modelo } = req.body;
        const imagen = req.file ? req.file.filename : null;

        const [result] = await db.query(
            'INSERT INTO productos (nombre, descripcion, precio, stock, categoria, marca, modelo, imagen) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [nombre, descripcion, precio, stock, categoria, marca, modelo, imagen]
        );
        res.status(201).json({ success: true, message: 'Producto agregado correctamente', data: { id: result.insertId } });
    } catch (err) {
        console.error('Error al insertar producto:', err);
        res.status(500).json({ success: false, message: 'Error al agregar producto', error: err.message });
    }
};

const updateProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio, stock, categoria, marca, modelo, imagenActual } = req.body;
        const imagen = req.file ? req.file.filename : imagenActual;

        const [result] = await db.query(
            'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?, categoria = ?, marca = ?, modelo = ?, imagen = ? WHERE id = ?',
            [nombre, descripcion, precio, stock, categoria, marca, modelo, imagen, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Producto no encontrado' });
        }
        res.json({ success: true, message: 'Producto actualizado correctamente' });
    } catch (err) {
        console.error('Error al actualizar producto:', err);
        res.status(500).json({ success: false, message: 'Error al actualizar producto', error: err.message });
    }
};

const deleteProducto = async (req, res) => {
    try {
        const { id } = req.params;

        const [results] = await db.query('SELECT imagen FROM productos WHERE id = ?', [id]);
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Producto no encontrado' });
        }

        const imagen = results[0].imagen;
        if (imagen) {
            const imagenPath = path.join(__dirname, '../public/uploads', imagen);
            fs.unlink(imagenPath, (err) => {
                if (err && err.code !== 'ENOENT') {
                    console.error('Error al eliminar imagen:', err);
                }
            });
        }

        const [result] = await db.query('DELETE FROM productos WHERE id = ?', [id]);
        res.json({ success: true, message: 'Producto eliminado correctamente' });
    } catch (err) {
        console.error('Error al eliminar producto:', err);
        res.status(500).json({ success: false, message: 'Error al eliminar producto', error: err.message });
    }
};

module.exports = { getProductos, createProducto, updateProducto, deleteProducto };