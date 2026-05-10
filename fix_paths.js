const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const baseUrl = 'https://gcore.jsdelivr.net/gh/ylz675682520/TVBoxSource@main';

// Define all path mappings
const mappings = [
  // 饭太硬
  ['./饭太硬/spider.jar', `${baseUrl}/packages/parsers/spider.jar`],
  ['./饭太硬/drpy.min.js', `${baseUrl}/configs/sources/line/ziyong/饭太硬/drpy.min.js`],
  ['./饭太硬/js/', `${baseUrl}/configs/sources/line/ziyong/饭太硬/js/`],
  ['./饭太硬/json/', `${baseUrl}/configs/sources/line/ziyong/饭太硬/json/`],
  ['./饭太硬/live.txt', `${baseUrl}/configs/sources/line/ziyong/饭太硬/live.txt`],
  ['./饭太硬/TV.txt', `${baseUrl}/configs/sources/line/ziyong/饭太硬/TV.txt`],
  
  // 香雅情
  ['./香雅情/spider.jar', `${baseUrl}/packages/parsers/spider.jar`],
  
  // 运输车
  ['./运输车/spider.jar', `${baseUrl}/packages/parsers/spider.jar`],
  
  // 菜妮丝
  ['./菜妮丝/spider.jar', `${baseUrl}/packages/parsers/spider.jar`],
  
  // 肥猫
  ['./肥猫/spider.jar', `${baseUrl}/packages/parsers/spider.jar`],
  ['./肥猫/jars/Alist2.jar', `${baseUrl}/packages/parsers/spider.jar`],
  ['./肥猫/jars/csp_search_Yisou.jar', `${baseUrl}/packages/parsers/spider.jar`],
  
  // 巧儿
  ['./巧儿/spider.jar', `${baseUrl}/packages/parsers/spider.jar`],
  
  // 夜猫子
  ['./夜猫子/spider.jar', `${baseUrl}/packages/parsers/spider.jar`],
  ['./夜猫子/jars/csp_XYQHikerdyx.jar', `${baseUrl}/packages/parsers/spider.jar`],
  ['./夜猫子/jars/csp_XBPQ.jar', `${baseUrl}/packages/parsers/XBPQ.jar`],
  ['./夜猫子/jars/csp_Nbys.jar', `${baseUrl}/packages/parsers/spider.jar`],
  ['./夜猫子/jars/Gitcafe.jar', `${baseUrl}/packages/parsers/spider.jar`],
  ['./夜猫子/jars/drpy_js_蜻蜓FM.jar', `${baseUrl}/packages/parsers/spider.jar`],
  ['./夜猫子/jars/Alist2.jar', `${baseUrl}/packages/parsers/spider.jar`],
  
  // 多多
  ['./多多/spider.jar', `${baseUrl}/packages/parsers/spider.jar`],
  ['./多多/jars/csp_阿里搜索.jar', `${baseUrl}/packages/parsers/spider.jar`],
  ['./多多/jars/csp_XYQHikerdyx.jar', `${baseUrl}/packages/parsers/spider.jar`],
  
  // 南风
  ['./南风/spider.jar', `${baseUrl}/packages/parsers/spider.jar`],
  ['./南风/jars/Gitcafe.jar', `${baseUrl}/packages/parsers/spider.jar`],
  
  // dxawi
  ['./dxawi/spider.jar', `${baseUrl}/packages/parsers/spider.jar`],
  
  // lib
  ['./lib/fty.jar', `${baseUrl}/packages/parsers/fty.jar`],
  ['./lib/xyq.jar', `${baseUrl}/packages/parsers/spider.jar`],
  ['./lib/dj0.jar', `${baseUrl}/packages/parsers/spider.jar`],
  ['./lib/guodaxia.jar', `${baseUrl}/packages/parsers/spider.jar`],
  ['./lib/alisz.jar', `${baseUrl}/packages/parsers/spider.jar`],
  ['./lib/mypg.jar', `${baseUrl}/packages/parsers/spider.jar`],
  
  // packages
  ['./packages/plugins/huban.jar', `${baseUrl}/packages/parsers/spider.jar`],
  ['./packages/parsers/yt-aa.jar', `${baseUrl}/packages/parsers/yt-aa.jar`],
  
  // jar
  ['./jar/fm.jar', `${baseUrl}/packages/parsers/fm.jar`],
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
  'configs/sources/line/hot/moyu.json',
  'configs/sources/line/hot/aa.json',
  'configs/sources/line/hot/NanFeng.json',
  'configs/sources/line/hot/dxawi.json',
  'configs/sources/line/hot/catcr.json',
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
  
  mappings.forEach(([oldPath, newPath]) => {
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