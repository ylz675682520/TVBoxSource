#!/usr/bin/env node
/* Node.js 脚本：按顺序下载指定线路并保存到 ./line/*.json */
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const { URL } = require('url');
const punycode = require('punycode');

const LINES = [
  ["饭太硬_主站", "http://www.饭太硬.com/tv"],
  ["肥猫_主站", "http://肥猫.com/"],
  ["毒盒_单线接口", "https://毒盒.com/tv"],
  ["天微_含直播资源", "https://gitee.com/tvkj/tw/raw/main/svip.json"],
  ["运输车_含跑马灯广告栏", "https://weixine.net/ysc.json"],
  ["欧歌_需通过公众号获取", "http://tv.nxog.top/m/111.php?ou=公众号欧歌app"],
];

const OUT_DIR = path.join(__dirname, 'line');
const USER_AGENT = 'Mozilla/5.0 (compatible; downloader/1.0)';

// replaced slug with a filename-safe label generator that keeps Chinese characters
function slug(s) {
  // replace spaces with underscore, remove path-unfriendly characters but keep unicode letters (including Chinese)
  return String(s)
    .replace(/\s+/g, '_')
    .replace(/[\/\\\?\%\*\:\|\"<>\;]/g, '') // remove characters not safe for filenames
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function idnaUrl(raw) {
  try {
    const u = new URL(raw);
    if (u.hostname) {
      u.hostname = punycode.toASCII(u.hostname);
    }
    return u.toString();
  } catch (e) {
    return raw;
  }
}

function fetchText(url, timeout = 20000) {
  return new Promise((resolve, reject) => {
    let u;
    try {
      u = new URL(url);
    } catch (e) {
      return reject(e);
    }
    const lib = u.protocol === 'https:' ? https : http;
    const opts = {
      hostname: u.hostname,
      port: u.port || (u.protocol === 'https:' ? 443 : 80),
      path: u.pathname + (u.search || ''),
      method: 'GET',
      headers: { 'User-Agent': USER_AGENT },
      timeout,
    };
    const req = lib.request(opts, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        // try utf-8 decode; fallback to latin1 if weird
        let text;
        try {
          text = buf.toString('utf8');
        } catch (e) {
          text = buf.toString('latin1');
        }
        resolve({ text, statusCode: res.statusCode, headers: res.headers });
      });
    });
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy(new Error('timeout'));
    });
    req.end();
  });
}

async function ensureOut() {
  await fs.promises.mkdir(OUT_DIR, { recursive: true });
}

// replace saveAsJs with JSON saver
async function saveJson(filePath, obj) {
  await fs.promises.writeFile(filePath, JSON.stringify(obj, null, 2), { encoding: 'utf8' });
}

async function main() {
  await ensureOut();
  for (let i = 0; i < LINES.length; i++) {
    const idx = i + 1;
    const [label, url] = LINES[i];
    const safeLabel = slug(label);
    // changed: use .json extension and keep numbered, human-readable Chinese label
    const filename = `${String(idx).padStart(2, '0')}_${safeLabel}.json`;
    const outpath = path.join(OUT_DIR, filename);
    console.log(`[${idx}] ${label} -> ${url}  => ${outpath}`);
    const realUrl = idnaUrl(url);
    try {
      const { text, statusCode } = await fetchText(realUrl);
      if (!statusCode || statusCode >= 400) {
        throw new Error(`HTTP ${statusCode}`);
      }
      try {
        const obj = JSON.parse(text);
        // save as JSON file
        await saveJson(outpath, { source_url: url, fetched_at: Date.now(), data: obj });
      } catch (e) {
        // not JSON — save raw as JSON file
        await saveJson(outpath, { source_url: url, fetched_at: Date.now(), raw: text });
      }
    } catch (err) {
      // write error file with .error.json suffix
      const errpath = outpath.replace(/\.json$/, '.error.json');
      await saveJson(errpath, { source_url: url, error: String(err) });
      console.error(`  error -> saved error info to ${errpath}`);
    }
    // polite delay
    await new Promise((r) => setTimeout(r, 500));
  }
}

if (require.main === module) {
  main().catch((e) => {
    console.error('Fatal:', e);
    process.exit(1);
  });
}
