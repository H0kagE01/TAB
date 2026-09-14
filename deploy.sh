#!/bin/bash
# =============================================================
# deploy.sh — Скрипт обновления Конфетница на VPS
# Запуск: bash deploy.sh
# =============================================================

set -Eeuo pipefail

APP_DIR="/var/www/konfetnica"
LOG_FILE="$APP_DIR/logs/deploy.log"

echo "=========================================="
echo " Деплой Конфетница — $(date '+%Y-%m-%d %H:%M:%S')"
echo "=========================================="

cd "$APP_DIR"

# 1. Получаем последние изменения из Git
echo "[1/7] Git pull..."
git pull origin main

# 2. Устанавливаем зависимости. Dev-зависимости нужны для next build.
echo "[2/7] Installing dependencies..."
pnpm install --frozen-lockfile

# 3. Генерируем Prisma Client
echo "[3/7] Generating Prisma client..."
pnpm prisma generate

# 4. Запускаем миграции БД (если есть новые)
echo "[4/7] Running DB migrations..."
pnpm prisma migrate deploy

# 5. Собираем production build
echo "[5/7] Building Next.js..."
pnpm build

# 6. Копируем public и static файлы в standalone (требование Next.js standalone)
echo "[6/7] Copying static assets to standalone..."
mkdir -p .next/standalone/.next
cp -a public .next/standalone/public
cp -a .next/static .next/standalone/.next/static

# 7. Перезапускаем PM2
echo "[7/7] Reloading PM2..."
pm2 reload konfetnica --update-env

echo ""
echo "✅ Деплой завершён успешно! $(date '+%Y-%m-%d %H:%M:%S')"
echo "   Статус: pm2 status"
echo "   Логи:   pm2 logs konfetnica"
