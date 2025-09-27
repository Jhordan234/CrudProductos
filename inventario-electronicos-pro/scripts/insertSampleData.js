const mysql = require('mysql2');

// Configuración de la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Cambiar por tu contraseña
    database: 'inventario_tienda'
});

// Datos de ejemplo
const productosEjemplo = [
    {
        nombre: 'iPhone 15 Pro',
        descripcion: 'El iPhone más avanzado con chip A17 Pro, cámaras profesionales y pantalla Super Retina XDR de 6.1 pulgadas.',
        precio: 1199.99,
        stock: 25,
        categoria: 'smartphones',
        marca: 'Apple',
        modelo: 'iPhone 15 Pro'
    },
    {
        nombre: 'Samsung Galaxy S24 Ultra',
        descripcion: 'Smartphone premium con S Pen integrado, cámaras de hasta 200MP y pantalla Dynamic AMOLED 2X.',
        precio: 1299.99,
        stock: 18,
        categoria: 'smartphones',
        marca: 'Samsung',
        modelo: 'Galaxy S24 Ultra'
    },
    {
        nombre: 'MacBook Pro M3',
        descripcion: 'Laptop profesional con chip M3, 16GB RAM, 512GB SSD y pantalla Liquid Retina XDR de 14 pulgadas.',
        precio: 2499.99,
        stock: 12,
        categoria: 'laptops',
        marca: 'Apple',
        modelo: 'MacBook Pro 14"'
    },
    {
        nombre: 'Dell XPS 13 Plus',
        descripcion: 'Ultrabook premium con procesador Intel Core i7, 16GB RAM y pantalla InfinityEdge 4K.',
        precio: 1599.99,
        stock: 8,
        categoria: 'laptops',
        marca: 'Dell',
        modelo: 'XPS 13 Plus'
    },
    {
        nombre: 'iPad Pro 12.9"',
        descripcion: 'Tablet profesional con chip M2, pantalla Liquid Retina XDR y soporte para Apple Pencil.',
        precio: 1099.99,
        stock: 15,
        categoria: 'tablets',
        marca: 'Apple',
        modelo: 'iPad Pro 12.9" (6ª gen)'
    },
    {
        nombre: 'Samsung Galaxy Tab S9+',
        descripcion: 'Tablet Android premium con pantalla AMOLED de 12.4", S Pen incluido y 256GB de almacenamiento.',
        precio: 899.99,
        stock: 10,
        categoria: 'tablets',
        marca: 'Samsung',
        modelo: 'Galaxy Tab S9+'
    },
    {
        nombre: 'AirPods Pro (2ª gen)',
        descripción: 'Auriculares inalámbricos con cancelación activa de ruido, audio espacial y estuche MagSafe.',
        precio: 249.99,
        stock: 35,
        categoria: 'audio',
        marca: 'Apple',
        modelo: 'AirPods Pro 2'
    },
    {
        nombre: 'Sony WH-1000XM5',
        descripcion: 'Auriculares over-ear con la mejor cancelación de ruido del mercado y 30 horas de batería.',
        precio: 399.99,
        stock: 22,
        categoria: 'audio',
        marca: 'Sony',
        modelo: 'WH-1000XM5'
    },
    {
        nombre: 'Apple Watch Series 9',
        descripcion: 'Smartwatch con chip S9, pantalla Always-On Retina y nuevas funciones de salud.',
        precio: 429.99,
        stock: 28,
        categoria: 'accesorios',
        marca: 'Apple',
        modelo: 'Watch Series 9 45mm'
    },
    {
        nombre: 'Samsung Galaxy Watch6',
        descripcion: 'Smartwatch con Wear OS, monitoreo avanzado de salud y batería de larga duración.',
        precio: 329.99,
        stock: 16,
        categoria: 'accesorios',
        marca: 'Samsung',
        modelo: 'Galaxy Watch6 44mm'
    },
    {
        nombre: 'Nintendo Switch OLED',
        descripcion: 'Consola híbrida con pantalla OLED de 7 pulgadas, 64GB de almacenamiento interno.',
        precio: 349.99,
        stock: 5, // Stock bajo para demo
        categoria: 'gaming',
        marca: 'Nintendo',
        modelo: 'Switch OLED'
    },
    {
        nombre: 'PlayStation 5',
        descripcion: 'Consola de nueva generación con SSD ultrarrápido, ray tracing y audio 3D.',
        precio: 499.99,
        stock: 3, // Stock bajo para demo
        categoria: 'gaming',
        marca: 'Sony',
        modelo: 'PlayStation 5'
    },
    {
        nombre: 'LG C3 OLED 65"',
        descripcion: 'Smart TV OLED 4K con procesador α9 Gen6, Dolby Vision y webOS 23.',
        precio: 1799.99,
        stock: 6,
        categoria: 'tv',
        marca: 'LG',
        modelo: 'OLED65C3PUA'
    },
    {
        nombre: 'Samsung QN85C Neo QLED 75"',
        descripcion: 'Smart TV Neo QLED 4K con Mini LED, Quantum HDR y Tizen OS.',
        precio: 2299.99,
        stock: 4,
        categoria: 'tv',
        marca: 'Samsung',
        modelo: 'QN75QN85CAFXZA'
    },
    {
        nombre: 'Logitech MX Master 3S',
        descripcion: 'Mouse inalámbrico ergonómico con sensor de 8000 DPI y batería de 70 días.',
        precio: 99.99,
        stock: 45,
        categoria: 'accesorios',
        marca: 'Logitech',
        modelo: 'MX Master 3S'
    }
];

// Función para insertar datos de ejemplo
async function insertarDatosEjemplo() {
    try {
        console.log('🔄 Conectando a la base de datos...');
        
        // Verificar si ya hay datos
        const checkQuery = 'SELECT COUNT(*) as count FROM productos';
        
        connection.query(checkQuery, (err, results) => {
            if (err) {
                console.error('❌ Error al verificar datos existentes:', err);
                return;
            }
            
            const count = results[0].count;
            
            if (count > 0) {
                console.log(`ℹ️  Ya existen ${count} productos en la base de datos.`);
                console.log('💡 Si quieres insertar los datos de ejemplo, primero vacía la tabla productos.');
                connection.end();
                return;
            }
            
            console.log('📝 Insertando productos de ejemplo...');
            
            // Insertar productos uno por uno
            let insertedCount = 0;
            
            productosEjemplo.forEach((producto, index) => {
                const query = 'INSERT INTO productos SET ?';
                
                connection.query(query, producto, (err, result) => {
                    if (err) {
                        console.error(`❌ Error al insertar ${producto.nombre}:`, err);
                    } else {
                        insertedCount++;
                        console.log(`✅ Insertado: ${producto.nombre} (ID: ${result.insertId})`);
                    }
                    
                    // Si es el último producto, mostrar resumen y cerrar conexión
                    if (index === productosEjemplo.length - 1) {
                        setTimeout(() => {
                            console.log(`\n🎉 Proceso completado!`);
                            console.log(`📊 Productos insertados: ${insertedCount}/${productosEjemplo.length}`);
                            console.log(`🚀 Ya puedes ejecutar: npm run dev`);
                            connection.end();
                        }, 100);
                    }
                });
            });
        });
        
    } catch (error) {
        console.error('❌ Error general:', error);
        connection.end();
    }
}

// Función para vaciar la tabla (opcional)
function vaciarTabla() {
    const query = 'DELETE FROM productos';
    
    connection.query(query, (err, result) => {
        if (err) {
            console.error('❌ Error al vaciar tabla:', err);
        } else {
            console.log(`🗑️  Tabla vaciada. ${result.affectedRows} registros eliminados.`);
            console.log('📝 Insertando nuevos datos...');
            insertarDatosEjemplo();
        }
    });
}

// Verificar argumentos de línea de comandos
const args = process.argv.slice(2);

if (args.includes('--reset') || args.includes('-r')) {
    console.log('🔄 Vaciando tabla y insertando nuevos datos...');
    vaciarTabla();
} else {
    insertarDatosEjemplo();
}

// Manejar cierre de la aplicación
process.on('SIGINT', () => {
    console.log('\n👋 Cerrando conexión...');
    connection.end();
    process.exit(0);
});