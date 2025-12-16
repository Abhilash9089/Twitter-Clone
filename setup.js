const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Twitter Clone PERN Stack...\n');

// Check if .env exists
if (!fs.existsSync('.env')) {
  console.log('📝 Creating .env file...');
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
  console.log('✅ .env file created');
  console.log('⚠️  Please update the database credentials in .env file\n');
}

// Install backend dependencies
console.log('📦 Installing backend dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Backend dependencies installed\n');
} catch (error) {
  console.error('❌ Failed to install backend dependencies');
  process.exit(1);
}

// Install frontend dependencies
console.log('📦 Installing frontend dependencies...');
try {
  execSync('npm install', { cwd: 'client', stdio: 'inherit' });
  console.log('✅ Frontend dependencies installed\n');
} catch (error) {
  console.error('❌ Failed to install frontend dependencies');
  process.exit(1);
}

console.log('🎉 Setup complete!\n');
console.log('Next steps:');
console.log('1. Make sure PostgreSQL is running');
console.log('2. Update database credentials in .env file');
console.log('3. Create database: createdb twitter_clone');
console.log('4. Initialize database: node init-db.js');
console.log('5. Start the application: npm run dev');
console.log('\nOr use the quick start script: node start.js');