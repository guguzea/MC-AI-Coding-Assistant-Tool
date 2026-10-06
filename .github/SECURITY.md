# 安全策略（Security Policy）

本文件说明 **MC AI Coding Assistant Tool**（仓库 `guguzea/MC-AI-Coding-Assistant-Tool`）的安全问题如何上报、我们在什么时限内响应，以及哪些报告不在受理范围内。

---

## 1. 支持版本（Supported Versions）

「支持版本」指 MCP Server npm 包 `mc-ai-coding-assistant-tool` 的版本。仓库根的 `data/` 知识资产不是独立发版单元，它随同一个 GitHub Release tag 以 zip 形式分发（见根 `CHANGELOG.md` 的发布策略一节）。

| 版本 | 支持状态 | 说明 |
|------|----------|------|
| `2.0.0`（当前 `mcp-server/package.json`） | ✅ 完整支持 | 接收安全报告，发布修复 |
| `2.0.0` 之后的任意版本 | ✅ 完整支持 | 接收安全报告，发布修复 |
| `1.0.4` / `1.0.3` / `1.0.2` / `1.0.1` / `1.0.0` | ⚠️ 仅安全修复（**待维护者确认**） | 是否为旧版本单独打补丁，取决于影响面；默认建议不单独打补丁，修复随最新版本发布 |

**本项目采取的语义化版本口径（待维护者确认）**：`PATCH` 与 `MINOR` 递增均视为上表「完整支持」范围；仅 `MAJOR` 变更才可能使旧版本落到「仅安全修复」。

---

## 2. 如何上报（Reporting a Vulnerability）

### ✅ 请走私密渠道：GitHub Security Advisories

不严重的也可以提交issue

本仓库已启用 GitHub 漏洞公告（Security Advisory）。请使用以下入口提交私密报告：

- **网页入口**：<https://github.com/guguzea/MC-AI-Coding-Assistant-Tool/security/advisories/new>
- **命令行入口**（推荐，可一次写完再提交）：

  ```bash
  # 私有草稿，只有 reporter 与维护者可见
  gh api repos/guguzea/MC-AI-Coding-Assistant-Tool/security-advisories \
    --method POST \
    -f title='<一句话摘要>' \
    -f summary='<影响与复现要点>' \
    -f description='<完整说明：受影响版本、复现步骤、影响面、建议修复>' \
    -f severity='<low|medium|high|critical>'
  ```

  若该命令返回权限错误，说明你的账号对该仓库无提报资格，请改用网页入口，或在 issue 里**只**留下「希望私下沟通安全议题」的信号并等待维护者联系（**不要**在正文写漏洞细节）。

- 若 GitHub 私密通道不可用：提交issue吧

### 报告里建议包含的信息

1. **受影响版本**：MCP Server 版本（`node mcp-server/dist/cli.js --version`）与 Node.js 版本（`node -v`）。
2. **平台与游戏版本**：forge / fabric / neoforge / quilt / liteloader / rift / modloader / bedrock，及具体 MC 版本。
3. **复现步骤**：最小可复现的命令或工具调用序列。
4. **影响面**：是否需要攻击者控制本地输入？是否可越出 `MC_SKILL_PROJECT_ROOT` / `MC_SKILL_DATA` 沙盒？是否可在未确认情况下写盘、运行 Gradle 或拷贝 jar？
5. **诊断输出**：`node mcp-server/dist/cli.js diagnose_data_paths` 的输出。

---

## 3. 我们的响应流程与时限



| 阶段 | 时限 | 说明 |
|------|------|------|
| 收到报告后确认收到 | 尽量72 小时内 | 在该私密 advisory 线程内回复确认已收到，不在结论前透露细节 |
| 初步定性（是否是真缺陷 / 影响面） | 7 天内 | 给出「受理 / 不受理 / 需更多信息」的判定 |
| 修复发布 | 受理后 14 天内 | 修复随最近一次发布推送；若需更长时间，在 advisory 线程内**主动**说明原因与预计时间 |
| 公开披露 | 修复发布后 | 由 reporter 与维护者协商时间；默认给 reporter 90 天披露窗口 |

**超出时限怎么办**：维护者失联或超期，可在 advisory 线程内提醒。提醒无效时，reporter 可在获得足够缓冲期（建议 90 天）后自行公开。

---

## 4. 受理范围内的安全问题

本项目依赖并操作若干攻击面较大的组件，因此以下类别的缺陷**在受理范围内**：

- **`onnxruntime-node`**（原生二进制，含多平台预编译件）——远程代码执行、加载路径劫持、平台特定二进制缺陷。
- **`@xenova/transformers`** ——模型文件下载与反序列化路径上的任意写入、路径穿越。
- **`java-parser`** ——解析用户提供的 Java 源码时的 ReDoS、栈溢出、或解析结果被后续逻辑误当作可信输入。
- **外部 MDK zip 的下载与解压**（`download_official_mdk`）——zip slip（解压写出目标目录外）、下载源被劫持、解压残留树的清理不彻底。
- **沙盒逃逸**：写盘 / 运行 Gradle / 拷贝 jar 到游戏目录 / 上传发布等高风险操作，未经确认即可触发，或路径校验可被绕过（应参照根 `README.md`「定位：人在环的副驾驶」一节）。
- **凭据与隐私**：把本机私有信息写进对外产物（Release zip、日志、错误消息）。
- **CI / 发布链**：workflow 中存在可被不可信输入（PR 标题、fork 分支）驱动的注入或凭据泄露。

---

## 5. 不在受理范围内（Out of Scope）

- **第三方模组或游戏安装自身的问题**：请报给对应上游（Mojang、Forge、Fabric、NeoForge、Quilt、LiteLoader、Rift、ModLoader）。
- **本仓库未使用的依赖**：`package.json` 中已移除、或仅存在于开发分支 / `temp/` 目录中的包。
- **用户自己项目里的缺陷**：你在自己工程中引入的代码。
- **「工具按设计拒绝代劳」**：本项目是**人在环**的副驾驶——创意决策、性能取舍、调试策略由人拍板，代理不代劳（见根 `README.md`）。因此「工具没有替我做决定」是设计行为，不是安全缺陷；请勿作为漏洞提交。
- **缺少安全加固的最佳实践**（如无 CSP、非 root 容器运行）：这些是建议，不是可利用缺陷。
- **社会工程、物理攻击、DoS 以外的人身安全**：本项目是本地 stdio 工具，默认只在本机运行。

---

## 6. 硬边界（设计如此，不是缺陷）

以下行为是**明确的设计决定**，不作为漏洞受理：

- 高风险操作默认停在清单或 `dryRun`，必须由人确认后才执行。
- 语义检索缺失时**回退 L0 关键词检索**并在响应里说破，而不是静默降级。
- 证据缺失时**如实报告「未验证」**，不得读成「没有失败」。

如果你认为某条硬边界的实现本身有缺陷（而不只是不符合你的预期），请按第 2 节走私密渠道，并明确指出你依据的读数。

---

## 7. 范围与披露的补充说明

- 本项目 **MIT 许可**，版权归原作者所有（见仓库根 `LICENSE`）。
- 本文件描述的响应时限与支持版本口径，在维护者确认前均为建议值。第三方目录站收录本文件**不代表**维护者已承诺上述时限。
