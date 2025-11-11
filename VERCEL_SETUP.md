# Configuración para Vercel

## Pasos para desplegar en Vercel

1. **Sube tu código a GitHub**

2. **Conecta tu repositorio con Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Importa tu repositorio de GitHub
   - Vercel detectará automáticamente que es un proyecto Node.js

3. **Configura las Variables de Entorno en Vercel:**
   
   En el dashboard de Vercel, ve a **Settings > Environment Variables** y agrega las siguientes variables:

   ```
   API_KEY=tu-api-key-super-secreta-aqui
   DB_HOST=162.241.62.48
   DB_USER=fpadactive
   DB_PASSWORD=QLG~4{!^x@*F
   DB_NAME=driedfru_active
   ```

   **Importante:** 
   - Cambia `tu-api-key-super-secreta-aqui` por tu API key real
   - Asegúrate de agregar estas variables para todos los entornos (Production, Preview, Development)

4. **Despliega:**
   - Vercel desplegará automáticamente tu aplicación
   - Una vez desplegado, obtendrás una URL como: `https://tu-proyecto.vercel.app`

5. **Ejecuta el script de inicialización de la base de datos:**
   
   Después del primer despliegue, necesitas ejecutar el script `init-db.js` para crear la tabla. Puedes hacerlo:
   
   - Localmente (si tienes acceso a la base de datos desde tu máquina)
   - O usando Vercel CLI:
     ```bash
     vercel env pull .env.local
     node init-db.js
     ```

## Estructura de archivos

- `vercel.json` - Configuración de Vercel
- `server.js` - Servidor Express (compatible con Vercel)
- `init-db.js` - Script para inicializar la base de datos

## Notas importantes

- El archivo `.env` NO debe subirse a GitHub (ya está en `.gitignore`)
- Las variables de entorno deben configurarse en el dashboard de Vercel
- El directorio `.vercel` se crea automáticamente y no debe subirse a GitHub

