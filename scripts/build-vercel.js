const { spawn } = require('child_process');

const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const child = spawn(command, ['next', 'build'], { stdio: 'inherit' });

child.on('exit', (code) => process.exit(code || 0));
child.on('error', (error) => {
  console.error(error);
  process.exit(1);
});
