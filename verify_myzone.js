const https = require('https');
const http = require('http');

function fetch(url, timeout = 15000, redirects = 0) {
  return new Promise(resolve => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, { timeout, headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      // 跟随重定向（TVBox同样会跟随）
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && redirects < 3) {
        res.resume();
        const next = new URL(res.headers.location, url).href;
        return fetch(next, timeout, redirects + 1).then(resolve);
      }
      if (res.statusCode !== 200) { res.resume(); return resolve({ ok: false, status: res.statusCode }); }
      let body = '';
      res.on('data', c => { body += c; if (body.length > 30 * 1024 * 1024) req.destroy(); });
      res.on('end', () => resolve({ ok: true, status: 200, body }));
      res.on('error', () => resolve({ ok: false, status: 'read-err' }));
    });
    req.on('timeout', () => { req.destroy(); resolve({ ok: false, status: 'timeout' }); });
    req.on('error', e => resolve({ ok: false, status: e.code || e.message }));
  });
}

function parseLines(body) {
  const clean = body.replace(/\uFEFF/g, '').trim();
  const data = JSON.parse(clean);
  if (data.storeHouse) return { type: '多仓', items: data.storeHouse.map(x => ({ name: x.sourceName, url: x.sourceUrl })) };
  if (data.urls) return { type: '单仓', items: data.urls.map(x => ({ name: x.name || x.url, url: x.url })) };
  if (data.sites) return { type: '线路', items: [] };
  return { type: '未知', items: [] };
}

(async () => {
  // 第0层：myzone.json 本地文件作为入口（TVBox实际读取CDN，两者内容一致以推送为准）
  const fs = require('fs');
  const myzone = JSON.parse(fs.readFileSync('myzone.json', 'utf8').replace(/\uFEFF/g, ''));
  console.log('====== 第1层: myzone.json 仓库可达性 ======');
  let total = 0, okCount = 0, fail = [];

  for (const wh of myzone.storeHouse) {
    const r = await fetch(wh.sourceUrl);
    total++;
    if (!r.ok) {
      fail.push(`[仓库] ${wh.sourceName} -> ${r.status}`);
      console.log(`❌ ${wh.sourceName} -> ${r.status}`);
      continue;
    }
    let parsed;
    try { parsed = parseLines(r.body); } catch (e) {
      fail.push(`[仓库] ${wh.sourceName} -> JSON解析失败: ${e.message}`);
      console.log(`❌ ${wh.sourceName} -> JSON解析失败`);
      continue;
    }
    console.log(`✅ ${wh.sourceName} (200, ${parsed.type}, 内含${parsed.items.length}条)`);
    okCount++;

    // 第2层：检测仓库内每条线路
    let subOk = 0, subFail = [];
    for (const item of parsed.items) {
      const sr = await fetch(item.url);
      if (sr.ok) {
        try {
          const p = parseLines(sr.body);
          subOk++;
          console.log(`   ✅ ${item.name} (${p.type})`);
        } catch (e) {
          subFail.push(`${item.name} -> JSON无效`);
          console.log(`   ⚠️ ${item.name} -> 返回200但非有效TVBox JSON`);
        }
      } else {
        subFail.push(`${item.name} -> ${sr.status}`);
        console.log(`   ❌ ${item.name} -> ${sr.status}`);
      }
      await new Promise(s => setTimeout(s, 300));
    }
    console.log(`   —— ${wh.sourceName}: ${subOk}/${parsed.items.length} 可用${subFail.length ? '，失效: ' + subFail.join('; ') : ''}\n`);
    total += parsed.items.length;
    okCount += subOk;
    subFail.forEach(f => fail.push(`[${wh.sourceName}] ${f}`));
  }

  console.log('====== 汇总 ======');
  console.log(`总计检测: ${total} 个URL`);
  console.log(`可用: ${okCount}`);
  console.log(`失效: ${fail.length}`);
  fail.forEach(f => console.log('  ❌ ' + f));
})();
