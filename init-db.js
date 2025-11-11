require('dotenv').config();
const mysql = require('mysql2/promise');

async function initDatabase() {
  let connection;
  
  try {
    // Conectar a la base de datos
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('Conectado a la base de datos MySQL.');

    // Crear tabla de servicios
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        active TINYINT(1) NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;

    await connection.execute(createTableQuery);
    console.log('Tabla "services" creada exitosamente.');

    // Insertar servicio por defecto si no existe
    const insertQuery = `
      INSERT IGNORE INTO services (name, active) 
      VALUES ('main_service', 0)
    `;

    const [result] = await connection.execute(insertQuery);
    
    if (result.affectedRows > 0) {
      console.log('Servicio por defecto creado.');
    } else {
      console.log('El servicio por defecto ya existe.');
    }

    console.log('Base de datos inicializada correctamente.');

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Conexión cerrada.');
    }
  }
}

initDatabase();
