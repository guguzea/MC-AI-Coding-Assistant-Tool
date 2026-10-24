# dsh-mc-skill

MC AI Coding Assistant 的 **DSH 原生插件**。装上以后，DSH 会按你**当前打开的模组工程**自动判断平台与精确 MC 版本，只挂那一档的技能，并把该档的三条底座规则注入 system prompt。

只读知识库仓库，不写盘、不跑 Gradle、不拷 jar。

## 它解决什么

MC_skill 仓库里有 57 个平台档、每档约 35 个技能，同名技能（`mc-block` / `mc-registry` …）在各档都有一份。把这些平铺给 AI，会同时踩两个坑：同名撞车，以及要把上千份镜像拷进你的工程。

本插件改成**按工程定档**：

| 能力 | 怎么做到 |
|---|---|
| 只挂当前档的技能 | provider 的 `list({cwd})` 拿会话工作目录，用仓库自己的 `detectModProject` 判平台/版本，只返回这一档 |
| 规则自动注入 | 该档的 `00 / 01 / 09` 作为一段 system prompt，档位一变规则跟着换 |
| 按话题加规则 | `/mc-skill topic gui` 之类把对应规则并进同一段（复用仓库自己的 topic 判据，不重写表） |
| 临时追加单条规则 | `/mc-skill rule 10` 把该条规则注入**下一个步骤**，不动常驻段 |
| 免手动加载规则 | 不用再手动调 `activate_platform_pack action=session` |
| 零 token 查询 | `/mc-skill` 的前述子命令都是纯 UI 面，不进模型消息（只有 `rule` 会注入） |
| 库模组技能也进目录 | `knowledge/libs` 的 20 个库 skill 按平台追加（描述带 `[库]` 前缀，同名时平台档优先） |
| 免摩擦探测 | `mc_skill_detect_project` 原生工具，不用传绝对路径 |
| 文档检索免 MCP | `/mc-skill doc <词>` 直接调仓库的 docs-platform：当前档 + 语义检索 + 回显摘要，不依赖 MCP 挂载 |

## 安装

**前提**：知识库仓库已编译 —— `cd <仓库根>/mcp-server && npm ci && npm run build`（插件复用的是 `dist/platform-pack/*`）。

1. 把本目录拷进你的 profile 的 `node_modules`：

```text
<dshHome>/profiles/<profile>/node_modules/dsh-mc-skill/
```

2. **同时**加进该 profile `package.json` 的 `dependencies`（本机路径）与 `dsh.profile.bundles`：

```json
{ "dependencies": { "dsh-mc-skill": "file:./node_modules/dsh-mc-skill" } }
```

> 只加 `bundles` **不够**：运行时的模块解析器（`createRuntimeResolution` 的 `installedProfilePackageNames`）只认 `dependencies`/`peerDependencies` 里声明过、且在 `node_modules` 里存在的包。漏了这一步，插件行会被当成裸包名从 DSH 安装目录解析 ⇒ `ERR_MODULE_NOT_FOUND`。

然后是 bundles：

```json
{ "dsh": { "profile": { "bundles": ["@deepseek-ai/dsh-base", "dsh-mc-skill"] } } }
```

3. 改本包的 `cordis.patch.yml`，把 `repoRoot` 换成你机器上知识库仓库的**绝对路径**（正斜杠）；

4. 重启 DSH 会话。

> `cordis.patch.yml` 里的 `name` 用的是 `./lib/index.js`（相对 patch 文件的路径），**不要**改成裸包名 `dsh-mc-skill`：裸包名会从 DSH 安装目录（asar 内）解析，而那里没有这个包。

## 验证

装好后在 DSH 里：

```text
/mc-skill                   # 档位 / 技能数 / 注入的规则号与字节数 / 当前话题
/mc-skill skills            # 平台技能 + 库模组技能（分两段）
/mc-skill libs              # 只列库模组技能
/mc-skill rules             # 只看法定底座规则
/mc-skill topic gui 02      # 按话题把 10 / 02 号规则并进常驻段（可给多个词）
/mc-skill topic             # 看当前登记的话题
/mc-skill topic clear       # 清空话题（底座 00/01/09 仍在）
/mc-skill doc DeferredRegister   # 按当前档检索官方文档并回显摘要（不需要 MCP）
/mc-skill rule 10           # 临时把 10 号规则注入**下一个步骤**（不动常驻段）
/mc-skill rule all          # 11 条全注入（慎用：约 100 KB）
```

或者直接让模型用 `mc_skill_detect_project`。

## 结构

| 文件 | 职责 |
|---|---|
| `lib/index.js` | 插件入口：`name` / `inject` / `apply`，注册 provider、规则段落、命令、工具 |
| `lib/pack.js` | 桥接层：预加载 `mcp-server/dist/platform-pack/*`，定档与取数（全同步） |
| `lib/provider.js` | skill provider：按 cwd 定档，把档内技能映射成 DSH 候选 |
| `lib/rules.js` | 规则段落：底座 `00/01/09` + 会话话题，按档重算 |
| `lib/docs.js` | 文档检索桥：进程内复用 `mcp-server/dist/docs-platform`，给 `/mc-skill doc` 用 |

## 两条硬约束（改代码前先读）

1. **`systemPrompt.section` 的 `text` 必须同步返回字符串。** DSH 的组装是 `section.text(context)` 直接取值，返回 Promise 会被静默丢弃（不报错、规则永远不出现）。所以 `pack.js` 的取数接口全是同步的，异步只在 `apply()` 里做一次预加载。
2. **tool 的 `output.schema` 里 `required` 是对象级数组**，不能写成属性上的 `required: true`（那是 `defineTool` 的 author 方言）。写成属性级会被 `assertSupportedJsonSchema` 拒绝，整个插件不激活。

## 明确不做

- 不重宿 89 个 MCP 工具 —— MCP 工具本来就是 DSH 的原生注册，schema token 一样；
- 不写仓库、不跑 Gradle、不拷 jar、不上传；
- 不碰 `agent-instructions` 的 `maxBytes`（那会挤掉你工程自己的 `AGENTS.md`）。
