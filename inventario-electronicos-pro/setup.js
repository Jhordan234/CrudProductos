#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 ElectroStock Pro - Setup Automatizado\n');

// Función para crear directorios si no existen
function createDirectoryIfNotExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`📁 Directorio creado: ${dirPath}`);
    } else {
        console.log(`✅ Directorio ya existe: ${dirPath}`);
    }
}

// Función para ejecutar comandos
function runCommand(command, description) {
    try {
        console.log(`🔄 ${description}...`);
        execSync(command, { stdio: 'pipe' });
        console.log(`✅ ${description} completado`);
    } catch (error) {
        console.error(`❌ Error en ${description}:`, error.message);
        return false;
    }
    return true;
}

// Función para mostrar un archivo SQL de ejemplo
function createSampleSQL() {
    const sqlContent = `-- ElectroStock Pro - Configuración de Base de Datos
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
`;

    fs.writeFileSync('database-setup.sql', sqlContent);
    console.log('📄 Archivo database-setup.sql creado');
}

// Función para crear archivo .env de ejemplo
function createEnvExample() {
    const envContent = `# ElectroStock Pro - Configuración de Entorno
# Copia este archivo como .env y modifica los valores según tu configuración

# Base de datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=inventario_tienda
DB_PORT=3306

# Servidor
PORT=3000
NODE_ENV=development

# Configuración de archivos
UPLOAD_LIMIT=5MB
ALLOWED_EXTENSIONS=jpg,jpeg,png,gif,webp

# Configuración de la aplicación
APP_NAME=ElectroStock Pro
APP_VERSION=1.0.0
`;

    fs.writeFileSync('.env.example', envContent);
    console.log('📄 Archivo .env.example creado');
}

// Función principal de setup
async function setup() {
    try {
        console.log('📋 Iniciando configuración del proyecto...\n');

        // 1. Crear directorios necesarios
        console.log('1️⃣ Creando estructura de directorios...');
        const directories = [
            'config',
            'controllers', 
            'routes',
            'views',
            'public',
            'public/uploads',
            'public/css',
            'public/js',
            'scripts'
        ];
        
        directories.forEach(createDirectoryIfNotExists);
        console.log('');

        // 2. Instalar dependencias si no están instaladas
        console.log('2️⃣ Verificando dependencias...');
        if (!fs.existsSync('node_modules')) {
            const installSuccess = runCommand('npm install', 'Instalando dependencias');
            if (!installSuccess) {
                console.log('⚠️  Por favor ejecuta manualmente: npm install');
            }
        } else {
            console.log('✅ Dependencias ya instaladas');
        }
        console.log('');

        // 3. Crear archivos de configuración
        console.log('3️⃣ Creando archivos de configuración...');
        createSampleSQL();
        createEnvExample();
        console.log('');

        // 4. Verificar archivos principales
        console.log('4️⃣ Verificando archivos principales...');
        const requiredFiles = [
            'app.js',
            'package.json',
            'config/db.js',
            'controllers/productosController.js',
            'routes/productos.js',
            'views/index.html'
        ];

        let allFilesExist = true;
        requiredFiles.forEach(file => {
            if (fs.existsSync(file)) {
                console.log(`✅ ${file}`);
            } else {
                console.log(`❌ Falta: ${file}`);
                allFilesExist = false;
            }
        });

        console.log('\n📋 Resumen del Setup:\n');

        if (allFilesExist) {
            console.log('✅ Todos los archivos principales están presentes');
        } else {
            console.log('⚠️  Algunos archivos principales faltan. Verifica la estructura del proyecto.');
        }

        console.log('\n🗄️  Próximos pasos:\n');
        console.log('1. 🔧 Configura tu base de datos MySQL:');
        console.log('   - Ejecuta el archivo database-setup.sql en tu cliente MySQL');
        console.log('   - O crea la base de datos manualmente siguiendo el README.md\n');
        
        console.log('2. ⚙️  Configura las credenciales de base de datos:');
        console.log('   - Edita config/db.js con tu usuario y contraseña de MySQL\n');
        
        console.log('3. 📊 Opcionalmente, inserta datos de ejemplo:');
        console.log('   - npm run sample-data\n');
        
        console.log('4. 🚀 Inicia el servidor:');
        console.log('   - npm run dev (desarrollo)');
        console.log('   - npm start (producción)\n');

        console.log('📖 Para más información, consulta el README.md\n');
        
        console.log('🎉 ¡Setup completado exitosamente!');
        console.log('💡 El servidor estará disponible en: http://localhost:3000');

    } catch (error) {
        console.error('❌ Error durante el setup:', error.message);
        process.exit(1);
    }
}

// Ejecutar setup
if (require.main === module) {
    setup();
}

module.exports = { setup };