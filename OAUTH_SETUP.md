# 🔐 Configuración de OAuth para ReadBooks

## 📋 Resumen
Esta guía te ayudará a configurar autenticación con Google y Apple para tu aplicación ReadBooks.

## 🌍 Google OAuth Setup

### 1. Accede a Google Cloud Console
- Ve a [Google Cloud Console](https://console.cloud.google.com/)
- Inicia sesión con tu cuenta de Google

### 2. Crear/Seleccionar Proyecto
- Si no tienes un proyecto, haz clic en "Crear Proyecto"
- Nombra tu proyecto (ej: "ReadBooks App")
- Selecciona tu proyecto

### 3. Habilitar APIs
- Ve a "APIs y servicios" > "Biblioteca"
- Busca "Google+ API" y habilítala
- También habilita "People API"

### 4. Crear Credenciales OAuth
- Ve a "APIs y servicios" > "Credenciales"
- Haz clic en "Crear credenciales" > "ID de cliente de OAuth 2.0"
- Selecciona "Aplicación web"
- Nombre: "ReadBooks OAuth"

### 5. Configurar URLs de Redirección
Agrega estas URLs autorizadas:
```
http://localhost:3000/api/auth/callback/google
https://tu-dominio.vercel.app/api/auth/callback/google
```

### 6. Obtener Credenciales
- Copia el "ID de cliente" → `GOOGLE_CLIENT_ID`
- Copia el "Secreto del cliente" → `GOOGLE_CLIENT_SECRET`

## 🍎 Apple OAuth Setup

### 1. Accede a Apple Developer
- Ve a [Apple Developer Portal](https://developer.apple.com/)
- Inicia sesión con tu Apple ID de desarrollador
- **Nota:** Necesitas una cuenta de desarrollador de Apple ($99/año)

### 2. Registrar App ID
- Ve a "Certificates, Identifiers & Profiles"
- Selecciona "Identifiers" > "App IDs"
- Registra un nuevo App ID
- Habilita "Sign In with Apple"

### 3. Crear Service ID
- Ve a "Identifiers" > "Services IDs"
- Registra un nuevo Service ID
- Este será tu `APPLE_ID`

### 4. Configurar Dominios
En la configuración del Service ID:
```
Primary App ID: (tu App ID del paso 2)
Website URLs: 
- http://localhost:3000
- https://tu-dominio.vercel.app

Return URLs:
- http://localhost:3000/api/auth/callback/apple
- https://tu-dominio.vercel.app/api/auth/callback/apple
```

### 5. Crear Clave Privada
- Ve a "Keys"
- Registra una nueva clave
- Habilita "Sign In with Apple"
- Descarga el archivo `.p8`
- El contenido de este archivo es tu `APPLE_SECRET`

## ⚙️ Configuración en ReadBooks

### 1. Variables de Entorno Locales
Edita tu archivo `.env.local`:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=tu_google_client_id_aqui
GOOGLE_CLIENT_SECRET=tu_google_client_secret_aqui

# Apple OAuth
APPLE_ID=tu_apple_service_id_aqui
APPLE_SECRET=-----BEGIN PRIVATE KEY-----
contenido_de_tu_archivo_p8_aqui
-----END PRIVATE KEY-----
```

### 2. Variables en Vercel
Para el despliegue en producción:

```bash
vercel env add GOOGLE_CLIENT_ID production
vercel env add GOOGLE_CLIENT_SECRET production
vercel env add APPLE_ID production
vercel env add APPLE_SECRET production
```

## 🚀 Desplegar Cambios

### 1. Desarrollo Local
```bash
npm run dev
```

### 2. Despliegue en Vercel
```bash
vercel --prod
```

## ✅ Verificar Funcionamiento

### Test OAuth Google:
1. Ve a tu app local o desplegada
2. Haz clic en "Iniciar sesión" o "Registrarse"
3. Haz clic en el botón "Google"
4. Autoriza la aplicación
5. Deberías ser redirigido a tu dashboard

### Test OAuth Apple:
1. Ve a tu app local o desplegada
2. Haz clic en "Iniciar sesión" o "Registrarse"
3. Haz clic en el botón "Apple"
4. Autoriza la aplicación
5. Deberías ser redirigido a tu dashboard

## 🛠️ Solución de Problemas

### Error: "redirect_uri_mismatch"
- Verifica que las URLs de redirección estén correctamente configuradas
- Asegúrate de que coincidan exactamente (incluyendo http/https)

### Error: "invalid_client"
- Verifica que `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` sean correctos
- Asegúrate de que las APIs estén habilitadas

### Apple OAuth no funciona:
- Verifica que tengas una cuenta de desarrollador activa
- Asegúrate de que el Service ID esté correctamente configurado
- Verifica que la clave privada esté en el formato correcto

## 📞 Soporte

Si tienes problemas:
1. Verifica que todas las variables de entorno estén configuradas
2. Revisa los logs en la consola del navegador
3. Verifica la configuración en Google Cloud Console y Apple Developer
4. Asegúrate de que las URLs de callback coincidan exactamente

## 🎯 Beneficios del OAuth

### Para los Usuarios:
- ✅ Registro rápido y fácil
- ✅ No necesidad de recordar otra contraseña
- ✅ Autenticación segura con proveedores confiables
- ✅ Proceso de inicio de sesión de un clic

### Para ti:
- ✅ Menos problemas de soporte relacionados con contraseñas
- ✅ Mayor tasa de conversión en registros
- ✅ Autenticación segura sin manejar contraseñas
- ✅ Información de perfil automática (nombre, email, foto)

¡Una vez configurado, tú y tu Jr podrán acceder fácilmente con sus cuentas de Google o Apple! 🎉
