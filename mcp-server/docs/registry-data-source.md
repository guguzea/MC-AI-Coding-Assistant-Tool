# Registry 数据源 Spike（B0-a）— 已闭环

## 结论

**选定主路径 B/C：PrismarineJS/minecraft-data（MIT）经 jsDelivr 拉取 → 本地 JSON → sqlite。**

| 路径 | 状态 |
|------|------|
| A：`--from-reports=<dir>` | 已实现（可选） |
| B/C：minecraft-data CDN | **默认主路径，已跑通** |

## 复现

```bash
cd mcp-server
npm run fetch:vanilla-registries -- --version=1.20.1 --force
npm run fetch:vanilla-registries -- --version=1.21.1 --force
```

## 规模（实测）

- 1.20.1：blocks **1003**、items **1255**、合计约 **3963**
- 1.21.1：blocks **1060**、items **1333**

`manifest.source` = `minecraft-data@master`（不再是 curated-minimal-fixture）。
