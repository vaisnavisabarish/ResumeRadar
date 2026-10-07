// Integration checks use temporary files, in-memory SQLite, and mocked external services.
// They never send writes to the user's running backends or load real credentials.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const { createRequire } = require('node:module');
const { spawn, execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const verificationDirectory = path.join(root, 'backend/verification');
const verificationRequire = createRequire(path.join(verificationDirectory, 'package.json'));
const pdfDirectory = path.join(root, 'backend/pdf-intake');
const pdfRequire = createRequire(path.join(pdfDirectory, 'package.json'));
const quietConsole = { log() {}, warn() {}, error() {} };
const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

function syntheticPdf() {
  const content = 'BT /F1 12 Tf 40 750 Td (Integration Candidate) Tj 0 -20 Td (https://github.com/test) Tj 0 -20 Td (React) Tj ET';
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`,
  ];
  let document = '%PDF-1.4\n'; const offsets = [0];
  objects.forEach((object, index) => { offsets.push(Buffer.byteLength(document)); document += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  const xref = Buffer.byteLength(document);
  document += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  document += offsets.slice(1).map(offset => String(offset).padStart(10, '0') + ' 00000 n \n').join('');
  document += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(document);
}

function loadModule(file, requireModule, extra = {}) {
  const module = { exports: {} };
  const execute = new Function('require', 'module', 'exports', '__dirname', 'console', 'process', fs.readFileSync(file, 'utf8'));
  execute(requireModule, module, module.exports, extra.__dirname || path.dirname(file), quietConsole, extra.process || { env: {} });
  return module.exports;
}

function loadApp(file, requireModule, extra) {
  let app;
  const express = requireModule('express');
  const expressFactory = Object.assign(() => {
    app = express();
    app.listen = () => {}; // Do not bind the source's production port.
    return app;
  }, express);
  loadModule(file, name => name === 'express' ? expressFactory : requireModule(name), extra);
  return app;
}

async function listen(app) {
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return { server, url: `http://127.0.0.1:${server.address().port}` };
}

async function request(base, route, body) {
  const response = await fetch(base + route, {
    ...(body === undefined ? {} : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
    signal: AbortSignal.timeout(10000),
  });
  return { status: response.status, body: await response.json() };
}

class CDP {
  constructor(socket) {
    this.socket = socket; this.sequence = 0; this.pending = new Map(); this.handlers = new Map();
    socket.addEventListener('message', event => {
      const message = JSON.parse(event.data);
      if (message.id) {
        const pending = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) pending?.reject(new Error(message.error.message));
        else pending?.resolve(message.result);
      } else this.handlers.get(message.method)?.(message.params);
    });
    socket.addEventListener('close', () => {
      for (const pending of this.pending.values()) pending.reject(new Error('Browser debugger connection closed'));
      this.pending.clear();
    });
  }
  send(method, params = {}) {
    const id = ++this.sequence;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error('Browser debugger timeout: ' + method));
      }, 10000);
      this.pending.set(id, {
        resolve: value => { clearTimeout(timer); resolve(value); },
        reject: error => { clearTimeout(timer); reject(error); },
      });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }
  async evaluate(expression) {
    const result = await this.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result.value;
  }
}

async function browserChecks(verification, pdf, temporaryDirectory, countCandidates) {
  const browserPath = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  ].find(fs.existsSync);
  if (!browserPath) { console.log('SKIP browser: no local Chromium browser found'); return; }
  const profilePath = path.join(temporaryDirectory, 'browser-profile');
  const browser = spawn(browserPath, [
    '--headless=new', '--no-first-run', '--no-default-browser-check',
    '--remote-debugging-port=0', `--user-data-dir=${profilePath}`, 'about:blank',
  ], { windowsHide: true, stdio: 'ignore' });
  let socket;
  let launchError;
  browser.on('error', error => { launchError = error; });
  try {
    const portFile = path.join(profilePath, 'DevToolsActivePort');
    for (let attempt = 0; attempt < 100 && !fs.existsSync(portFile); attempt++) {
      if (launchError) throw launchError;
      await wait(100);
    }
    assert.ok(fs.existsSync(portFile), 'Browser debugger did not start');
    const port = fs.readFileSync(portFile, 'utf8').split('\n')[0];
    const target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
    socket = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
    const cdp = new CDP(socket);
    const browserErrors = [];
    cdp.handlers.set('Runtime.exceptionThrown', event => browserErrors.push(event.exceptionDetails.text));
    cdp.handlers.set('Fetch.requestPaused', event => {
      const incoming = new URL(event.request.url);
      const base = incoming.port === '5000' ? pdf : verification;
      cdp.send('Fetch.continueRequest', { requestId: event.requestId, url: base + incoming.pathname + incoming.search }).catch(error => browserErrors.push(error.message));
    });
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    await cdp.send('Fetch.enable', { patterns: [ { urlPattern: 'http://localhost:5000/*' }, { urlPattern: 'http://localhost:5001/*' } ] });
    const until = async (expression, label) => {
      for (let attempt = 0; attempt < 100; attempt++) {
        if (await cdp.evaluate(expression)) return;
        await wait(100);
      }
      throw new Error('Browser timeout: ' + label + '\n' + await cdp.evaluate('document.body.innerText'));
    };
    await cdp.send('Page.navigate', { url: 'http://localhost:5173/' });
    console.log('Browser: checking Upload page');
    await until('!!document.querySelector("input[type=file]")', 'Upload page');
    const fixture = path.join(temporaryDirectory, 'integration.pdf');
    fs.writeFileSync(fixture, syntheticPdf());
    const document = await cdp.send('DOM.getDocument');
    const input = await cdp.send('DOM.querySelector', { nodeId: document.root.nodeId, selector: 'input[type=file]' });
    await cdp.send('DOM.setFileInputFiles', { nodeId: input.nodeId, files: [fixture] });
    await until('Array.from(document.querySelectorAll("button")).some(b => b.innerText.includes("Run Full Extraction"))', 'PDF selected');
    await cdp.evaluate('Array.from(document.querySelectorAll("button")).find(b => b.innerText.includes("Run Full Extraction")).click()');
    await until('location.pathname === "/dashboard" && document.body.innerText.includes("Integration Candidate")', 'extraction to verification to dashboard');
    console.log('Browser: upload and dashboard passed');
    const candidateCount = await countCandidates();
    await cdp.evaluate(`document.querySelector('a[href="/evidence"]').click()`);
    await until('document.body.innerText.includes("React & Frontend Architecture")', 'stored evidence');
    console.log('Browser: stored evidence passed');
    assert.equal(await countCandidates(), candidateCount, 'Opening Evidence must not create a candidate');
    await cdp.evaluate(`document.querySelector('a[href="/gaps"]').click()`);
    await until('document.body.innerText.includes("Curated Winding Roadmap")', 'Gaps page');
    await cdp.evaluate('Array.from(document.querySelectorAll("button")).find(b => b.innerText === "Frontend Developer").click()');
    await until('document.body.innerText.includes("Advanced React & Custom Hooks")', 'Frontend Developer roadmap');
    await cdp.evaluate(`document.querySelector('a[href="/role-analyzer"]').click()`);
    await until('document.body.innerText.includes("Weighted Keyword Fit Score")', 'Role Analyzer');
    await cdp.evaluate('Array.from(document.querySelectorAll("button")).find(b => b.innerText.includes("Generate Tailored Resume")).click()');
    await until('document.body.innerText.includes("GEMINI_API_KEY is required")', 'missing-key error');
    assert.deepEqual(browserErrors, []);
    console.log('PASS real browser: upload -> extraction -> saved verification -> dashboard; Evidence read-only; all roadmap tabs; role comparison; missing-key error');
  } finally {
    socket?.close();
    browser.kill(); // Only this test-owned headless browser.
  }
}

async function main() {
  const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'resumeradar-integration-'));
  const sqlite3 = verificationRequire('sqlite3');
  let database;
  const memorySqlite = { verbose() { return { Database: function(_file, callback) { database = new sqlite3.Database(':memory:', callback); return database; } }; } };
  loadModule(path.join(verificationDirectory, 'database.js'), name => name === 'sqlite3' ? memorySqlite : verificationRequire(name));
  const query = sql => new Promise((resolve, reject) => database.all(sql, [], (error, rows) => error ? reject(error) : resolve(rows)));
  const countCandidates = async () => (await query('SELECT count(*) AS count FROM candidates'))[0].count;
  const tables = await query("SELECT name FROM sqlite_master WHERE type='table'");
  assert.ok(tables.some(row => row.name === 'candidates') && tables.some(row => row.name === 'verification_results'));
  const environment = {};
  let aiMode = 'success';
  const aiStub = { GoogleGenAI: class { constructor() { this.models = { generateContent: async () => {
    if (aiMode === 'failure') throw new Error('Mock Gemini outage');
    return { text: JSON.stringify({ fullName: 'Integration Candidate', selectedSkills: ['React'], optimizedProjects: [] }) };
  } }; } } };
  const githubStub = { verifyGitHubEvidence: async () => [
    { skill: 'React & Frontend Architecture', score: 95, status: 'Verified', sources: 1, repos: [{ name: 'react-app', url: 'https://github.com/test/react-app' }] },
    { skill: 'Docker & Containerization', score: 15, status: 'Missing Evidence', sources: 0, repos: [] },
  ] };
  let pythonArguments;
  const childStub = { execFile(command, argumentsList, _options, callback) {
    pythonArguments = { command, argumentsList };
    callback(null, JSON.stringify({ method: 'weighted keyword matching', overall_compatibility_score: 82, comparison_table: [] }));
  } };
  const app = loadApp(path.join(verificationDirectory, 'server.js'), name => {
    if (name === './database') return database;
    if (name === './githubVerifier') return githubStub;
    if (name === 'dotenv') return { config() {} };
    if (name === '@google/genai') return aiStub;
    if (name === 'child_process') return childStub;
    return verificationRequire(name);
  }, { process: { env: environment } });
  const verification = await listen(app);
  let pdf;
  try {
    assert.equal((await request(verification.url, '/api/candidates')).body.candidates.length, 0);
    assert.equal((await request(verification.url, '/api/role-analysis')).status, 404);
    assert.deepEqual((await request(verification.url, '/api/gaps-roadmap')).body.gaps, []);
    assert.equal((await request(verification.url, '/api/verify', {})).status, 400);
    assert.equal((await request(verification.url, '/api/generate-resume', {})).status, 400);
    assert.equal(await countCandidates(), 0);
    const payload = { candidate: { name: 'Integration Candidate', profile_links: { github: 'https://github.com/test', linkedin: 'https://linkedin.com/in/test' } }, skills: { technical: ['React'] }, projects: [], experience: [], certifications: [] };
    const verified = await request(verification.url, '/api/verify', payload);
    assert.equal(verified.status, 200);
    const saved = (await request(verification.url, '/api/candidates')).body.candidates[0];
    assert.equal(saved.id, verified.body.candidateId);
    assert.equal(saved.evidence.length, verified.body.evidence.length);
    assert.ok(saved.evidence.some(item => item.status.startsWith('Self-reported')));
    assert.ok((await request(verification.url, '/api/role-analysis')).body.warning);
    assert.equal((await request(verification.url, '/api/generate-resume', { targetRole: 'Data Scientist' })).status, 503);
    environment.GEMINI_API_KEY = 'mock-only';
    assert.equal((await request(verification.url, '/api/generate-resume', { targetRole: 'Data Scientist' })).body.fallback, false);
    aiMode = 'failure';
    const fallback = await request(verification.url, '/api/generate-resume', { targetRole: 'Data Scientist' });
    assert.equal(fallback.body.fallback, true);
    assert.match(fallback.body.warning, /demo fallback/);
    delete environment.GEMINI_API_KEY;
    await request(verification.url, '/api/semantic-compare?role=' + encodeURIComponent('role " & echo unsafe'));
    assert.equal(pythonArguments.command, 'python');
    assert.equal(pythonArguments.argumentsList[1], 'role " & echo unsafe');
    console.log('PASS isolated HTTP: existing SQLite schema; empty states; request validation; persistence complete before response; stored evidence; Gemini success/fallback/missing-key; shell-free Python arguments');

    const githubFile = path.join(verificationDirectory, 'githubVerifier.js');
    const githubEmpty = loadModule(githubFile, () => ({ get: async () => ({ data: [] }) }));
    const emptyEvidence = await githubEmpty.verifyGitHubEvidence('https://github.com/test', {}, []);
    assert.ok(emptyEvidence.every(item => item.sources === 0 && item.repos.length === 0));
    const githubFailed = loadModule(githubFile, () => ({ get: async () => { throw new Error('Mock network failure'); } }));
    await assert.rejects(githubFailed.verifyGitHubEvidence('https://github.com/test', {}, []), /GitHub verification failed/);
    console.log('PASS GitHub helper: missing matches have no invented sources; outage produces an error');

    const pythonOutput = execFileSync('python', ['-B', path.join(verificationDirectory, 'semanticMatcher.py'), 'Data Scientist'], { cwd: verificationDirectory, encoding: 'utf8' });
    assert.equal(JSON.parse(pythonOutput).method, 'weighted keyword matching');
    console.log('PASS relocated Python: real local database read; weighted keyword result');

    const pdfApp = loadApp(path.join(pdfDirectory, 'server.js'), pdfRequire, { __dirname: temporaryDirectory });
    pdf = await listen(pdfApp);
    assert.equal((await request(pdf.url, '/')).status, 200);
    assert.equal((await request(pdf.url, '/api/resume/upload', {})).status, 400);
    const form = new FormData(); form.append('resume', new Blob(['Not a PDF'], { type: 'text/plain' }), 'invalid.txt');
    const invalid = await fetch(pdf.url + '/api/resume/upload', { method: 'POST', body: form });
    assert.equal(invalid.status, 400);
    assert.equal((await invalid.json()).success, false);
    console.log('PASS PDF HTTP: health; missing-file validation; invalid-file JSON error; uploads path created beside relocated server');
    await browserChecks(verification.url, pdf.url, temporaryDirectory, countCandidates);
  } finally {
    if (pdf) { pdf.server.closeAllConnections(); await new Promise(resolve => pdf.server.close(resolve)); }
    verification.server.closeAllConnections();
    await new Promise(resolve => verification.server.close(resolve));
    await new Promise(resolve => database.close(resolve));
    console.log('Temporary test artifacts: ' + temporaryDirectory);
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
