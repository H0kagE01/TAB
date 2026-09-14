// PM2 Ecosystem Config — Конфетница
// Запуск: pm2 start ecosystem.config.js
// Перезапуск: pm2 reload konfetnica

module.exports = {
  apps: [
    {
      name: 'konfetnica',
      // Standalone build entry point
      script: '.next/standalone/server.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
      },
      // Логи
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
    },
  ],
};
