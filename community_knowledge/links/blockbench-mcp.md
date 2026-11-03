---
id: links/blockbench-mcp
title: Blockbench MCP（外链，GPL-3.0）
url: https://github.com/jasonjgardner/blockbench-mcp-plugin
summary: 建模环节用的外部 MCP。两种形态：Blockbench 插件走 HTTP（默认 :3000/bb-mcp），或 headless 走 stdio。可编 .bbmodel、导出基岩 .geo.json 与 Bedrock 动画、导出 Java 方块与物品模型 JSON，带 GeckoLib 集成。许可是 GPL-3.0。
tags: [blockbench, model, modeling, mcp, geckolib, bedrock, java, gpl, link-only, external-tool]
sourceKind: links
mcHint: 工具面与 MC 版本基本无关；GeckoLib、基岩 geometry 的落位规则仍按当档 search_*_docs
---

# Blockbench MCP

**为了不重复造轮子，模型环节的 MCP 请使用 https://github.com/jasonjgardner/blockbench-mcp-plugin**

建模、网格、UV、动画关键帧、粒子这些活交给它。这篇只记怎么装、怎么接。

## 两种形态

| 形态 | 传输 | 启动方式 | 前提 |
|---|---|---|---|
| Blockbench 桌面插件 | HTTP，默认 `127.0.0.1:3000/bb-mcp` | 在 Blockbench 里从 URL 加载插件，贴作者给的插件地址 | Blockbench 桌面版开着，且装了插件 |
| headless | stdio | `npx -y github:jasonjgardner/blockbench-mcp-plugin --root <模型目录>` | 有 Node.js，不用开 Blockbench |

端口和端点在 Blockbench 的通用设置里能改，改完宿主侧的配置要跟着改。`--root` 必填，用来限定模型目录，越界路径会被拒。

它没有发到 npm，也不在 Blockbench 官方插件市场，装法就是上面两条。

## 什么时候用

- 需要真正有形状的模型，不只是 cube 模板
- 要导出基岩 `.geo.json` 几何或 Bedrock 动画
- 要导出 Java 方块、物品模型 JSON，或 Modded Entity 的 Java 类
- 要配 GeckoLib 出模型、动画、display 设置
- 要画 UV、做 PBR 材质、写粒子效果

## 许可

GPL-3.0。仓库根 `LICENSE` 是 GPLv3 全文，`package.json` 写的是 `GPL-3.0-only`，按独立程序安装使用即可。

仓库里的 `llms.txt` 文末写着 MIT，与上面两处对不上，以 GPL-3.0 为准。
