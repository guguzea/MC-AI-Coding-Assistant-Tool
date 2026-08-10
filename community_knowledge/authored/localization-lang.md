---
id: authored/localization-lang
title: 本地化键与 lang JSON
tags: [localization, lang, i18n, resources]
summary: 禁止硬编码玩家可见文本；assets 下 lang；占位符与双语；MCP localize_mod / mc-localize-mod。
sourceKind: authored
---

# 本地化键与 lang JSON

自写短文。

## 原则

玩家可见字符串（物品名、页签、消息、成就）应走 **翻译键**，不要 `new TextComponent("中文写死")` / `Component.literal("...")` 当正式显示（调试除外）。

好处：多语言、整合包汉化、键统一可搜。

## 文件位置

```
src/main/resources/assets/<modid>/lang/
  en_us.json
  zh_cn.json
```

至少提供英文；中文模组再加 `zh_cn.json`。JSON 对象：键 → 字符串。

## 常见键格式

| 用途 | 键模式（示例） |
|------|----------------|
| 物品 | `item.<modid>.<registry_name>` |
| 方块 | `block.<modid>.<registry_name>` |
| 创造页签 | `itemGroup.<modid>.<name>`（以代码里 `translatable` 为准） |
| 进度 | `advancements.<modid>.….title` / `.description` |
| 自定义消息 | 自定，如 `message.<modid>.welcome` |

代码：

```java
Component.translatable("item.examplemod.raw_material");
Component.translatable("message.examplemod.welcome", player.getName());
```

`%s` / `%d` 等占位符与参数顺序一致。

## Tooltip

常用第二键：`item.<modid>.<name>.tooltip`，在 `appendHoverText` 里 `translatable`。

## 自检

- 创造栏与物品悬停显示译名而非原始键。  
- 切换语言包后名称变化。  
- 注册名改了是否同步改 lang 键。

## MCP：`localize_mod` / 工作流 `mc-localize-mod`

补缺键、对比占位符、从第三方 jar 抽 lang、生成资源包草稿时用 MCP 工具 **`localize_mod`**（不联网机翻；中文由 Agent 填，工具标 `needsTranslation`）。

| mode | action | 用途 |
|------|--------|------|
| `own` | `diff` | 对比源与 `zh_cn`：`missingInZh` / `extraInZh` / `placeholderMismatches` / `identicalToEn`；见 `keyRenameHint` |
| `own` | `draft_zh` | 保留已有中文，缺键用源文占位 |
| `third_party` | `extract` | 从本地 jar 抽源语言 + 已有 zh；多命名空间看 `availableNamespaces` |
| `third_party` | `pack_draft` | 产出 `pack.mcmeta` + `assets/<ns>/lang/zh_cn.json`（默认不写盘） |

源语言回退：显式 `sourceLocale` → `en_us` → 其它 `en_*` → 其它非中文 locale。仅有 `zh_cn`/`zh_tw` 时返回 `Chinese_ready_in`（无法自动检测缺键）。  
工作流全文：`get_workflow_template` → `mc-localize-mod`。新建骨架仍可用 `generate_lang`。

## 不清楚时

- 创造页签键：`authored/creative-tabs-1.20`  
- 资源包格式：`knowledge/common/` 或官方 wiki；勿臆造键前缀；`pack_draft` 的 `packFormatNeedsReview` 须向用户核对
