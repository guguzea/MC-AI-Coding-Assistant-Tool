---
id: authored/ai-modeling-toolchain
title: AI 辅助建模与材质工具链（MCP 接线与选型）
summary: 想用 AI 做模型时，建模环节接外部 Blockbench MCP，插件版与 headless 版各适合什么场景；AI 出图工具在许可和还原度上的两个坑；代码与资源结构仍按本仓规则走。
tags: [modeling, model, texture, blockbench, mcp, toolchain, workflow, geckolib, bedrock, licensing]
sourceKind: authored
mcHint: 工具链本身与版本基本无关；GeckoLib、基岩落位规则以当档 search_*_docs 为准
---

# AI 辅助建模与材质工具链

建模这一段接 [Blockbench MCP](../links/blockbench-mcp.md)：https://github.com/jasonjgardner/blockbench-mcp-plugin

本仓管的是代码、资源结构和验证；模型长什么样，交给那边。这篇讲怎么接、哪里容易出问题。具体 API 和文件落位回到当档 `search_*_docs` 与规则树，本篇不给签名。

## 各环节分工

| 环节 | 谁负责 | 本仓给什么 |
|---|---|---|
| 建模、网格、UV、关键帧、粒子 | Blockbench MCP | 落位规则（`assets/<modid>/geo/`、`animations/`、`textures/` 等） |
| 基岩 `.geo.json`、Bedrock 动画 | Blockbench MCP | `minecraft:geometry` 组件写法与版本约束 |
| Java 方块、物品模型 | 模型 JSON 由它出 | `generate_model` 出 blockstate / model / items 骨架，`audit_resources` 查引用完整 |
| 纹理 | AI 出图工具 + 像素化 | 资源路径与命名约定 |
| 代码、注册、构建、映射 | 本仓 | — |
| 编译后验证 | 本仓 | 游玩测试阶梯：构建 → 静态 → 数据面 → 真机 |

## 接哪种形态

**插件版（HTTP）** 让 AI 直接操作你正开着的 Blockbench 界面，适合有人盯着、边看边改。代价是所有调用跑在编辑器单线程上，同一时刻只能有一个 agent 干活，它干活的时候你也用不了。

**headless 版（stdio）** 不开 Blockbench，直接读写 `.bbmodel` 文件，适合批量、无人值守、多个 agent 并行。代价是看不到实时画面，改错了得靠读文件或渲染图确认。

两种可以在同一个宿主里同时配，各管各的。

Windows 上如果宿主拉不起 `npx`（`.cmd` shim 的问题），配置里要用 `cmd`，把 `/c` 和 `npx` 放到参数前面。

## 容易出问题的地方

### 1. 接上了不等于做对了

MCP 通了只说明链路通，不说明模型能用。先用最小动作验证，比如让它放一个方块，再逐步加复杂度。

一上来就做带骨骼的生物，比例、朝向、UV 会一次错好几处，出了问题也分不清是链路还是模型。

### 2. 提示词管风格，不管能不能编译

社区流传的那类「只许长方体、拆骨骼、有限调色板」的提示词，解决的是像不像原版，它管不了：

- 模型 JSON 的字段名和版本对不对（Java 模型格式随版本变）
- 纹理路径有没有指到自己的命名空间
- 基岩 1.21.80 起自定义方块必须显式声明 `minecraft:geometry`（以当档官方文档为准）

这些得靠规则树和 `search_*_docs`，提示词兜不住。

### 3. AI 出图工具的两个坑

贴图常交给「AI 出图 + 像素化转换」的在线工具，用之前想清楚两件事：

- **许可**：这类站点多数只有一行版权声明，没有使用条款。没有明示许可就按保留所有权利处理，生成物能不能商用要去条款里确认，确认不了就别用。
- **不是真像素画**：缩到 16×16 往往只是把图片缩小，会糊边、丢色阶，进游戏一看就是糊的。要原版质感还是得手工画或在 Blockbench 里画。

## 和 GeckoLib 衔接

模型要给实体、方块实体或物品做骨骼动画时，选型和资源落位看 [mc-geckolib](../../knowledge/libs/all-platforms/mc-geckolib/SKILL.md)。三条要点：

1. 模型、动画、纹理的路径与注册名必须一致；
2. 动画靠代码按名字播放，声音、粒子等事件在关键帧里打点；
3. GeckoLib 的 geo 与基岩的 `.geo.json` 不是一回事，别互相套。

## 外部输出怎么处理

Blockbench MCP 吐出来的模型 JSON、`.geo.json`、动画文件，落到工程后先过一遍 `audit_resources`、`validate_bp_json` 和当档规则，再进构建。测试阶梯该跑还得跑。

## 未核实

- 各家 AI 出图工具的具体商用条款（站点随时改，用前自己看）
- 各类「增强版」「整合包」的实际内容与是否收费
