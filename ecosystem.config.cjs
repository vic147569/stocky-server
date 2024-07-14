module.exports = {
  apps: [
    {
      name: 'stocky-server',
      script: 'npm',
      automation: false,
      args: 'run start',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
}
