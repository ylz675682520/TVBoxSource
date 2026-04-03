# TVBoxSource 项目重组文档

## 新目录结构说明

### configs/ - 所有配置文件
- **sources/** - 数据源配置
  - `cangkulist/` - 数据源库（原保留）
  - `json/` - 通用JSON配置
  - `line/` - 线路配置
  - `livebroadcast/` - 直播源配置
  
- **scrapers/** - 爬虫框架配置
  - `xbpq/` - XBPQ框架配置（原XBPQ/）
  - `xyqbiu/` - XYQBiu框架配置（原XYQBiu/）
  - `xyqhiker/` - XYQHiker框架配置（原XYQHiker/）
  
- **demo/** - 示例和调试文件
  - 18+ 相关配置
  - 调试助手文件
  - myzone.json 主配置

### libs/ - 所有库文件和脚本
- **js/** - JavaScript库和脚本
- **py/** - Python脚本文件
- **core/** - 核心库（合并api/和drpy_libs/）
- **plugins/** - 各类插件库

### packages/ - 预编译包
- **parsers/** - 播放器解析JAR包（原jar/）
- **plugins/** - 插件JAR包（原jars/）

### docs/ - 文档和说明
- 此README

## 迁移清单

### 旧目录 -> 新位置
- XBPQ/ -> configs/scrapers/xbpq/
- XYQBiu/ -> configs/scrapers/xyqbiu/
- XYQHiker/ -> configs/scrapers/xyqhiker/
- 18/ -> configs/demo/18/
- json/ -> configs/sources/json/
- line/ -> configs/sources/line/
- livebroadcast/ -> configs/sources/livebroadcast/
- cangkulist/ -> configs/sources/cangkulist/
- js/ -> libs/js/
- py/ -> libs/py/
- api/ + drpy_libs/ -> libs/core/
- lib/ -> libs/plugins/
- jar/ -> packages/parsers/
- jars/ -> packages/plugins/

## 优点

1. **层级简化**：15+个顶级目录 -> 4个主目录（configs, libs, packages, docs）
2. **组织清晰**：按用途（配置、库、包）而非技巧划分
3. **易于维护**：相同类型的文件集中管理
4. **避免重复**：库文件有统一位置
5. **清晰导航**：新用户更容易理解项目结构

