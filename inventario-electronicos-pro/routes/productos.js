require('dotenv').config();
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getProductos, createProducto, updateProducto, deleteProducto } = require('../controllers/productosController');

// Configuración de almacenamiento para imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../public/uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
    }
});

// Configuración de multer (sin límite de tamaño)
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedExtensions = (process.env.ALLOWED_EXTENSIONS || 'jpg,jpeg,png,gif,webp').split(',');
        const extname = allowedExtensions.includes(path.extname(file.originalname).toLowerCase().replace('.', ''));
        const mimetype = allowedExtensions.some(ext => file.mimetype.includes(ext));
        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error(`Solo se permiten imágenes (${allowedExtensions.join(', ')})`));
        }
    }
});

// Middleware para manejar errores de multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
    if (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
    next();
};

// Rutas CRUD
router.get('/', getProductos);
router.post('/', upload.single('imagen'), handleMulterError, createProducto);
router.put('/:id', upload.single('imagen'), handleMulterError, updateProducto);
router.delete('/:id', deleteProducto);

// Middleware para manejar errores generales
router.use((err, req, res, next) => {
    console.error('Error en la ruta:', err);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: err.message
    });
});

module.exports = router;
