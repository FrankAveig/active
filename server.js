require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY || 'tu-api-key-secreta-aqui';

// Middleware
app.use(cors()); // Habilitar CORS para todos los endpoints
app.use(express.json());

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig);

// Verificar conexión al iniciar
pool.getConnection()
  .then(connection => {
    console.log('Conectado a la base de datos MySQL.');
    connection.release();
  })
  .catch(err => {
    console.error('Error al conectar a la base de datos:', err.message);
    process.exit(1);
  });

// Middleware para validar API key en POST
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.body.api_key;
  
  if (!apiKey) {
    return res.status(401).json({ 
      error: 'API key requerida. Envía la API key en el header "x-api-key" o en el body como "api_key"' 
    });
  }
  
  if (apiKey !== API_KEY) {
    return res.status(403).json({ error: 'API key inválida' });
  }
  
  next();
};

// GET público - Obtener estado del servicio
app.get('/api/service/status', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT name, active FROM services WHERE name = ?',
      ['main_service']
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    
    const service = rows[0];
    res.json({
      service: service.name,
      active: service.active === 1,
      status: service.active === 1 ? 'active' : 'inactive'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al consultar la base de datos' });
  }
});

// GET público - Activar servicio
app.get('/api/service/activate', async (req, res) => {
  try {
    const [result] = await pool.execute(
      'UPDATE services SET active = 1, updated_at = NOW() WHERE name = ?',
      ['main_service']
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    
    res.json({ 
      message: 'Servicio activado exitosamente',
      service: 'main_service',
      active: true
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al activar el servicio' });
  }
});

// GET público - Desactivar servicio
app.get('/api/service/deactivate', async (req, res) => {
  try {
    const [result] = await pool.execute(
      'UPDATE services SET active = 0, updated_at = NOW() WHERE name = ?',
      ['main_service']
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    
    res.json({ 
      message: 'Servicio desactivado exitosamente',
      service: 'main_service',
      active: false
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al desactivar el servicio' });
  }
});

// POST protegido - Activar servicio (requiere API key)
app.post('/api/service/activate', validateApiKey, async (req, res) => {
  try {
    const [result] = await pool.execute(
      'UPDATE services SET active = 1, updated_at = NOW() WHERE name = ?',
      ['main_service']
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    
    res.json({ 
      message: 'Servicio activado exitosamente',
      service: 'main_service',
      active: true
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al activar el servicio' });
  }
});

// POST protegido - Desactivar servicio (requiere API key)
app.post('/api/service/deactivate', validateApiKey, async (req, res) => {
  try {
    const [result] = await pool.execute(
      'UPDATE services SET active = 0, updated_at = NOW() WHERE name = ?',
      ['main_service']
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    
    res.json({ 
      message: 'Servicio desactivado exitosamente',
      service: 'main_service',
      active: false
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al desactivar el servicio' });
  }
});

// POST protegido - Cambiar estado del servicio (requiere API key)
app.post('/api/service/toggle', validateApiKey, async (req, res) => {
  try {
    const { active } = req.body;
    
    if (typeof active !== 'boolean') {
      return res.status(400).json({ error: 'El campo "active" debe ser un booleano (true/false)' });
    }
    
    const activeValue = active ? 1 : 0;
    
    const [result] = await pool.execute(
      'UPDATE services SET active = ?, updated_at = NOW() WHERE name = ?',
      [activeValue, 'main_service']
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    
    res.json({ 
      message: `Servicio ${active ? 'activado' : 'desactivado'} exitosamente`,
      service: 'main_service',
      active: active
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al actualizar el servicio' });
  }
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Exportar para Vercel
module.exports = app;

// Iniciar servidor solo si no estamos en Vercel
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`API Key configurada: ${API_KEY.substring(0, 10)}...`);
  });

  // Cerrar pool de conexiones al terminar
  process.on('SIGINT', async () => {
    try {
      await pool.end();
      console.log('Pool de conexiones cerrado.');
      process.exit(0);
    } catch (error) {
      console.error('Error al cerrar el pool:', error.message);
      process.exit(1);
    }
  });
}
