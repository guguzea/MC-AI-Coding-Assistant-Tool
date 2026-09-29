---
id: authored/ingame-playtest-automation
title: 游戏内自动游玩测试（agent 驱动与观察）
tags: [testing, playtest, agent, bridge, driver, screenshot, gametest, in-game, fabric, forge, neoforge, quilt, bedrock, legacy, hitl]
summary: 补 mc-ingame-iterate 缺的"进世界→驱动→观察→回灌"段。候选仓库与许可、driver 规范与坑位、全平台降级矩阵、受控启动治理；路线已定 = 借现成桥（BlackBoxPro，MIT，HTTP 直驱）为默认、进程内 driver 为备用（as-of 2026-09-29）。
mcHint: 全平台口径；现代 Java 档（Forge 1.17.1+ / NeoForge / Fabric / Quilt）可做进程内驱动，老加载器与基岩按矩阵降级；概念部分与版本无关
sourceKind: authored
---

# 游戏内自动游玩测试（agent 驱动与观察）

自写短文（as-of 2026-09-28/29；2026-09-29 增补桥路线）。定位：`mc-ingame-iterate` 工作流（真机测试与修复循环）已覆盖「要路径 → 装 jar → 用户启动 → 读日志 → 修码 → 重测」，缺的只在 **进世界 → 驱动 → 观察 → 回灌** 一段。**路线已定：借现成桥（BlackBoxPro，MIT，预编译 jar + HTTP 直驱）为默认；进程内临时 driver 为备用**；实现清单见文末。API 名一律以该档 `search_*_docs` 为准，本文不是 API 规范。

## 缺口定位（对着现有工作流）

| 闭环段 | 现状 | 证据 |
|--------|------|------|
| 构建验证 | `mc-build-mod` 1–7 步 | `mcp-server/src/prompts/templates.ts:77-88` |
| 装 jar 到实例 | agent 只列"要拷的文件+目标路径"，不擅写 | `templates.ts:117` |
| **起游戏 / 复现** | **用户手动**（"用同一启动器启动该隔离实例；复现问题"） | `templates.ts:118` |
| **游戏内操作** | **工具面零命中**（agent 无任何 in-game 动作工具）；官方**运行**面已有 5 档核实（跑法在，执行权不在） | 全仓扫词仅本文/索引/README 命中（as-of 2026-09-29；注意 `search_content` 默认跳过 dot 目录与 gitignored 的 `data/`，判"零命中"须换命令直扫）；运行面见 `forge/1.20.4/.cursor/skills/mc-gametest/SKILL.md:23,75`、`fabric/1.21.11/.cursor/skills/mc-gametest.md:46,47` |
| **观察（证据）** | 只有日志；`inspect_runtime` 只读 `latest.log` / crash-report，文件头明写"禁 JDWP attach、禁改游戏" | `mcp-server/src/runtime-inspect/index.ts:3,181` |
| 视觉面现状 | 像素级视觉断言无官方框架（手动清单 + 截图对比）；功能面有官方 GameTest（Fabric 1.21.10/1.21.11/26.1.2 等档另有客户端 gametest） | `authored/testing-automation.md:20`（2026-09-29 已更正，见该文文末记录） |
| 修复循环 | 修码 → `mc-build-mod` → 换 jar → 再测（人工节奏） | `templates.ts:120` |

⇒ 缺的 = **启动进世界 + 游戏内驱动 + 截图/状态观察 + 失败自动回灌**四件；其余环节不动。一句话：**本仓缺的不是 GameTest 知识，是「执行权（谁跑 Gradle / 起游戏）+ 手脚（in-game 动作桥）+ 证据面（截图 / 状态）」**。

## 候选仓库（as-of 2026-09-28，GitHub API / README 实测）

### A. 驱动规范（方法论）

- **grabartley/grabartley-plugins → `minecraft-modding:automated-qa`**：MIT，0★，Java，2026-08-17 建、2026-09-17 最后推送。
  **唯一把「进程内 driver 规范 + 坑位清单」写透的公开实现**：临时 driver 挂在客户端 tick 事件上（技能文档给出的 Fabric 侧形态为 `ClientTickEvents.END_CLIENT_TICK`）、走真实 UI 路径（`client.currentScreen.mouseClicked` / `keyPressed`，产生真实 C2S 包）、`ScreenshotRecorder.saveScreenshot(...)` 取帧缓冲、单机（集成服务器）与多人（专用服务器 + 多真实客户端）双模式、QA 通过后驱动必须 revert。
  边界：终点是"证据入 PR + 人工 QA 收口"，**不做自动修复**。
- marcusgreenwood/vibecraft：MIT，28★，10 commits。RPA 路线（`java.awt.Robot` 键入 `/runalltests` → 解析日志 → `test-result.txt`），AI 闭环靠 `.cursorrules` 约定。**只作对照**：依赖窗口焦点与辅助功能权限，脆弱。

### B. 游戏内"手脚"（可被 agent 调用的动作桥）

| 仓库 | 许可 / 热度 | 能做什么 | 边界 |
|------|-------------|----------|------|
| **YsGqHY/BlackBoxPro（2026-09-29 已选为默认手脚）** | MIT（LICENSE 原文），45★，Kotlin，2026-03 后无推送；**有预编译 jar**（v2.2.4-dev：fabric/neoforge 1.21.11+1.21.1、forge 1.12.2、plugin） | 内嵌 HTTP 直驱：`POST /execute`（`CommandMessage{id,action,params,delay,target}` → `ResponseMessage{id,status,message,data}`，HTTP 恒 200）+ `GET /status`（`ready` = 已进世界探针）；截图落 `<gameDir>/screenshots/blackboxpro/<player>/<testId>/<NNN>_*.png`；动作面**现扫 116 条**（README 自报 112，以 `/status.actions` 为准） | 源码级已核：**无鉴权 + 通配绑定 0.0.0.0**（门必须做在调用侧）；**`wait_until` 未实现**（只有 `wait`/`batch`/`delay`）；超时 = `failure + "Timeout after 10000ms"`（无专用码） |
| MCNeteaseDevs/ModPC-MCP-Tool | **无 license（不可复用代码）**，17★，网易官方 | MCP 直接接管中国版 ModPC 玩家（移动/寻路/建造/战斗/UI） | 仅 ModPC；需人工先开游戏进存档 |
| cuspymd/mcp-server-mod | CC0，10★ | Fabric mod 内嵌 HTTP MCP：`execute_commands` / `get_player_info` / `get_blocks_in_area` / `take_screenshot`（客户端模式） | 命令级操作，无游玩编排；MC 26.2 / Java 25 |
| chapmanjw/minecraft-java-fabric-claude-plugin | MIT，7★ | 世界操作 MCP（8765）+ **客户端第一人称画面 MCP**（8766 `view_capture`） | 面向"在游戏里建造"，不写 mod 源码；jar 按版本钉 |
| mc-agents 组织（**5 仓**：`mcp-server`/`bot-fabric`/`bot-azalea`/`bot-mineflayer`/`operator`） | 4×Apache-2.0 + 1×MIT（`bot-mineflayer`，已归档），全 0★，2026-09-11/13 建 | 有头 Fabric bot（视觉验证）与无头 azalea bot（Rust，批量/CI）分列 + K8s 弹性供给 | 架构对口，极早期 |

### C. 自主游玩（"在游戏里自己玩"半环）

- **zoyluoblue/mc_aiplayer（AIBot）**：MIT，155★，Fabric 1.21.3 **服务端真实玩家实体**（非 Mineflayer 账号）。
  架构最值得抄：**LLM 只选意图 → 确定性 Task 状态机执行 → 类型化 Goal + 后置条件判定完成**（tool / task / 代码行数为 **README 自报**：63 / 34 / ~32K LoC，未复核）；`strict_survival` 默认、fail-closed。局限：只做通用生存任务，不认识你的 mod 功能。
- mindcraft：MIT，5,811★，Mineflayer（协议级 bot）。**测不了客户端渲染 / Mixin 注入面**。
- Voyager（MineDojo）：MIT，"写 JS 技能 → 执行 → 报错回改"的迭代范式源头（技能代码，不是 mod 代码）。

### D. 写码→真机验证的完整闭环（产品级参照）

- newstarbar/ModCrafting：20★，**license 未声明**（GitHub API `license=null`；三方页称 GPLv3，未核实）。Electron/TS，Fabric 专用桌面环境；"图形化游戏测试：多实例 + 崩溃报告一键回传 AI 修复"。**自动进世界 / 自动断言未证实**。
- player.games（闭源 SaaS）：自然语言 → 最多 4 变体 → 逐个**真机启动**（Paper/Fabric/NeoForge）→ 崩溃读日志生成修复版 → 交付 jar + 源码；98.2% 通过率为**自报数据**，无第三方审计。
- MCDxAI/minecraft-dev-mcp（MIT，41★；反编译/映射证据，**不在游戏内**）；minecraft-developing-mcp（**PolyForm 非商业**，代码不可商用，避坑）。

## 机制选型（本仓口径）

- **首选：借现成桥（2026-09-29 采用）**——BlackBoxPro（MIT，预编译 jar，HTTP `:38081` 直驱）：动作面覆盖移动/GUI/战斗/容器/截图/查询，`/status.ready` 直接给"已进世界"；代价 = 第三方依赖 + 无鉴权/0.0.0.0（门做在调用侧）+ 无 `wait_until`（`await` 由我们轮询 `query_*` 自建）。
- **备用：进程内临时 driver**（grabartley 规范，见坑位清单）——确定性最高、不装第三方 mod；代价是每轮临时改被测工程并 revert。
- **架构参考：`in_jvm_player_agent`（AIBot 形态）**——只借"LLM 选意图 + 确定性 Task + 类型化后置条件"的架构，**未实现**，留作后续。
- **不推荐** OS 级 RPA（vibecraft 路线）：焦点/权限/缩放三重脆弱。
- **协议 bot（Mineflayer / Azalea）边界**：只能覆盖服务端行为与协议面；**客户端渲染、GUI、Mixin 注入面测不到**，不能当 driver 主路。

## 坑位清单（来源：automated-qa 技能文档，MIT；未在本机复跑）

1. **Loom `--quickPlaySingleplayer` programArgs 不被读取**（该技能实测）；Fabric 侧改用 `createIntegratedServerLoader().start(...)`。Forge/Neo 侧等价入口**未核实**，按各档文档核。
2. framebuffer 里是**上一 tick** 的帧：改状态与截图之间要留 settle 步骤（设状态 → 清帧 → 等几 tick → 保存）。
3. 多客户端**不能共用 runDir**：options.txt 争抢 + 截图互相覆盖 ⇒ 证据静默变成同一客户端的重复。
4. 截图前 `client.setScreen(null)`；每 tick 清 toast；证据面板必须完全不透明（半透明会被天空/地形透出，看起来像渲染缺陷）。
5. 驱动代码 QA 通过后**必须 revert**，绝不提交；截图证据不入 PR 分支/main（放独立 orphan 分支）。
6. 用**绝对路径**：cwd 漂移会启动没有驱动的旧构建（表现为"什么都没发生"）。
7. 启动前先证明驱动**进了构建**（编译产物里能查到驱动类）再跑。
8. dev 世界是可变状态：驱动杀死玩家会写进存档并污染后续运行 ⇒ 每次运行恢复干净存档 / 幂等化。
9. 判读用"两遍法"：先看改动方向（动了 ≠ 动对了），再整帧像玩家一样读（悬浮/穿模/缝隙/接触点）；角度不足要重拍，不能假设。

## 平台降级矩阵（全平台口径）

| 平台档 | 驱动面 | 观察面 | 口径 |
|--------|--------|--------|------|
| 现代 Java：Forge 1.17.1+ / NeoForge / Fabric / Quilt | **桥路线（主）**：装 BlackBoxPro 对应端即可，无需驱动代码；**driver 路线（备用）**：Fabric 侧 tick 钩子本仓①级出处 = `data/fabric_1.21.11/reference/1.21.11/src/client/java/com/example/docs/keymapping/ExampleModKeyMappingsClient.java:35`（`ClientTickEvents.END_CLIENT_TICK.register(client -> …)`）；Forge/Neo/Quilt 等价钩子未核实 | 桥：截图 + query 响应 + calls.jsonl；driver：framebuffer + 状态 json | 主路线 = 桥；driver 按 loader 分叉生成（备用） |
| 老加载器：LiteLoader 1.12.2 / Rift 1.13.2 / ModLoader 1.6.4 | 无现代 tick 钩子面（未核实）；**禁止照搬现代 driver** | 日志 + 用户手动截图 | **降级**：用户操作 + 日志断言；driver 形态留 TODO(未核实) |
| 基岩 Add-On | 无 Java driver；GameTest 框架 + Script API（另体系） | 行为包自检 + 手动 | **降级**：不塞进同一 driver |
| 服务端插件（Bukkit/Paper，非本仓主线） | 黑盒桥（BlackBoxPro 形态）或无头 mock（MockBukkit，750★ MIT：API mock，**不跑 tick/世界**） | 服务端日志 +（需真实客户端时）截图 | 独立面 |

## 受控启动治理（方向已由用户裁定；实现随 AGENTS.md「三通道」落）

- 用户**一次性授权**某个 dev 实例路径（复用 `mc-ingame-iterate` 步骤 1–3 的路径确认，见 `templates.ts:94-117`）；授权原文 + realpath + 时间戳记仓外。
- **允许**：启动 / 关闭该实例、写该实例 evidence 目录、读该实例日志、**装第三方桥及其依赖**（记账 来源 URL + 版本 + sha256）。
- **禁止**：进正式实例；把 jar 拷进未授权目录；代用户接受 EULA（仅 `eula.txt` 已 `eula=true` 才运行）。
- 既有铁律按"授权根内例外"处理："不代跑 Gradle"仍适用于未授权工程；沙箱 / 授权实例内可跑。
- 证据：driver 模式 = 截图 + `[QA]` 段 + 状态 json；**桥模式 = 截图 + `calls.jsonl` + query 响应 + 日志**（`wait_until` 不存在，超时语义由调用侧映射）。
- 桥的安全边界（源码级）：**无鉴权 + 0.0.0.0 通配绑定** ⇒ 只在可信网络、短会话；门在调用侧（localhost + 动作白名单 + 授权校验）。

## 最小补法（2026-09-29 起开工）

1. 新工作流 `mc-ingame-playtest`（挂在 `mc-ingame-iterate` 第 3 步之后；不改造现有工作流）。
2. **`playtest_bridge`（首选手脚）**：封装桥 HTTP（`/execute`、`/status`）+ `await` 轮询（条件成立或超时 ⇒ `PLAYTEST_TIMEOUT`）+ `calls.jsonl` 证据；只连 `127.0.0.1`。
3. `generate_playtest_driver`（只吐文本）：默认 `driverMode=external_bridge`（动作序列 + 后置条件 + 证据约定）；`in_jvm_player_agent` 仅留结构壳（`// TODO(未核实)`）。
4. `inspect_playtest_evidence`：读两种证据布局（driver 自产 / 桥模式），三态 `present|absent|unreadable` 不塌陷。
5. 治理：三通道授权（沙箱 / 授权 dev 实例 / 桥安装）。
**不动**：`mc-build-mod` / `mc-gametest` / `mc-server-multiplayer-test` / `authored/testing-automation` / crash 分诊链。

## 来源台账（引用前按此复核）

| 条目 | 许可 | as-of | 证据形态 |
|------|------|-------|----------|
| grabartley-plugins `automated-qa` | MIT | 2026-09-17 最后推送 | 技能文档全文（第三方案目录页）；未在本机复跑 |
| BlackBoxPro | MIT | 2026-09-29 源码级 | dev-2.0 源码包 + jar 元数据（契约/依赖/绑定/超时/截图实核）；产物 sha256 记仓外 preflight |
| ModPC-MCP-Tool | 无 license | 2026-09-28 API | 官方新闻页 + GitHub API |
| cuspymd/mcp-server-mod | CC0 | 2026-09-28 | 仓库页 |
| chapmanjw 插件 | MIT | 2026-09-28 | 仓库页 |
| mc_aiplayer | MIT | 2026-09-28 API | README |
| mindcraft | MIT | 2026-09-28 API | GitHub API |
| ModCrafting | 未声明 | 2026-09-28 API | API + 三方页（自动测试细节未证实） |
| player.games | 闭源 | 2026-05-17 页注 | 官网自报 |
| MockBukkit | MIT | 2026-09-25 推送 | GitHub API |

## 相关

- `authored/testing-automation`（JUnit / GameTest 选型；本文补它"客户端渲染类无官方自动化框架"之后的那一段）
- 工作流：`mc-ingame-iterate`、`mc-build-mod`、`mc-gametest`、`mc-server-multiplayer-test`
- `authored/crash-reports`

## 不清楚时

- 官方测试框架：`get_workflow_template name=mc-gametest` + 该档 `search_*_docs`（别用本文当 API 规范）
- 候选仓库原文（引用前提是打开核对）：
  - https://github.com/YsGqHY/BlackBoxPro
  - https://github.com/zoyluoblue/mc_aiplayer
  - https://github.com/cuspymd/mcp-server-mod
  - https://github.com/chapmanjw/minecraft-java-fabric-claude-plugin
  - https://github.com/newstarbar/ModCrafting
  - https://github.com/mc-agents
  - https://www.player.games/
