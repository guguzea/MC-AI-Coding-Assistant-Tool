# Vanilla registry pipeline (Wave B / B0-a)

## 选定主路径（已闭环）

**PrismarineJS/minecraft-data（MIT）→ 本地 JSON → `registry-index.sqlite`**

```bash
cd mcp-server
npm run fetch:vanilla-registries -- --version=1.20.1 --force
npm run fetch:vanilla-registries -- --version=1.21.1 --force
```

可选路径 A（官方 reports）：

```bash
npm run fetch:vanilla-registries -- --version=1.20.1 --from-reports=H:/path/to/reports --force
```

仅从已有 JSON 重建 sqlite（不联网）：

```bash
npm run build:vanilla-registries -- --version=1.20.1 --force
```

## 验收规模（约）

| 版本 | blocks | items | 合计（含 biomes/particles/effects/enchantments/sounds） |
|------|--------|-------|----------------------------------------------------------|
| 1.20.1 | ~1003 | ~1255 | ~3963 |
| 1.21.1 | ~1060 | ~1333 | ~更高 |

`manifest.json` 的 `source` 应为 `minecraft-data@master`（或 `reports:…`），**不应**再是 `curated-minimal-fixture`。

## 许可

见根目录 `THIRD_PARTY_NOTICES.md` 与 `data/vanilla_ATTRIBUTION.md`。

## 与 convert_mapping

`query_registry` 返回 `nameLayer: "registry_id"`；类/方法映射请用 `convert_mapping`。
