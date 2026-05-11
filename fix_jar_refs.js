const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const baseUrl = 'https://gcore.jsdelivr.net/gh/ylz675682520/TVBoxSource@main';

// packages/parsers目录下的JAR文件
const parsersDir = path.join(rootDir, 'packages/parsers');
const availableParsers = fs.readdirSync(parsersDir).filter(f => f.endsWith('.jar'));

console.log('可用的parsers JAR:', availableParsers);

// JAR名称到packages/parsers路径的映射
const jarMappings = {
  'fm.jar': `${baseUrl}/packages/parsers/fm.jar`,
  'spider.jar': `${baseUrl}/packages/parsers/spider.jar`,
  'fty.jar': `${baseUrl}/packages/parsers/fty.jar`,
  'moyu.jar': `${baseUrl}/packages/parsers/moyu.jar`,
  'ok.jar': `${baseUrl}/packages/parsers/ok.jar`,
  'wex.jar': `${baseUrl}/packages/parsers/wex.jar`,
  'yt-aa.jar': `${baseUrl}/packages/parsers/yt-aa.jar`,
  'XBPQ.jar': `${baseUrl}/packages/parsers/XBPQ.jar`,
  'svip.jar': `${baseUrl}/packages/parsers/svip.jar`,
  'xs.jar': `${baseUrl}/packages/parsers/xs.jar`,
  'zx.jar': `${baseUrl}/packages/parsers/zx.jar`,
  'qf.jar': `${baseUrl}/packages/parsers/qf.jar`,
  'netflav.jar': `${baseUrl}/packages/parsers/netflav.jar`,
  'fenghuang.jar': `${baseUrl}/packages/parsers/fenghuang.jar`,
  'yt_xyz.jar': `${baseUrl}/packages/parsers/yt_xyz.jar`,
  'XBPQ1.jar': `${baseUrl}/packages/parsers/XBPQ1.jar`,
};

// plugins目录下的JAR
const pluginsMappings = {
  'huban.jar': `${baseUrl}/packages/plugins/huban.jar`,
  'config.jar': `${baseUrl}/packages/plugins/config.jar`,
  '三六零弹幕.jar': `${baseUrl}/packages/plugins/三六零弹幕.jar`,
};

// 需要替换的外部JAR URL模式
const externalJarPatterns = [
  // GitHub raw
  { pattern: /https?:\/\/raw\.githubusercontent\.com\/[^"'\s]+?\/([^"'\s]+?\.jar)/g, extractJar: (m) => m.split('/').pop() },
  // GitHub blob
  { pattern: /https?:\/\/github\.com\/[^"'\s]+?\/blob\/[^"'\s]+?\/([^"'\s]+?\.jar)(\?raw=true)?/g, extractJar: (m) => m.split('/').pop().split('?')[0] },
  // ghproxy/ghfast等代理
  { pattern: /https?:\/\/[^"'\s]*?(?:ghproxy|ghfast|gitmirror)[^"'\s]*?\/[^"'\s]+?\/([^"'\s]+?\.jar)/g, extractJar: (m) => m.split('/').pop() },
  // agit.ai
  { pattern: /https?:\/\/agit\.ai\/[^"'\s]+?\/raw\/[^"'\s]+?\/([^"'\s]+?\.jar)/g, extractJar: (m) => m.split('/').pop() },
  // gitee
  { pattern: /https?:\/\/gitee\.com\/[^"'\s]+?\/raw\/[^"'\s]+?\/([^"'\s]+?\.jar)/g, extractJar: (m) => m.split('/').pop() },
  // kstore/pan.shangui/其他网盘
  { pattern: /https?:\/\/[^"'\s]*?(?:kstore|shangui|abeiyun)[^"'\s]*?\/[^"'\s]+?\/([^"'\s]+?\.jar)/g, extractJar: (m) => m.split('/').pop() },
  // 9xi4o
  { pattern: /https?:\/\/9xi4o\.tk\/[^"'\s]+?\/([^"'\s]+?\.jar)/g, extractJar: (m) => m.split('/').pop() },
  // youdu.fan
  { pattern: /https?:\/\/[^"'\s]*?youdu\.fan[^"'\s]*?\/[^"'\s]+?\/([^"'\s]+?\.jar)/g, extractJar: (m) => m.split('/').pop() },
  // cdn.qiaoji8
  { pattern: /https?:\/\/cdn\.qiaoji8\.com\/([^"'\s]+?\.jar)/g, extractJar: (m) => m.split('/').pop() },
  // clun.top
  { pattern: /https?:\/\/gh\.clun\.top\/[^"'\s]+?\/([^"'\s]+?\.jar)/g, extractJar: (m) => m.split('/').pop() },
  // 1drv
  { pattern: /https?:\/\/link\.jscdn\.cn\/1drv\/[^"'\s]+/g, extractJar: () => null },
  // 通用匹配任何外部JAR URL
  { pattern: /https?:\/\/[^"'\s]+?\/([^"'\s]+?\.jar)(;md5;[a-f0-9]+)?/g, extractJar: (m) => m.split('/').pop().split(';')[0] },
];

// 获取所有JSON文件
function getAllJsonFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results = results.concat(getAllJsonFiles(filePath));
    } else if (file.endsWith('.json')) {
      results.push(filePath);
    }
  });
  return results;
}

const lineDir = path.join(rootDir, 'configs/sources/line');
const jsonFiles = getAllJsonFiles(lineDir);

let totalReplacements = 0;
let filesModified = 0;

jsonFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  const relativePath = path.relative(rootDir, filePath);

  // 处理所有外部JAR URL
  externalJarPatterns.forEach(({ pattern, extractJar }) => {
    content = content.replace(pattern, (match) => {
      const jarName = extractJar(match);
      if (!jarName) return match;
      
      // 尝试匹配
      const cleanJarName = jarName.replace(/%[0-9A-Fa-f]{2}/g, (m) => {
        try { return decodeURIComponent(m); } catch(e) { return m; }
      });
      
      // 精确匹配
      if (jarMappings[cleanJarName]) {
        modified = true;
        totalReplacements++;
        return jarMappings[cleanJarName];
      }
      if (pluginsMappings[cleanJarName]) {
        modified = true;
        totalReplacements++;
        return pluginsMappings[cleanJarName];
      }
      
      // 模糊匹配（包含jar名称）
      for (const [key, value] of Object.entries(jarMappings)) {
        if (cleanJarName.toLowerCase().includes(key.toLowerCase().replace('.jar', ''))) {
          modified = true;
          totalReplacements++;
          return value;
        }
      }
      
      // 无法匹配，保留原样
      return match;
    });
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${relativePath}`);
    filesModified++;
  }
});

console.log(`\n=== 完成 ===`);
console.log(`修改文件数: ${filesModified}`);
console.log(`替换次数: ${totalReplacements}`);