import test from 'node:test';
import assert from 'node:assert/strict';
import net from 'node:net';
import { spawn } from 'node:child_process';

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

function httpGet({ port, path = '/', timeoutMs = 2000 }) {
  return new Promise((resolve, reject) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    fetch(`http://127.0.0.1:${port}${path}`, { signal: controller.signal })
      .then(async (res) => {
        clearTimeout(timeout);
        resolve({ status: res.status, text: await res.text() });
      })
      .catch((err) => {
        clearTimeout(timeout);
        reject(err);
      });
  });
}

async function waitForServer({ port, attempts = 25, delayMs = 200 }) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      return await httpGet({ port, path: '/', timeoutMs: 500 });
    } catch {
      // ignore
    }
    await new Promise((r) => setTimeout(r, delayMs));
  }
  throw new Error('Servidor não respondeu a tempo');
}

test('servidor sobe e responde HTTP (smoke)', async () => {
  const port = await getFreePort();

  const child = spawn(process.execPath, ['index.js'], {
    env: {
      ...process.env,
      PORT: String(port),
      // Evita erros de inicialização do Sequelize por variáveis ausentes.
      DB_NAME: process.env.DB_NAME ?? 'test',
      DB_USER: process.env.DB_USER ?? 'test',
      DB_PASSWORD: process.env.DB_PASSWORD ?? 'test',
      DB_HOST: process.env.DB_HOST ?? '127.0.0.1',
      DB_DIALECT: process.env.DB_DIALECT ?? 'postgres',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  try {
    const res = await waitForServer({ port });
    // Como não existe rota GET /, o esperado é 404.
    assert.equal(res.status, 404);
  } finally {
    child.kill('SIGTERM');
  }
});
