const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const baseUrl = 'https://gcore.jsdelivr.net/gh/ylz675682520/TVBoxSource@main';

// 更完整的路径映射
const pathMappings = [
  // 饭太硬
  ['./饭太硬/', `${baseUrl}/configs/sources/line/ziyong/饭太硬/`],
  
  // 香雅情
  ['./香雅情/', `${baseUrl}/configs/sources/line/ziyong/香雅情/`],
  
  // 运输车
  ['./运输车/', `${baseUrl}/configs/sources/line/ziyong/运输车/`],
  
  // 菜妮丝
  ['./菜妮丝/', `${baseUrl}/configs/sources/line/ziyong/菜妮丝/`],
  
  // 肥猫
  ['./肥猫/', `${baseUrl}/configs/sources/line/ziyong/肥猫/`],
  
  // 巧儿
  ['./巧儿/', `${baseUrl}/configs/sources/line/ziyong/巧儿/`],
  
  // 夜猫子
  ['./夜猫子/', `${baseUrl}/configs/sources/line/ziyong/夜猫子/`],
  
  // 多多
  ['./多多/', `${baseUrl}/configs/sources/line/ziyong/多多/`],
  
  // 南风
  ['./南风/', `${baseUrl}/configs/sources/line/hot/NanFeng/`],
  
  // dxawi
  ['./dxawi/', `${baseUrl}/configs/sources/line/hot/dxawi/`],
  
  // lib (通用)
  ['./lib/', `${baseUrl}/configs/sources/line/lib/`],
  
  // ext (catcr等)
  ['./ext/', `${baseUrl}/configs/sources/line/hot/ext/`],
  
  // packages/parsers (带md5的)
  ['./packages/parsers/moyu.jar', `${baseUrl}/packages/parsers/moyu.jar`],
  ['./packages/parsers/ok.jar', `${baseUrl}/packages/parsers/ok.jar`],
  ['./packages/parsers/wex.jar', `${baseUrl}/packages/parsers/wex.jar`],
  ['./packages/parsers/yt-aa.jar', `${baseUrl}/packages/parsers/yt-aa.jar`],
  ['./packages/parsers/fty.jar', `${baseUrl}/packages/parsers/fty.jar`],
  ['./packages/parsers/spider.jar', `${baseUrl}/packages/parsers/spider.jar`],
  ['./packages/parsers/XBPQ.jar', `${baseUrl}/packages/parsers/XBPQ.jar`],
  ['./packages/parsers/fm.jar', `${baseUrl}/packages/parsers/fm.jar`],
];

// Files to process
const filesToProcess = [
  'configs/sources/line/ziyong/饭太硬.json',
  'configs/sources/line/ziyong/香雅情.json',
  'configs/sources/line/ziyong/运输车.json',
  'configs/sources/line/ziyong/菜妮丝.json',
  'configs/sources/line/ziyong/肥猫.json',
  'configs/sources/line/ziyong/巧儿.json',
  'configs/sources/line/ziyong/巧儿02.json',
  'configs/sources/line/ziyong/夜猫子.json',
  'configs/sources/line/ziyong/多多.json',
  'configs/sources/line/ziyong/wex.json',
  'configs/sources/line/hot/moyu.json',
  'configs/sources/line/hot/aa.json',
  'configs/sources/line/hot/NanFeng.json',
  'configs/sources/line/hot/dxawi.json',
  'configs/sources/line/hot/catcr.json',
  'configs/sources/line/hot/fty.json',
  'configs/sources/line/hot/ok.json',
];

let totalReplacements = 0;
let filesProcessed = 0;

filesToProcess.forEach(file => {
  const filePath = path.join(rootDir, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${file}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  pathMappings.forEach(([oldPath, newPath]) => {
    if (content.includes(oldPath)) {
      const regex = new RegExp(oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      content = content.replace(regex, newPath);
      modified = true;
      totalReplacements++;
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${file}`);
    filesProcessed++;
  } else {
    console.log(`⏭️ No changes: ${file}`);
  }
});

console.log(`\n=== Done ===`);
console.log(`Files processed: ${filesProcessed}`);
console.log(`Total replacements: ${totalReplacements}`);