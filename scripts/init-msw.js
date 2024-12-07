import { execSync } from 'child_process';

console.log('Initializing MSW...');

try {
  // Install MSW if not already installed
  execSync('npm install msw --save-dev', { stdio: 'inherit' });
  
  // Initialize MSW and generate the service worker
  execSync('npx msw init public/ --save', { stdio: 'inherit' });
  
  console.log('MSW initialization completed successfully!');
} catch (error) {
  console.error('Error initializing MSW:', error);
  process.exit(1);
}
