const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Twitter Clone PERN Stack...\n');

// Check if node_modules exists
const fs = require('fs');
if (!fs.existsSync('node_modules')) {
  console.log('📦 Installing backend dependencies...');
  const installBackend = spawn('npm', ['install'], { stdio: 'inherit' });
  
  installBackend.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Backend dependencies installed');
      checkClientDependencies();
    } else {
      console.error('❌ Failed to install backend dependencies');
      process.exit(1);
    }
  });
} else {
  checkClientDependencies();
}

function checkClientDependencies() {
  if (!fs.existsSync('client/node_modules')) {
    console.log('📦 Installing frontend dependencies...');
    const installClient = spawn('npm', ['install'], { 
      cwd: 'client',
      stdio: 'inherit' 
    });
    
    installClient.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Frontend dependencies installed');
        startServers();
      } else {
        console.error('❌ Failed to install frontend dependencies');
        process.exit(1);
      }
    });
  } else {
    startServers();
  }
}

function startServers() {
  console.log('\n🔧 Starting development servers...\n');
  
  // Start backend server
  console.log('🖥️  Starting backend server on http://localhost:5000');
  const backend = spawn('npm', ['run', 'server'], { 
    stdio: ['inherit', 'pipe', 'pipe']
  });
  
  backend.stdout.on('data', (data) => {
    console.log(`[Backend] ${data.toString().trim()}`);
  });
  
  backend.stderr.on('data', (data) => {
    console.error(`[Backend Error] ${data.toString().trim()}`);
  });

  // Wait a bit then start frontend
  setTimeout(() => {
    console.log('⚛️  Starting React frontend on http://localhost:3000');
    const frontend = spawn('npm', ['start'], { 
      cwd: 'client',
      stdio: ['inherit', 'pipe', 'pipe']
    });
    
    frontend.stdout.on('data', (data) => {
      const output = data.toString().trim();
      if (output) {
        console.log(`[Frontend] ${output}`);
      }
    });
    
    frontend.stderr.on('data', (data) => {
      const output = data.toString().trim();
      if (output && !output.includes('webpack compiled')) {
        console.error(`[Frontend Error] ${output}`);
      }
    });

    console.log('\n✨ Both servers are starting up...');
    console.log('📱 Frontend will be available at: http://localhost:3000');
    console.log('🔌 Backend API available at: http://localhost:5000');
    console.log('\n💡 Make sure PostgreSQL is running and database is set up!');
    console.log('💡 Run "node init-db.js" to initialize the database with sample data');
    
  }, 3000);

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down servers...');
    backend.kill();
    process.exit();
  });
}