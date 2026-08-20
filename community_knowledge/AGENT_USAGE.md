# Agent 使用社区短文时的规则

适用：`community_knowledge/authored/`、`permitted/`、`links/`，以及 MCP `search_community_docs` / `get_community_doc_*`。

## 定位

- 社区短文 = **实务清单、反模式、工程化提示**，不是 API 规范。
- **注册 / 方法签名 / 事件总线细节** → 仍用 `search_forge_docs` / `search_fabric_docs` / `search_neoforge_docs`。`query_api` 只覆盖 Vanilla Parchment（约 1.16.5–1.20.4）
- 本仓库整体是**人在环**副驾驶：创意、兼容取舍、API 选择、性能与调试由用户拍板；写盘 / Gradle / 拷 jar / 上传须确认。

## 强制：不清楚就去查原文

当 Agent **已经引用或准备依据**某篇社区短文写代码 / 给方案，且出现下列任一情况时，**必须先打开原文或官网再继续**，禁止用「大概记得」硬编：

1. 短文写「以官方为准 / 名称以映射为准 / 版本相关」且当前细节不确定  
2. 短文只有要点或伪代码，缺少你要用的具体方法名、参数、事件名  
3. 用户现象与短文自检清单对不上，或短文未覆盖该症状  
4. 短文互相交叉引用（如机器 → Menu → Capability），你还没读关联篇就动手  
5. `links/` 类条目（仅有 URL、无正文）— **只能打开外链阅读**，禁止假装已有全文许可去「复述整页」

### 原文从哪来

| 来源 | 做法 |
|------|------|
| 短文末「不清楚时」或 frontmatter 给出的 URL | 用浏览器 / `WebFetch` 打开该页 |
| `permitted/`（如 3993） | 可读仓库提炼；仍不确定时打开帖内原文 URL |
| `links/`（如 6071） | **仅浏览** https://www.mcmod.cn/post/6071.html 等；**禁止把网页正文拷进仓库或长篇复述** |
| API / 类名 | `search_*_docs`、`get_*_doc_full`、`query_api` — 不要用社区短文代替 |

### 输出时

- 可以说「按社区短文 X + 官方文档 Y」。  
- 若刚查了原文，用一句话标明依据（链接或文档标题），避免 silently 编造。

## 与 6071 / 3993

- **3993**（许可入库）：`permitted/mcmod-3993-forge-mod-guide/` + https://www.mcmod.cn/post/3993.html  
- **6071**（禁转载）：`links/mcmod-6071-forge-engineering.md` + 原文 URL；自写 `authored/` 是二次总结，细节以打开原文 + 官方 API 为准。
