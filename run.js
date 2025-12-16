#!/usr/bin/env node

const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🐦 Twitter Clone PERN Stack\n');

// Check if dependencies are installed
if (!fs.existsSync('node_modules')) {
  console.log('📦 Installing dependencies...');
  try {
    execSync('npm run setup', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Setup failed');
    process.exit(1);
  }
}

// Check if .env exists
if (!fs.existsSync('.env')) {
  console.log('⚠️  .env file not found. Creating default...');
  const envContent = `NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=twitter_clone
DB_USER=postgres
DB_PASS=password
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure_change_this_in_production
JWT_EXPIRE=7d`;
  
  fs.writeFileSync('.env', envContent);
  console.log('✅ Default .env created. Please update database credentials.\n');
}

console.log('🚀 Starting servers...\n');

// Start the development servers
const dev = spawn('npm', ['run', 'dev'], { 
  stdio: 'inherit',
  shell: true 
});

dev.on('close', (code) => {
  console.log(`\n🛑 Servers stopped with code ${code}`);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down...');
  dev.kill('SIGINT');
  process.exit();
});