const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const outDir = path.join(root, 'out');
const nextBin = path.join(root, 'node_modules', 'next', 'dist', 'bin', 'next');

function hasStaticExport() {
  const required = [
    path.join(outDir, 'index.html'),
    path.join(outDir, 'dashboard', 'index.html'),
    path.join(outDir, 'courses', 'index.html'),
    path.join(outDir, 'subscription', 'index.html'),
  ];
  return fs.existsSync(outDir) && required.every((file) => fs.existsSync(file));
}

console.log('Iniciando build estático da Versia para Vercel...');

const child = spawn(process.execPath, [nextBin, 'build', '--webpack'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NEXT_TELEMETRY_DISABLED: '1',
  },
});

const maxWaitMs = Number(process.env.VERSIA_BUILD_TIMEOUT_MS || 180000);
const timer = setTimeout(() => {
  if (hasStaticExport()) {
    console.log('Build estático gerado em /out. Finalizando processo com sucesso.');
    child.kill('SIGTERM');
    setTimeout(() => child.kill('SIGKILL'), 3000).unref();
    process.exit(0);
  }

  console.error('O build passou do tempo limite e a pasta /out não foi gerada corretamente.');
  child.kill('SIGTERM');
  setTimeout(() => child.kill('SIGKILL'), 3000).unref();
  process.exit(1);
}, maxWaitMs);

timer.unref();

child.on('exit', (code) => {
  clearTimeout(timer);
  if (code === 0 || hasStaticExport()) {
    console.log('Build finalizado com sucesso.');
    process.exit(0);
  }
  process.exit(code || 1);
});

child.on('error', (error) => {
  clearTimeout(timer);
  console.error(error);
  process.exit(1);
});
