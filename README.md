# TVBoxSource - 项目已重组优化 ✓

> **2026年4月3日**: 项目结构已完全重组，优化目录层级和文件组织。

## 📁 新的项目结构

```
TVBoxSource/
├── configs/              # ✨ 所有配置文件 (收集整理)
│   ├── sources/         # 数据源
│   │   ├── cangkulist/  # 内源库
│   │   ├── json/        # 通用配置
│   │   ├── line/        # 线路配置
│   │   └── livebroadcast/  # 直播源
│   ├── scrapers/        # 爬虫框架配置 (XBPQ/XYQBiu/XYQHiker)
│   └── demo/            # 示例和调试文件
│
├── libs/                 # ✨ 核心库文件 (统一管理)
│   ├── js/              # JavaScript库
│   ├── py/              # Python脚本
│   ├── core/            # 核心库 (api + drpy_libs 合并)
│   └── plugins/         # 插件和扩展库
│
├── packages/             # ✨ 预编译包 (有序组织)
│   ├── parsers/         # 播放器解析JAR
│   └── plugins/         # 插件JAR
│
├── docs/                 # 文档
│   └── README.md        # 重组说明文档
│
└── README.md            # 本文件

```

## 🔄 优化要点

| 方面 | 改进 |
|------|------|
| **目录深度** | 15+ 顶级目录 → 4 + docs |
| **文件组织** | 按功能分类，避免重复 |
| **可维护性** | 相同类型文件统一location |
| **易用性** | 新用户更快上手 |

## 📋 迁移清单

### 配置文件 → configs/
- XBPQ/ → configs/scrapers/xbpq/
- XYQBiu/ → configs/scrapers/xyqbiu/
- XYQHiker/ → configs/scrapers/xyqhiker/
- 18/ → configs/demo/
- json/ → configs/sources/json/
- line/ → configs/sources/line/
- livebroadcast/ → configs/sources/livebroadcast/
- cangkulist/ → configs/sources/cangkulist/

### 库文件 → libs/
- js/ → libs/js/
- py/ → libs/py/
- api/ + drpy_libs/ → libs/core/
- lib/ → libs/plugins/

### 包文件 → packages/
- jar/ → packages/parsers/
- jars/ → packages/plugins/

## ✅ 验证结果

- ✓ 配置文件: 完整转移到 configs/
- ✓ 库文件: 整合到 libs/ (统一管理)
- ✓ 包文件: 整理到 packages/ (分类清晰)
- ✓ 文档: 新增 docs/README.md (使用说明)

## 📝 注意事项

1. 如果有外部脚本引用旧目录路径，需要更新为新路径
2. cangkulist/ 保持在 configs/sources/ 方便使用
3. 所有JS库现统一在 libs/js/，便于共享
4. 核心驱动库已合并到 libs/core/

---

**项目优化完成！** 结构更清晰，维护更方便。

