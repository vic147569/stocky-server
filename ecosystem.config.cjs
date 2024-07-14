module.exports = {
  apps: [
    {
      name: 'stocky-server',
      script: 'tsx ./src/index.ts',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
        // PORT: 3000, // Example additional environment variable
        // CUSTOM_VAR: 'value' // Example custom environment variable
      }
    }
  ]
}
