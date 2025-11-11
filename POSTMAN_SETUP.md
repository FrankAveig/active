# Configuración de Postman

## Importar la colección

1. Abre Postman
2. Haz clic en **Import** (arriba a la izquierda)
3. Selecciona el archivo `Active-Service-API.postman_collection.json`
4. La colección se importará con todos los endpoints

## Configurar variables de entorno

La colección incluye variables que puedes configurar:

### Variables de la colección:
- `base_url`: URL base de tu API
  - Local: `http://localhost:3000`
  - Vercel: `https://tu-proyecto.vercel.app`
- `api_key`: Tu API key secreta para los endpoints protegidos

### Cómo configurar las variables:

1. En Postman, haz clic en la colección **Active Service API**
2. Ve a la pestaña **Variables**
3. Actualiza los valores:
   - `base_url`: Cambia a tu URL de producción cuando despliegues en Vercel
   - `api_key`: Cambia por tu API key real

## Endpoints incluidos

### GET Públicos (no requieren API key)
- ✅ Obtener Estado del Servicio
- ✅ Activar Servicio
- ✅ Desactivar Servicio

### POST Protegidos (requieren API key)
- ✅ Activar Servicio (Protegido)
- ✅ Desactivar Servicio (Protegido)
- ✅ Cambiar Estado del Servicio (Toggle)

## Ejemplos de uso

### Obtener estado (GET público)
```
GET {{base_url}}/api/service/status
```

### Activar servicio (GET público)
```
GET {{base_url}}/api/service/activate
```

### Activar servicio (POST protegido)
```
POST {{base_url}}/api/service/activate
Headers:
  x-api-key: {{api_key}}
```

### Cambiar estado (POST protegido)
```
POST {{base_url}}/api/service/toggle
Headers:
  x-api-key: {{api_key}}
Body:
{
  "active": true
}
```

## Notas

- Los endpoints GET son públicos y no requieren autenticación
- Los endpoints POST requieren el header `x-api-key` con tu API key
- La variable `{{base_url}}` se reemplazará automáticamente en todas las peticiones
- La variable `{{api_key}}` se usará en los headers de los endpoints protegidos

