module.exports = {
  apps: [{
    name: "hpeerage-web",
    script: "./server.js",
    instances: 1, // Standard for single-container hosting
    autorestart: true,
    watch: false,
    max_memory_restart: '300M',
    env: {
      NODE_ENV: "development",
      PORT: 3000
    },
    env_production: {
      NODE_ENV: "production",
      PORT: 3000 // Port may be adjusted per Gabia's requirements
    },
    error_file: "./logs/err.log",
    out_file: "./logs/out.log",
    log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    combine_logs: true
  }]
};
