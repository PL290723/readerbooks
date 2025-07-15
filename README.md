# 🚀 ReadBooks - Despliegue y Acceso

## 📖 Sobre ReadBooks

**ReadBooks** es una aplicación web completa para gestión de bibliotecas personales que incluye:

### ✨ Características Principales
- 📚 **Gestión de libros y mangas**: Organiza tu biblioteca completa
- 🌍 **Biblioteca global**: Acceso a Google Books, Apple Books y MyAnimeList
- 🎌 **Soporte para mangas**: Seguimiento de volúmenes y progreso específico
- ⭐ **Sistema de calificaciones**: Evalúa tus lecturas con estrellas
- 📝 **Reseñas personales**: Guarda tus opiniones y notas
- 📊 **Estadísticas detalladas**: Visualiza tu progreso de lectura
- 🔒 **Completamente privado**: Tus datos son solo tuyos

### 🎯 Funcionalidades Avanzadas
- **Búsqueda global**: Explora millones de libros y mangas del mundo
- **Selección automática**: Los datos se llenan automáticamente al elegir un título
- **Progreso dual para mangas**: Seguimiento de páginas y volúmenes
- **Múltiples fuentes**: Google Books, Apple Books, MyAnimeList integrados
- **Interfaz intuitiva**: Diseño moderno y responsivo
- **Acceso offline**: Base de datos local para funcionamiento sin internet

## 🌐 Opciones de Despliegue

### Opción 1: Vercel (Recomendado)
1. **Crear cuenta en Vercel**: https://vercel.com
2. **Conectar repositorio**: Subir el código a GitHub
3. **Importar proyecto**: Desde el dashboard de Vercel
4. **Configurar variables**:
   ```
   NEXTAUTH_SECRET=tu-clave-secreta-muy-larga-y-segura
   NEXTAUTH_URL=https://tu-app.vercel.app
   ```
5. **Desplegar**: Automático con cada push

### Opción 2: Netlify
1. **Crear cuenta en Netlify**: https://netlify.com
2. **Conectar repositorio**: Desde el dashboard
3. **Configurar build**:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. **Variables de entorno**: En Site settings

### Opción 3: Railway
1. **Crear cuenta en Railway**: https://railway.app
2. **Nuevo proyecto**: Desde GitHub
3. **Configuración automática**: Railway detecta Next.js
4. **Variables de entorno**: En el dashboard del proyecto

## 🔧 Configuración Local

### Prerrequisitos
- Node.js 18+ instalado
- Git instalado

### Instalación
```bash
# Clonar el repositorio
git clone [tu-repositorio]
cd readbooks

# Instalar dependencias
npm install

# Configurar base de datos
npx prisma db push
npm run db:seed

# Ejecutar en desarrollo
npm run dev
```

### Variables de Entorno (.env.local)
```bash
NEXTAUTH_SECRET=tu-clave-secreta-aqui
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=file:./dev.db
```

## 👥 Acceso para Tu Jr y Tú

### Usuario Demo (Ya configurado)
- **Email**: `demo@ejemplo.com` 
- **Contraseña**: `123456`

### Crear Nuevos Usuarios
1. **Ir a la aplicación desplegada**
2. **Hacer clic en "Crear cuenta"**
3. **Llenar formulario de registro**
4. **Iniciar sesión con las nuevas credenciales**

### URLs de Acceso
- **Desarrollo local**: `http://localhost:3003`
- **Producción**: La URL que genere Vercel/Netlify/Railway

## 🔐 Seguridad y Privacidad

### Características de Seguridad
- **Autenticación requerida**: Solo usuarios registrados pueden acceder
- **Contraseñas encriptadas**: Bcrypt con salt factor 12
- **Sesiones seguras**: JWT tokens con expiración
- **Base de datos privada**: Cada usuario solo ve sus propios libros
- **HTTPS**: Conexiones encriptadas en producción

### Control de Acceso
- **Sin registro público**: Solo tú puedes crear cuentas
- **Datos aislados**: No hay manera de ver datos de otros usuarios
- **Logout seguro**: Sesiones se limpian completamente

## 📚 Cómo Usar ReadBooks

### Primer Uso
1. **Iniciar sesión** con usuario demo o crear cuenta
2. **Explorar el dashboard** con libros de ejemplo
3. **Agregar tu primer libro**:
   - Clic en "Agregar libro"
   - Elegir tipo (Libro/Manga)
   - Usar búsqueda global 🌍 para encontrar títulos
   - Configurar estado y progreso

### Gestión Diaria
- **Actualizar progreso**: Editar páginas/volúmenes actuales
- **Marcar como terminado**: Cambiar estado y agregar calificación
- **Escribir reseñas**: Guardar tus opiniones
- **Ver estadísticas**: Revisar tu progreso de lectura

### Búsqueda Global
- **Hacer clic en 🌍** junto al campo de título
- **Elegir tipo**: Todo, Libros, o Mangas
- **Buscar**: Escribe título, autor o palabras clave
- **Seleccionar**: Los datos se llenan automáticamente

## 📊 Estadísticas Disponibles

- **Total de libros/mangas** en tu biblioteca
- **Progreso actual** de lecturas en curso
- **Completados este año/mes**
- **Calificación promedio** de tus lecturas
- **Páginas leídas totales**
- **Gráficos de progreso** visuales

## 🆘 Soporte y Resolución de Problemas

### Problemas Comunes
1. **No carga la página**: Verificar variables de entorno
2. **Error de autenticación**: Revisar NEXTAUTH_SECRET y NEXTAUTH_URL
3. **Libros no se guardan**: Verificar permisos de base de datos
4. **Búsqueda global falla**: APIs externas pueden tener límites

### Logs y Debugging
- **Consola del navegador**: F12 → Console para errores frontend
- **Logs de Vercel**: Dashboard → Functions → View Logs
- **Base de datos**: `npx prisma studio` para ver datos localmente

## 🎉 ¡Disfruta ReadBooks!

Tu biblioteca personal está lista para crecer. Explora millones de libros y mangas, organiza tus lecturas y comparte la experiencia con tu Jr.

**¡Feliz lectura! 📚✨**

---

*ReadBooks - Desarrollado con Next.js, React, TypeScript y mucho ❤️*
