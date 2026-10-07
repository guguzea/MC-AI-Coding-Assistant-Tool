# CHANGELOG

本文件是**版本索引**，不是完整变更记录。

> **详细变更记录在 [`mcp-server/CHANGELOG.md`](./mcp-server/CHANGELOG.md)。**
> 本文件**不复述**各版本改了什么——那些条目由逐批次记录维护，写一份第二手摘要只会
> 腐烂，且口径一旦分叉就没人知道该信哪份。需要"某版本到底动了什么"时，请直接读
> `mcp-server/CHANGELOG.md`，那是唯一权威来源。
>
> **唯一的例外是 Release 正文**：发版时另写一份
> [`V2.0.0-RELEASE-NOTES.md`](./V2.0.0-RELEASE-NOTES.md)，**贴进 GitHub Release 用**，
> 读者是 mod 开发者而不是维护者 —— 所以不写口径、sweep 编号、commit 哈希那套内部语言。
> 它是**导出物**不是第二真值：**两者冲突时一律以 `mcp-server/CHANGELOG.md` 为准**，
> 正文里的数字如需复核，回到逐批次记录查。

---

## 已发布版本

| 版本 | 变更详情 |
|------|---------|
| V2.0.0 | Release 正文：[`V2.0.0-RELEASE-NOTES.md`](./V2.0.0-RELEASE-NOTES.md) · 逐批次明细 → [`mcp-server/CHANGELOG.md`](./mcp-server/CHANGELOG.md) |
| V1.0.4 | → [`mcp-server/CHANGELOG.md`](./mcp-server/CHANGELOG.md) |
| V1.0.3 | → [`mcp-server/CHANGELOG.md`](./mcp-server/CHANGELOG.md) |
| V1.0.2 | → [`mcp-server/CHANGELOG.md`](./mcp-server/CHANGELOG.md) |
| V1.0.1 | → [`mcp-server/CHANGELOG.md`](./mcp-server/CHANGELOG.md) |
| V1.0.0 | → [`mcp-server/CHANGELOG.md`](./mcp-server/CHANGELOG.md) |

**未发版的工作树改动**同样记在 `mcp-server/CHANGELOG.md` 顶部的 `Unreleased` 一节，
不在本文件列。

> 📝 **待维护者补充**：上表未填发布日期。各 tag 的日期可从 GitHub Releases 页面或
> `git log` 取得，**请勿凭印象填**——日期错比不填更难查。确认后可直接在本表加一列。
>
> 📝 **V2.0.0 的两点待确认**（发布前请拍板）：
> ① `V1.0.4` tag 内 `mcp-server/package.json` 的 `version` 当时仍是 `0.1.0`（`1.0.4` 是 3 天后
> 另一 commit 才补上的）⇒ **按包版本找发布会找不到该 tag**。打 V2.0.0 tag 前请确认 tag 与
> `package.json` 的 `version` 同步。
> ② 本项目**是否严格遵循 SemVer 尚未正式确认**（见文末）⇒ 若要把 V2.0.0 称作
> "breaking change"，建议先补这条裁定。

---

## 去哪儿看

| 你想知道 | 去哪里 |
|---------|--------|
| 某个版本具体改了什么 | [`mcp-server/CHANGELOG.md`](./mcp-server/CHANGELOG.md) |
| V2.0.0 的 Release 正文（贴 GitHub Release 用） | [`V2.0.0-RELEASE-NOTES.md`](./V2.0.0-RELEASE-NOTES.md) |
| 当前工作树（未发版）改了什么 | 同上，`Unreleased` 一节 |
| 装了之后怎么配 | [`AUTO_SETUP.md`](./AUTO_SETUP.md) |
| 怎么贡献 / 门禁规矩 / 数据链口径 | [`CONTRIBUTING.md`](./CONTRIBUTING.md) / [`CONTRIBUTING.en.md`](./CONTRIBUTING.en.md) |
| 项目定位与人在环设计 | [`README.md`](./README.md) |
| 某个 tag 的资产与校验和 | [Releases 页面](https://github.com/guguzea/MC-AI-Coding-Assistant-Tool/releases) |

---

## 发布策略

本项目分两条分发路径，**它们的内容不同源，不要混着理解**：

### npm —— 只发代码

- 包名 `mc-ai-coding-assistant-tool`，**只包含 `mcp-server/`**（`dist/`、`package.json`、`README.md`）。
- npm 包**不含** `data/` 知识资产（体积极大，且随上游文档版本变动，不适合按代码节奏发版）。
- 安装后需要自备 `data/`，并把 `MC_SKILL_DATA` 指过去；用
  `node mcp-server/dist/cli.js diagnose_data_paths` 自查是否指对。
- **运行环境要求 Node.js >= 22.5**（22.5–22.12 与 23.0–23.3 需加
  `--experimental-sqlite`，因为内置 `node:sqlite` 在 22.13 / 23.4 起才默认开启）。

### GitHub Release —— 代码 + 数据资产

每个 tag 对应一个 Release，资产包括：

| 资产 | 内容 |
|------|------|
| `mcp-server-<tag>.zip` | 服务端代码（**不含 `node_modules`**，与 git 同一约定） |
| `mc-skill-data-full-<tag>.zip` | 全量 `data/` 知识资产 |
| `SHA256SUMS-<tag>.txt` | 上述 zip 与 manifest 的 sha256 |
| `data-manifest.json` | 平台 / 版本 / 映射产物清单 |

**校验和请自己核一遍**：下载后用 `SHA256SUMS-<tag>.txt` 里的 sha256 对比，
不要只信下载成功。发布链见 `.github/workflows/release-mcp-server.yml`。

### 发版门禁

发布链在打 tag 后会依次跑：`npm ci` → build → yarn SQLite 产物 →
**data audit（fail on error）** → `npm test` → `npm audit --omit=dev --audit-level=high`
→ 打包 → **release smoke** → 建 Release。

同一批判据在 CI（每个 PR 都跑）里也有一份，所以**依赖漏洞与数据漂移应在 PR 阶段就红，
而不是等 tag push 才发现**。tag 还必须落在 `main`/`master` 上，否则发布链直接拒绝。

---

## 版本号口径

MCP Server 版本号以 `mcp-server/package.json` 的 `version` 字段为准，
自查：`node mcp-server/dist/cli.js --version`。

> 📝 **待维护者补充**：本项目是否严格遵循 [SemVer](https://semver.org/lang/zh-CN/)，
> 以及 `MAJOR` 变更的判定标准（例如"移除一个工具"算不算 breaking），尚未由维护者
> 正式确认。确认前请勿在文档或 issue 回复里把某个版本称作 "breaking change"。
