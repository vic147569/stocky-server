module.exports = {
  apps: [
    {
      name: 'stocky-server',
      script: './src/index.ts',
      automation: false,
      interpreter: 'node',
      interpreterArgs: '--import tsx',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
}
