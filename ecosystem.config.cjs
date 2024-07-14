module.exports = {
  apps: [
    {
      name: 'stocky-server',
      script: './src/index.ts',
      interpreter: 'node',
      interpreterArgs: '--import tsx'
    }
  ]
}
