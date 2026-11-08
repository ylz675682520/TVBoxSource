# TVBoxSource

个人 TVBox 资源库，三层架构：多仓 → 单仓 → 线路。

## 入口地址（可视App配置）

```
https://gh-proxy.com/https://raw.githubusercontent.com/ylz675682520/TVBoxSource/main/myzone.json
```

> 使用 GitHub raw 经 gh-proxy.com 加速（jsdelivr 已全面封禁 `.jar`，fastly 当前不可用）。地址由 `.../gh/<owner>/<repo>@<ref>/<path>` 改为 `.../raw.githubusercontent.com/<owner>/<repo>/<ref>/<path>`。推送后通常数分钟内生效，无需手动 purge。

## 目录结构

```
TVBoxSource/
├── myzone.json                     # 第1层：多仓入口（storeHouse）
├── cangkulist/                     # 第2层：单仓文件（urls）
│   ├── hot.json                    #   热门线路（本地line文件）
│   ├── hot2.json                   #   第三方线路（外部URL）
│   ├── ziyong.json                 #   自用线路（本地line文件）
│   ├── 18.json                     #   18+线路（本地line文件）
│   └── live.json                   #   直播源
├── configs/
│   ├── sources/
│   │   ├── line/                   # 第3层：线路文件（sites/parses/lives）
│   │   │   ├── hot/                #   热门线路内容
│   │   │   ├── ziyong/             #   自用线路内容
│   │   │   └── 18line/             #   18+线路内容
│   │   ├── json/                   # drpy站点ext引用的配置
│   │   └── livebroadcast/          # 直播源文件（txt/json）
│   └── scrapers/
│       ├── xbpq/                   # XBPQ爬虫规则
│       └── xyqhiker/               # XYQHiker爬虫规则
├── libs/
│   ├── js/                         # drpy引擎JS脚本（仅保留被引用的）
│   └── py/                         # hipy引擎PY脚本（仅保留被引用的）
└── packages/parsers/               # spider JAR解码包
```

## 代码规范

| 层级 | 文件 | 根字段 | 子字段 |
|------|------|--------|--------|
| 多仓 | myzone.json | `storeHouse` | `sourceName` / `sourceUrl` |
| 单仓 | cangkulist/*.json | `urls` | `url` / `name` |
| 线路 | line/**/*.json | `spider`/`sites`/`parses`/`lives` | 见下 |

**sites 站点字段**：`key`（唯一标识）、`name`、`type`（0爬虫/1采集/3 JS）、`api`、`ext`、`searchable`、`quickSearch`、`filterable`

## 维护流程

### 添加/修改线路
1. 线路文件放入 `configs/sources/line/` 对应子目录（UTF-8无BOM，标准JSON）
2. 在 `cangkulist/` 对应单仓文件中添加条目（用绝对CDN路径）
3. 若线路引用 JAR，把 JAR 放入 `packages/parsers/`，spider 用绝对CDN路径
4. 提交推送：`git add -A; git commit -m "..."; git push`
5. 推送后等待数分钟（代理缓存过期）即可，无需手动刷新 CDN

### 检查引用有效性
所有内部引用必须用绝对CDN路径，例如：
```
https://gh-proxy.com/https://raw.githubusercontent.com/ylz675682520/TVBoxSource/main/libs/js/drpy2.min.js
```
禁止相对路径（`./js/`、`./json/`）——line文件层级较深，相对路径会404。

### 已知说明
- `configs/scrapers/xbpq/` 下4个文件（巴蜀/星辰/泥巴/流光）含原始控制字符，非严格JSON，TVBox宽容解析可正常使用
- `hot2.json` 为外部第三方线路，链接随上游变动，需定期检查有效性
