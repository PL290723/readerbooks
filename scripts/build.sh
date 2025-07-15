#!/bin/bash
echo "🔨 Iniciando build personalizado para Vercel..."

# Instalar dependencias si no están
npm install

# Generar Prisma client
echo "📦 Generando Prisma client..."
npx prisma generate || echo "⚠️ Prisma generate falló, continuando..."

# Build de Next.js
echo "⚡ Building Next.js..."
npm run build

echo "✅ Build completado!"
