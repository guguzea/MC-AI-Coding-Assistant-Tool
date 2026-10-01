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
- **备用：进程内临时 driver**（grabartley 规范，见坑位清单）——确定性最高、不装第三方 mod；代价是每轮临时改被测工程并 revert。**2026-09-29 已落地并真机跑通**：`generate_playtest_driver` 在 **fabric/quilt 1.21.11** 档产出**可编译的真 driver**（`temporary_client_tick_driver`：自动进世界 → 静置 → 观察 state.json → 截图 → 断言 `inventory_contains` → `[QA] DONE/ERROR` + 撤除清单），签名全部 javap 实测；**其余平台/版本仍为结构壳**（须先取证）。
- **架构参考：`in_jvm_player_agent`（AIBot 形态）**——只借"LLM 选意图 + 确定性 Task + 类型化后置条件"的架构，**未实现**，留作后续。
- **不推荐** OS 级 RPA（vibecraft 路线）：焦点/权限/缩放三重脆弱。
- **协议 bot（Mineflayer / Azalea）边界**：只能覆盖服务端行为与协议面；**客户端渲染、GUI、Mixin 注入面测不到**，不能当 driver 主路。

## 坑位清单（来源：automated-qa 技能文档，MIT；**1 / 2 / 3 / 9 已于 2026-09-29 本机真机复跑确认**，10–13 为本轮实测新增）

1. **Loom `--quickPlaySingleplayer` programArgs 不被读取**（该技能实测；**2026-09-29 本机独立复现**：`loom { runs { client { programArgs(...) } } }` 下客户端日志零 `quick` 命中）；Fabric 侧改用 `client.createIntegratedServerLoader().start(<存档目录名>, onCancel)` —— 本机实测可自动进世界（`IntegratedServerLoader.start(String, Runnable)`，javap 实测签名）。Forge/Neo 侧等价入口**未核实**，按各档文档核。
2. framebuffer 里是**上一 tick** 的帧：改状态与截图之间要留 settle 步骤（设状态 → 清帧 → 等几 tick → 保存）。
3. 多客户端**不能共用 runDir**：options.txt 争抢 + 截图互相覆盖 ⇒ 证据静默变成同一客户端的重复。
4. 截图前 `client.setScreen(null)`；每 tick 清 toast；证据面板必须完全不透明（半透明会被天空/地形透出，看起来像渲染缺陷）。
5. 驱动代码 QA 通过后**必须 revert**，绝不提交；截图证据不入 PR 分支/main（放独立 orphan 分支）。
6. 用**绝对路径**：cwd 漂移会启动没有驱动的旧构建（表现为"什么都没发生"）。
7. 启动前先证明驱动**进了构建**（编译产物里能查到驱动类）再跑。
8. dev 世界是可变状态：驱动杀死玩家会写进存档并污染后续运行 ⇒ 每次运行恢复干净存档 / 幂等化。
9. 判读用"两遍法"：先看改动方向（动了 ≠ 动对了），再整帧像玩家一样读（悬浮/穿模/缝隙/接触点）；角度不足要重拍，不能假设。
10. **自动进世界相必须在 `player/world == null` 时也能跑**：把 null 检查提到相位分发之前，相位 0 永远不触发（日志里连 `open world requested` 都没有，只剩预算耗尽判红）——实测踩过。
11. **强杀 `gradlew` wrapper 不结束正在玩游戏的子 JVM**（真身命令行含 `-Dfabric.dli.config=<工程>/.gradle/loom-cache`）；残留客户端持有存档 `session.lock` ⇒ 下一次进世界报「另一个程序已锁定文件的一部分，进程无法访问」⇒ 关客户端要按命令行精确匹配清理。
12. **证据文件名必须是 `.log`**：`inspect_playtest_evidence` 的 `[QA]` 段约定 =「证据目录内任意 `.log` 尾部」；写成 `qa.txt` 会判 `qa: absent`（实测）。
13. **把路径/期望值注入 Java 字符串字面量时必须转义反斜杠**：Windows 路径直接插进 `"D:\..."` ⇒ `非法转义符` 编译失败（实测踩过；生成器已修）。
14. **长驻 + 剧本热载（2026-09-29 落地）**：driver 是**解释器**，剧本在 `<evidenceDir>/plan.txt`；文件一变即**同进程**开新一轮（`[QA] ROUND n START`）。**只有 Java 改动（driver 生成物 / 被测 mod 代码）才需要重启**——动作/断言/坐标/等待时长一律走剧本。反例代价：一轮 `gradlew runClient` 启动 ≈1.5 分钟，改一次动作就重启在多轮/多模组场景下纯烧时间（实测踩过并被用户纠正）。
15. **`/locate` 要等、且落盘**：实测 `Locating element minecraft:village_plains took 2558 ms`，结果出现在 `<gameDir>/logs/latest.log` 的 `[System] [CHAT] … is at [x, ~, z]` 行 ⇒ 命令行定位必须在剧本里等待（`goto parsed … wait=400` 内置等待）并保留**日志兜底读法**（只靠 fabric 聊天事件会赶不上 2.5s 的返回）。
16. **实体可见范围 ≈48 格**：客户端只追踪近处实体 ⇒ `scan radius` 超 48 时 entities 必 0 命中（驱动器会打 hint 防误读成"这里没有"）；**实体断言要靠近目标**，"找到村庄"这类判据用**方块证据**（铃/干草块/堆肥桶/木板）+ 截图更稳。
17. **多轮证据口径**：`qa.log` 只含**本轮**（历史在 `rounds.jsonl`），`state.json` **每轮重写**（含 `plan.done`）——否则判读器 `done/error` 计数会被历史轮次污染（实测踩过，已修）。

## 平台差异对照（driver 档，2026-09-29 javap 实测）

| 面 | fabric 1.21.11（yarn） | fabric 1.20.1 | forge 1.20.1（mojmap/parchment） |
|---|---|---|---|
| tick 挂接 | `ClientTickEvents.END_CLIENT_TICK` | 同 1.21.11 | `@SubscribeEvent TickEvent.ClientTickEvent`（`Phase.END`）+ `MinecraftForge.EVENT_BUS` |
| 聊天捕获 | `ClientReceiveMessageEvents.GAME` | 同 | `ClientChatReceivedEvent.getMessage()` |
| 键位 | `options.forwardKey` + `KeyBinding.setPressed` | 同 | `options.keyUp…` + `KeyMapping.setDown` |
| 截图 | `ScreenshotRecorder.saveScreenshot(File, Framebuffer, Consumer<Text>)` | 同 | `Screenshot.grab(File, RenderTarget, Consumer<Component>)` |
| 发命令 | `getNetworkHandler().sendChatCommand` | 同 | `getConnection().sendCommand` |
| 自动进世界 | `createIntegratedServerLoader().start(String, Runnable)` | `start(Screen, String)`（Screen 传 null） | `createWorldOpenFlows().loadLevel(Screen, String)` |
| 飞行刷新 | `sendAbilitiesUpdate()` | 同 | `onUpdateAbilities()` |
| 实体 / 方块 / 背包 | `ClientWorld.getEntities()` / `Registries.*.getId(...)` / `getInventory().getStack` | 同 1.21.11 | `level.entitiesForRendering()` / `BuiltInRegistries.*.getKey(...)` / `getItem` |
| 位置 / 朝向 | `getBlockPos().down()` / `getPitch·setPitch` | 同 | `blockPosition().below()` / `getXRot·setXRot` |
| GUI | `mouseClicked(new Click(x,y,new MouseInput(0,0)), false)` / `close()` / `getScaledWidth` | `mouseClicked(x,y,0)` / `close()` | `mouseClicked(x,y,0)` / `onClose()` / `getGuiScaledWidth` |

⇒ **跨平台只差约 10 类调用**，可用"改写表"机械派生（本仓 `rewriteForForge()` / `rewriteForFabric1201()`）；真工作量在**逐档取证（javap）+ 编译回灌**，不在重写逻辑。

### 改写表的三个硬纪律（实测踩过）
1. **`String.replace(a,b)` 只替换第一处** ⇒ 必须 `replaceAll` 或全局正则（同一调用在驱动里出现两次：解释器 + 相位机；用错一次报 **44 个编译错误**）。
2. **匹配要"词元级"**：别假设参数形状 —— `setPressed(表达式)`、跨行的 `new Click(` 都会漏。
3. **注意替换顺序与 mojmap 改名**：先把 `world.`→`level.` 会让后面的 `world.getEntities()` 匹配不到；`BlockPos.add`→`offset`、`down`→`below`、`getBlockPos`→`blockPosition`、`net.minecraft.entity.Entity` 要换成 `net.minecraft.world.entity.Entity`。

### 生成物注释的 javadoc 硬伤（实测）
注释里的泛型尖括号（`Event<EndTick>`、`Consumer<Text>`）会让 **`Task :javadoc` 报「未知标记」** 并使 `gradlew build` 整体失败；**fabric 脚手架会打 `-javadoc.jar`、forge 不打**，所以只在 fabric 档暴露 ⇒ 生成器出码前统一转义块注释内的 `<` / `>`（`javadocSafe()`）。

### 无桥档的"造世界"与跨档复用
`newworld name=<存档>` 步骤：**fabric 档 fail-closed**（未取证 `createAndStart` 的 `LevelInfo`/`GeneratorOptions`/holder 构造面）；**forge 1.20.1 用 `createWorldOpenFlows().createFreshLevel(...)`**（签名已测）。**同 MC 版本跨加载器可直接复制世界**：`<gameDir>/saves/<name>` 在 fabric 1.20.1 与 forge 1.20.1 之间互通（实测用这条把 forge 造好的世界给 fabric 档用）。

### 无桥 driver 跑出来的七个坑（编号 18–24，2026-09-29 forge/fabric 1.20.1 真机实测）
18. **自动进世界前必须预检 `<gameDir>/saves/<name>/level.dat`**：存档不存在时直接调 `loadLevel`/`start` 会抛 `IllegalStateException: Failed to load data pack config`（vanilla 先 warn 再**抛出**），异常会**打穿 tick 处理器**；而且失败会**在 `saves/` 留下半成品目录** ⇒ 后续 `newworld` 若只判"目录是否存在"就会误跳过 ⇒ 判据要用 `level.dat`。
19. **剧本不能等到"已进世界"才起跑**：`newworld` 这类步骤本就要先造世界 ⇒ 会自锁。正确形态：**客户端就绪（标题屏）即开跑**，把"世界无关步骤"（`wait`/`newworld`/`cmd`/`mark`/`stop`）与"需要世界的步骤"分开，后者世界未就绪时**原地等**（预算照走，超时仍 fail-closed）。同时 bootstrap 里**绝不能**解引用 `player`（标题屏为 null，实测直接 NPE 崩客户端并留 crash-report）。
20. **轮末必须复位预算计数**：否则 `ticks` 继续增长会让最后那一轮**每 tick 再判一次红**——实测旧版刷出 800+ 条 `round 0 budget exhausted` 与 82KB `rounds.jsonl`。修法：预算判定加 `roundActive &&`，且 `finish()` 里 `ticks = 0`。
21. **ForgeGradle 首次 `runClient` 的 `:downloadAssets` 不可信**：个别资源下载会**截断**（实测 `chrysopoeia.ogg` 缓存里 8,551,913 B，而 asset index 期望 15,903,050 B）⇒ 任务整体 `FAILED`（**无单件重试**）且重跑时反复重下同一件、长时间无输出。判据与修法：拿 `caches/forge_gradle/assets/indexes/<n>.json` 逐对象比 `objects/xx/<hash>` 的**大小**（全量 3598 件实测 0 缺失/0 不符），坏的用**真实例 `assets/objects`（内容寻址，同哈希同路径）**覆盖——只读真实例、不写它。

22. **无人值守必须关"失焦暂停"**：单机默认 `pauseOnLostFocus=true` ⇒ dev 窗口在后台**失焦即暂停**、世界不 tick，而驱动的 `END_CLIENT_TICK` 仍在走 ⇒ 表现为**按键位移恰好 0.00**（实测 2026-09-29 fabric 1.20.1：同剧本 round 1 有焦点 delta=3.2、round 2 失焦 delta=0.00）。修法：`<gameDir>/options.txt` 写 `pauseOnLostFocus:false`（MC 读缺失键用默认值 ⇒ 最小文件也可；但**强杀进程时 MC 不会写这份文件**，得自己造）。
23. **fabric 脚手架 `filesMatching` 漏 `*.mixins.json`（档级缺陷，2026-09-29 实测）**：`build.gradle` 的 `processResources` 只展开 `["fabric.mod.json", "pack.mcmeta"]`，而 `examplemod.mixins.json` 的 `"package"` 里正是 `${maven_group}.${mod_id}.mixin` ⇒ 产物里占位符原样进运行期 ⇒ **首跑 `runClient` 直接死在 mixin prepare**（`InvalidMixinException: The specified mixin '${maven_group}.${mod_id}.mixin.ExampleMixin' was not found`）。**实测差异**：`fabric/1.21.11`、`fabric/1.21.3` 的 `filesMatching` **含** `examplemod.mixins.json` ✓；**`1.20.1` / `1.20.4` / `1.21.1` 三档漏** ✗。临时修法（dev 工程）：把 json 里的占位符落成真值，或把该文件名加进 `filesMatching` 列表。
24. **资源缓存可跨工具链复用 + 卡 `downloadAssets` 的三段修法**：ForgeGradle（`~/.gradle/caches/forge_gradle/assets`）与 Loom（`.../fabric-loom/assets`）都是**内容寻址同布局**（`objects/<xx>/<hash>`）⇒ 一边校验完整后可整批补齐另一边（实测 Loom 侧缺 191 件、用 ForgeGradle 侧已验证的 3598 件补齐后 `downloadAssets` 立刻过）。
    **当两边都没有该版本时**（实测 2026-09-30 `fabric 1.21.1` 首跑）：`DownloadException: Failed to download` 整任务失败（29m3s），**重跑也卡住**（对象数不增长、既不报错也不启动）⇒ 按下面三段手动预置即可（实测 2 分钟内过）：
    ① 从 Mojang 官方 manifest 取该版本 JSON（`version_manifest_v2.json` → `versions[].url`）读出 **`assetIndex.id`**（1.20.1=5 / 1.21.1=**17** / 1.21.11=29）；
    ② 把官方 asset index 放到 Loom 期望的位：`<loomAssets>/indexes/<mcVersion>-<assetIndexId>.json`（index 本身就是官方的 `assetIndex.url` 那个文件）；
    ③ 按 index 逐对象比对 `<loomAssets>/objects/<xx>/<hash>` 的**大小**，缺的从 `https://resources.download.minecraft.net/<xx>/<hash>` 补（实测 1.21.1 缺 **143 件，全是 `minecraft/lang/*.json`**，补完 `missing=0 mismatch=0`）。

25. **fabric 1.21.1：驱动**不要**自己进世界（2026-09-30 实测）** —— 该档的 `enterWorld`（驱动内部调 `IntegratedServerLoader.start(levelName, onCancel)`，与 1.21.11 同形）会把**客户端冻在世界载入里**：现象是**心跳与后续步骤全停**、`run/logs/latest.log` 停在世界载入后那几行、游戏 JVM **CPU≈0**，但**桥的 `/status` 仍答 `ready=true`**（因为 player/world 已非空）⇒ 极具误导性；桥侧动作（screenshot / query_* / create_world）一律超时或回 `Player not available` **同一时刻** status 还是 ready=true（❌实测）。**修法**：把 `enterWorld` **留空**，改用桥 `join_world` / `create_world`（或人工）把客户端送进世界 —— 驱动的"需要世界"步骤会自动等世界。**同轮实测该组合 17/17 步通过**：`assert moved PASS delta=27.13` → `gui CreativeInventoryScreen clicked/closed` → `cmd locate` → **`goto x=-1280 z=-1520` → 中途 `goto unstick`（40 tick 位移 0.00 ⇒ 抬升翻越）→ `arrived dist=23.57`**（飞了 2000+ 格）→ `scan entities 9 村民 / blocks 44 命中` → `assert scan_blocks PASS` → 两张截图（459,369 B / 228,961 B）→ `[QA] DONE`，`exit-code=0`。⇒ **1.21.1 的推荐组合 = 桥负责"进世界"，driver 负责"玩 + 断言 + 取证"**（两者可同进程共存，实测通过）。

### NeoForge 1.20.1 的 MDK：兼容层替代（用户裁定 2026-09-29）
NeoForge 1.20.1 无官方 MDK pin（原返回 `MDK_NOT_PINNED`）⇒ 按**兼容层**口径借用 forge 1.20.1 的 MDK：`mcp-server/data/mdk-checksums.json` 的条目 `neoforge-1.20.1-compat-forge`（**`aliasOf=forge-1.20.1-forgegradle`**，`archiveUrl`+`sha256` 与 forge 条目同源同值），`notes` 明写**不冒充** NeoForge 官方 MDK。依据：NeoForge 1.20.1 仍用 `net.minecraftforge` 包名（`net.neoforged` 自 1.20.2 起）⇒ **按 forge 档生成的 driver 源码可直接用于 NeoForge 1.20.1**（同版本 / 同事件总线 / 同映射）。

26. **fabric 1.20.4 / 1.21.1 / 1.21.3：驱动**不要**自己进世界（2026-10-01 jstack 定因；三档同形）** —— 坑位 25 的同一现象，这次有根因与正解：`enterWorld` 会调 `IntegratedServerLoader.start(String, Runnable)`，而它是在 **`END_CLIENT_TICK` 回调里被内联执行**的 ⇒ Render thread 停在 `MinecraftClient.startIntegratedServer` 的 `Thread.sleep`（等整合服务器载入的循环；`Preparing spawn area` 打完 `latest.log` 即静默、心跳停、CPU≈0），**而桥 `/status` 仍答 `ready=true`**（坑位 25 那条误导性同理）。**`client.execute` 委托排队修不了** —— `ThreadExecutor.execute` 从渲染线程是 **inline** 执行（`shouldExecuteAsync()` 为 false ⇒ 直接 `task.run()`），实测排队后停在 `runTask → startIntegratedServer` 同一行。**正解 = vanilla quick play**：工程 `build.gradle` 里 `loom { runs { client { programArgs "--quickPlaySingleplayer", "<存档目录名>" } } }` ＋ **`enterWorld` 留空**，由游戏自己进世界（驱动的"需要世界"步骤会自动等世界）。**实测 17/17**：`fabric 1.20.4`（312,488 B + 525,194 B 两张截图）· `fabric 1.21.3`（268,684 B + 376,074 B）· `quilt 1.21.11`（330,792 B + 405,431 B），三档 `exit-code=0`、`rounds.jsonl {"ok":true,"done":17}`。（生成器对这三档的 `enterWorld` 已带告警。）

### quilt 1.21.11 档的四个硬约束（2026-10-01 实测）
1. **quilt 脚手架都不带 Gradle wrapper**：10 个 quilt 树实测 **0 个** `gradlew.bat`（fabric 树都带）⇒ 需要时从同代 fabric 脚手架借 `gradlew` / `gradlew.bat` / `gradle/wrapper/`。
2. **借 wrapper 要挑版本**：`org.quiltmc.loom:1.15.1` 声明 `org.gradle.plugin.api-version=9.2.0` ⇒ Gradle 8.8 / 8.10 直接 `No matching variant of org.quiltmc:loom:1.15.1`；实测 **Gradle 9.5.1** 可用（本机 `.gradle/wrapper/dists/gradle-9.5.1-bin` 已缓存，开箱即用；本机 `gradle-9.2.1-bin` 缓存是 0 MB 半成品，别信它的目录名）。
3. **QSL 没有 1.21.11 版本**：`https://maven.quiltmc.org/repository/release/org/quiltmc/qsl/maven-metadata.xml` 的 `<release>` / `<latest>` 至今 = **`10.0.0-alpha.5+1.21.1`**（匹配 1.21.11 的版本 **0 个**）⇒ 别在 1.21.11 档写"QSL 按模块引入"的教程。
4. **quilt-loader 0.31.0-beta.4 已删 `org.quiltmc.loader.api.entrypoint.ModInitializer`**：该 jar 的 `org/quiltmc/loader/api/entrypoint/` 只剩 `EntrypointContainer` / `EntrypointException` / `EntrypointUtil` / `GameEntrypoint` / `PreLaunchEntrypoint`；`net.fabricmc.api.ModInitializer`（`void onInitialize()`，标 `@Deprecated`，注释写着"Please migrate to using QSL entrypoints, or use your own mixins"）在。⇒ 本仓 quilt 脚手架那两行（`import org.quiltmc.loader.api.entrypoint.ModInitializer` ＋ `onInitialize(ModContainer)`）**编译不过**（实测 `找不到符号: 类 ModInitializer`）。**本轮通关写法**：工程改用 `fabric.mod.json` 的 `entrypoints.main` / `entrypoints.client` ＋ `net.fabricmc.api.*`（quilt-loader 的 Fabric 兼容层负责派发），并加 **dev-only** `net.fabricmc.fabric-api:fabric-api:0.141.6+1.21.11`（driver 的 tick/chat 钩子要用它）；测完按 `REVERT.md` 一并撤除。

## 最小复现路径（三路线：A/B/C 三档 + D 意图会话，2026-09-30～10-01 本机实测走通；命令按"干净 clone"写，不含任何本机私有路径）

> 目标：**从零把一个档跑到"AI 在游戏里自己玩 + 有断言 + 有截图 + 有证据"**。A/B/C 各 ~7 步；先跑 A（1.20.1，最快），再跑 B（1.21.1，要拉资源）；**D 是意图会话**（LLM 实时下意图，前置同 C 的已验证档，2026-10-01 已跑通）——逐步教程的"人话版"见仓库根 `README.md`「后半 loop 教程」。
> 实现侧的改动清单另见下文「最小补法」一节；本节的每个坑都对应上文坑位编号。

### 共同前置（两档都要）
1. **JDK**：1.20.1 线用 **JDK 17**；1.21.x 线用 **JDK 21**（`JAVA_HOME` 指到对应版本，Gradle wrapper 在库里）。
2. **授权（三通道之一，缺一不可）**：`MC_SKILL_PLAYTEST_ALLOW=1` ＋ `MC_SKILL_PLAYTEST_ROOT=<绝对路径>`（该根之下才允许建工程 / 写证据）。
3. **MCP 侧**：`cd mcp-server && npm ci && npm run build`（`dist/` 是构建产物、不入库；`get_server_status.buildStatus` 会在 src 比 dist 新时提示）。

### A. fabric 1.20.1（无桥路线；最快，实测驱动整轮 17/17 `ok:true`）
1. **建工程**：把 `fabric/1.20.1/scaffold` 整个拷到 `<ROOT>/fabric-1.20.1`（**工程目录即游戏根**：`run/` 就是 gameDir，不必改 runDir DSL）。
2. **钉值**：`gradle.properties` 的 `loader_version` = 发布下限（**不动**）；要加 Fabric Language Kotlin 就在**文件末尾**追加 `loader_version_dev=0.16.9`（FLK 1.13.4 地板；取 0.19.5 则支持最新的 1.14.1）——`build.gradle` 的 fabric-loader 行已写成"有 dev 用 dev、没 dev 用发布值"。
3. **（可选）装库**：把 `fabric-language-kotlin-<ver>.jar` 放进 `<ROOT>/fabric-1.20.1/run/mods/`。
4. **关失焦暂停（必做，坑位 22）**：`<ROOT>/fabric-1.20.1/run/options.txt` 写 `pauseOnLostFocus:false`（**强杀进程时 MC 不会自己写这份文件，得手建**；只有这一行也能跑）。
5. **生成驱动**：`generate_playtest_driver{platform:"fabric", version:"1.20.1", driverMode:"temporary_client_tick_driver", enterWorld:"playtest_demo", budgetTicks:30000, evidenceDir:"<绝对路径>", plan:[…]}` ⇒ 把产出的 `PlaytestQaDriver.java` 放进 `src/main/java/<pkg>/playtest/`，并在客户端入口（`*Client.java` 的 `onInitializeClient`）加一行 `PlaytestQaDriver.register();`。
6. **世界**：`<ROOT>/fabric-1.20.1/run/saves/playtest_demo` 必须**已有** `level.dat`（本档无造世界钩子；最省法见 B-3，同版本世界可跨加载器复制）＋ `allowCommands=1`（否则 `cmd` 类步骤全被判 `Unknown or incomplete command`）。
7. **跑与判读**：`gradlew build` ⇒ `gradlew runClient`；读数看 `<evidenceDir>/qa.log`（中文原文）+ `state.json` + `exit-code.txt`（0/1），截图在 `<ROOT>/fabric-1.20.1/run/screenshots/`；汇总用 `inspect_playtest_evidence{evidenceDir, screenshotsDir:"<…>/run/screenshots"}`。测完按 `playtest/REVERT.md` 删驱动与调用行。

### B. forge 1.20.1（无桥路线；**同时覆盖 neoforge 1.20.1**——兼容层别名，见下节）
1. **建工程**：`download_official_mdk{platform:"forge", minecraftVersion:"1.20.1"}`（或直接用 `forge/1.20.1/scaffold`）。
2. **钉值**：同 A-2（`loader_version_dev=0.16.9`）。
3. **世界供给（本档的关键差异）**：用**同版本 vanilla 服务端**造一次世界 —— 下载 1.20.1 `server.jar`（45.6MB，sha256 `3AF73A9D…79E0`）→ `eula=true` + `server.properties` 写 `level-name=playtest_demo`/`gamemode=creative`/`online-mode=false` → 起服到 `Done (…)` 后发 `stop` → 把生成的 `playtest_demo/` 复制进 `<ROOT>/forge-1.20.1/run/saves/`。**并把 `allowCommands` 改 1**：`level.dat` 是 gzip 的 NBT，按"名字前 3 字节是 tag 类型、前 2 字节是长度"定位 `allowCommands`，把载荷字节 0→1（等长改写）；**改完先确认没有客户端持有该世界**，否则旧客户端退出时会把值写回 0。
4. **关失焦暂停（必做）**：同 A-4。
5. **生成驱动**：`generate_playtest_driver{platform:"forge", version:"1.20.1", …}`（计划里 `newworld name=playtest_demo` 可以留着 —— `level.dat` 在时会**自动跳过**；`enterWorld:"playtest_demo"` 走自动进世界）。
6. **跑与判读**：同 A-7（证据/截图路径换成 forge 工程）。
7. **最小断言组合**（两档通用，实测有效）：`assert moved`（真游玩：按前键 + 最小水平位移）→ `cmd locate structure minecraft:village_plains` → `goto parsed tol=24 fly=1 max=9000`（驱动内建**巡航高度 140 + 防卡抬升 + 到位落地**）→ `scan radius=160 blocks=…` → `assert scan_blocks` → `shot` ⇒ 结尾 `[QA] DONE`、`exit-code=0`。

### C. fabric 1.21.1（**桥进世界 + driver 驱动**；2026-09-30 实测 17/17）
与 A 的差别只有一处：**该档不要让 driver 自己进世界**（`enterWorld` 留空）——`IntegratedServerLoader.start(...)` 这条在 1.21.1 会把客户端**冻在世界载入里**（详见坑位 25）。改成：
1. 装桥（`BlackBoxPro-fabric-1.21.1-2.2.4.jar`，sha256 `E4CBA8F5…3827`）+ FLK `1.14.1`；起客户端（`runClient`）；
2. `playtest_bridge status` 确认 `platform=fabric`、`ready`、`actions`（该档实测 **114**）；用 `execute create_world`（或 `join_world`）把客户端送进世界 —— 建世界要几十秒，**响应超时 ≠ 失败**（实测 `BRIDGE_UNREACHABLE` 之后世界里其实已经建好了）；
3. driver 的"需要世界"步骤会自动等世界 ⇒ 之后按 A 的第 7 步跑（实测读数：`assert moved PASS delta=27.13` → `goto unstick` 自救一次 → `arrived dist=23.57` → `scan 9 村民 / 44 方块` → `assert scan_blocks PASS` → 两截图 → `[QA] DONE`）。

### D. in_jvm 意图会话（LLM 实时下意图；2026-10-01 `quilt 1.21.11` 四会话已跑通）
1. **工程/钉值/失焦暂停**：同 A-1～A-4（1.21.11 线用 JDK 21）；进世界按坑位 25/26 的配方 —— 冻结族（`fabric 1.20.4 / 1.21.1 / 1.21.3`）用 vanilla quick play 且 `enterWorld` 留空，1.21.11 线可直接 `enterWorld:"<存档名>"`。
2. **生成驱动**：`generate_playtest_driver{driverMode:"in_jvm_player_agent", platform:"quilt", version:"1.21.11", capabilityProfile:"operator", evidenceDir:"<授权根内绝对路径>", budgetTicks:36000}` ⇒ 与 A 相同的五件产物 ＋ **`playtest/intent-menu.json`**（菜单契约）；默认剧本 = `mark in_jvm:intent-session` ＋ `waitintent max=6000`（守候环）。**非已验证档只出菜单契约 + 结构壳**（不假装能跑）。
3. **装 + 跑**：同 A-5；日志里程碑 `[QA] driver registered` → `[QA] client ready（尚未进世界）—— 剧本开跑` → `[QA] ROUND 1 START（steps=2）`；进世界后第一条 `waitintent` tick 补种 `state.json`（观测面）。
4. **会话循环**（一条意图一轮）：`playtest_intent action=read`（观测面 + `nextSteps`）→ `action=write`（扁平 `{"intent":…, 参数…}`；写侧六段校验，非法在写侧拒）→ driver 消费（`intent.json` → `intent.done.json`）→ 展开原语子计划 → 判唯一一条类型化后置条件 → `intents[]` + `state.json` 刷新 → 回守候；**失败不得自动重试**，按 `nextSteps` 换意图；收尾 `{"intent":"stop"}`（不关游戏）。
5. **验收**：`exit-code=0`；`rounds.jsonl` **每行一条合法 JSON**、`intents[]` 条目形状 `{intent,params,ok,postcondition|failure,detail}`（`ok:true` 只带 `postcondition`、失败带 `failure`）；截图判据带新鲜度 `ageMs`；`inspect_playtest_evidence` 三态 `present`。
6. **本路线专属坑**：邮箱**单槽**（未消费时再写被拒 `MAILBOX_BUSY`，除非 `overwrite=true`）；单次守候 5 min（`waitintent max=6000`）、整轮默认 30 min（`budgetTicks=36000`）；`goto` 无寻路（直线 + `fly` + 巡航 140/防卡；复杂地形超时 ⇒ 换意图）；`structure` 形态需开作弊（`allowCommands=1`）；`block` 形态垂直薄层 `-4..+8`（先落到目标高度附近）；`entity` 只覆盖追踪 ≈48 格；村内扫不到村民先怀疑废弃村；`x=abc` 这类参数判红 `param_not_number`（不静默）。
7. **读数口径**：四会话真机读数见上文「意图空间 · 执行器落地面」（换意图链 / `entity:villager dist=0.62` / `block:hay_block onGround=true` / `ageMs` / `walk_to{x:abc}` 负例）；逐步教程见仓库根 `README.md`「后半 loop 教程」。

### 五个"一定会撞"的坑 → 处置（↔ 坑位编号）
| 现象 | 处置 | 坑位 |
|---|---|---|
| 按键位移**恰好 0.00**（驱动照跑） | `<gameDir>/options.txt` 写 `pauseOnLostFocus:false` | 22 |
| 首跑死在 mixin prepare（fabric 1.20.1 / 1.20.4 / 1.21.1） | scaffold 的 `filesMatching` 补 `examplemod.mixins.json`（**已在库修**；老 clone 请自行补或把 json 占位符落成真值） | 23 |
| `:downloadAssets` 整任务失败 / 卡死（无单件重试） | 两端缓存互借；缺版本时按官方 manifest→`assetIndex.id`→index 放位→比大小补件（**三段修法**） | 24 |
| `loadLevel`：`IOException: 另一个程序正在使用此文件` | 起新实例前杀干净残留 JVM（世界锁）；查 `java.exe` 命令行 | 21 |
| `cmd` 类步骤全被判 `Unknown or incomplete command` | 世界 `allowCommands=1`（见 B-3）；且改完别让持锁客户端回写 | 18 + B-3 |
| `goto` 差 200+ 格判红 | 巡航高度/防卡/到位落地（**驱动侧已内建**；仍红就把 `goto … tp=1` 或加大 `max`） | 18–19 |

### 版本钉速查（引用前按官方发布复核）
- **fabric loader**：本仓各档 `loader_version`（发布下限）与可选 `loader_version_dev`（仅 Loom）——要 FLK 就把 dev 提到地板，别抬发布下限。
- **FLK 地板**：`1.13.4+kotlin.2.2.0` → `fabricloader >=0.16.9`；`1.14.1+kotlin.2.4.20` → `>=0.19.5`（**全 MC 线只发一个 jar**）。
- **桥（有桥路线）**：BlackBoxPro `v2.2.4-dev` 有预编译件的组合 = fabric/neoforge **1.21.11 + 1.21.1**、forge **1.12.2**；其余组合走本节的无桥路线。

## 意图空间（任务 B 设计定稿 v2，2026-10-01 用户审改）

> 适用：`generate_playtest_driver` 的 `in_jvm_player_agent` 真件（LLM 只选意图，执行确定）。
> 粒度守则：**一条意图 = 3–30 秒内可完成、可断言的状态变迁**；失败一律 fail-closed 判红。
> 预算列为**单意图 tick 上限**（超限判红），全局预算仍由驱动的 `budgetTicks`（tick + 意图数 + 总时长）兜底。
> 幂等列里的「一次性」= 重试会重复消耗方块/触发副作用 ⇒ 失败后**不得自动重试**，只许换意图。

| 意图 | 参数 | 前置 | 类型化后置条件（只判这一条，fail-closed） | 危险级 | 预算(tick) | 幂等 | 失败 → 建议替代意图 |
|---|---|---|---|---|---|---|---|
| `walk_to` | `x,z,tol=3`（默认 3–4，目标里显式给）,`max=1200` | 有世界 + 玩家 | 水平距离 ≤ tol **∧** 移动量 ≥ (起点→目标距离 − tol)（后半条防「本来就在那」假绿） | 低 | 1200 | 可重试 | `find_and_goto{fly=1}` ／ `look_at{target}` 换向后重试 |
| `look_at` | `{yaw,pitch}` 或 `{target=pos\|block\|entity,tol=2}` | 有玩家；`target` 形态需目标可解析 | `{yaw,pitch}` 形态 = 两轴误差 ≤ 2°（绝对值设置 ⇒ 几乎必成、信息量低）；`{target}` 形态 = 目标可解析 **∧** 朝向到目标的角误差 ≤ tol **∧** 目标在视距内(≤128) | 低 | 60 | 可重试 | `observe{radius}` 确认目标是否存在 |
| `find_and_goto` | `what=structure\|block\|entity`,`id`,`radius`,`tol=24`,`fly=1`,`max=9000` | 有世界；`structure` 形态需**该世界开作弊**（单机 = `level.dat.allowCommands=1`；服务端 = op。没开时服务器回 `Unknown or incomplete command` ⇒ fail-closed 判红）；`block`/`entity` 形态**无需 op** | 按形态三选一：`structure` → 到达解析坐标 tol 内（复用 `goto parsed` 的 arrived 判定，kind=`reached_parsed_tol`）；`block` → 最近命中 ∧ 到位 ∧ onGround ∧ 目标位仍是该方块（kind=`block_found_and_reached`）；`entity` → 最近命中 ∧ 到位（kind=`entity_found_and_reached`）——**三形态落地状态见下** | 中（structure 需作弊） | 9000（实测 2000+ 格飞掠 ≈90 s） | 可重试（每轮重新解析最近目标） | `tp{x,z}`（仅 op/creative）／ `look_at{target}` + 重试 |
| `mine` | `blockId`,`count=1`,`radius`,`pos`? | 有世界；**目标选择 = 最近匹配优先且限 radius**；**执行前快照**（同 id 命中数，scan 计数） | ① `block_at(目标pos) != blockId`（**单点**）**∧** ② 同 id 命中数较执行前**减少 count**（**集合**，scan 计数） | 中 | 600/个 | 一次性 | 找不到目标 → `find_and_goto{block}`；工具缺失 → `inventory{contains}` |
| `place` | `blockId`,`pos` | 背包含该方块 **∧** 目标位置可替换（空气/水） | `block_at(pos) == blockId` | 中 | 200 | 一次性 | 没方块 → `inventory{contains:id}`；位置不可替换 → `stop` |
| `interact` | `target`,`pos`,**`expect=screen_present:Class\|entity_gone:id\|block_changed:pos,id`（必填）** | 目标在范围内 | **只判 expect 指的那一条**（必填 ⇒ 无「什么都没发生也算过」的松口） | 中 | 200 | 一次性 | `observe{radius}` 看目标当前状态后换意图 |
| `open_gui` | `how=inventory`（自定 GUI 名 ⇒ **待实现**） | 有世界 | `screen_present` **∧** `clicked=true` **∧** `closed=true`（与 `state.json` 的 `gui.{opened,class,clicked,closed}` 字字对应） | 低 | 100 | 可重试 | `screenshot{testId}` 取证后 `stop`／换 `how` |
| `inventory` | `slot=n` **或** `contains:id`（**二选一必填**，都不给 = 无意义断言） | 有世界 | 断言成立（slot 的 `itemId` 匹配 / contains 命中） | 低 | 60 | 可重试 | `screenshot{testId}` 取证，交 LLM 换意图 |
| `observe` | `radius`,`entities`,`blocks` | 有世界 | 结果写进证据 `scan.entities` / `scan.blocks`（**类型化读数**）；既是 LLM 的感知入口，也是 `find_and_goto{block\|entity}` 的实现底座（复用现有 `scan`） | 低 | 60 | 可重试 | 缩小 `radius` 重试 |
| `screenshot` | `testId` | 有世界 | 文件落在 `<gameDir>/screenshots` **∧** >0 B（**大小门只防空文件**；视觉判据另列，标「待选」= 像素非单调检查） | 低 | 60 | 可重试 | 无（本身是取证手段） |
| `wait` | `ticks` 或 `until=chunk\|daylight` | `until` 形态需有世界 | 经过指定 tick ／ 条件成立（区块就绪 / 白天） | 低 | ticks+60 | 可重试 | `stop` |
| `tp` | `x,z,tol=4` | 有世界 + **仅 `capabilityProfile=operator/creative` 列出；`strict_survival` 禁列** | 到达 x,z tol 内（dist ≤ tol） | 中（作弊类） | 200 | 可重试 | `find_and_goto` |
| `stop` | — | — | 驱动器停接新轮（**不关游戏**，与长驻热重载设计一致） | 低 | 0 | — | — |

**`find_and_goto` 三形态的落地状态（以现有 driver 代码为准，2026-10-01 实装 + 真机核）**：三形态**均已接线**（`structure` → `goto parsed`；`block` / `entity` → `scan` **最近命中** → `goto nearest` → `land`），未命中一律 `failIntent(goto_target_missing)` 判红不静默。
- `structure` → **已实现**：`cmd locate structure …` → `goto parsed`（解析聊天回执坐标）。前置 = 该世界开作弊（单机 `level.dat.allowCommands=1` / 服务端 op）。真机正例（quilt 1.21.11 两会话各一次）：`village_plains` `arrived=true dist=23.38 tol=24`。
- `block` → **已实现**：`scan blocks=` → **最近命中**（已由「扫描序 `first`」改为最近优先）→ `goto nearest` → 到位落地。实测 miss 路径：`diamond_ore radius=48` → `goto_target_missing` 判红 → nextSteps 给替代；正例（村 #2，2026-10-01）：`hay_block radius=48` → `block_found_and_reached`（`found=true` / `onGround=true` / `dist=22.73`）。已知限制：垂直采样只有 `-4..+8` 薄层（要先落到目标方块高度附近）；`stride` 默认粗采，小目标（按钮/告示牌）可能漏。
- `entity` → **已实现**：`scan entities=` → 最近命中（客户端实体只在**追踪范围 ≈48 格**内可见；`radius>48` 会打提示）→ `goto nearest`。实测 miss 路径：`ender_dragon` 判红；`villager` 首次 miss 属**废弃村**所致（出生点旁村 #1 到达后 `radius=48` 空扫、无村民无钟），`tp` 到 3126 格外的村 #2 后命中，正例 `entity_found_and_reached`（`found=true` / `dist=0.62`）。⇒ 村内扫不到村民**先怀疑废弃村**，换个村再扫，别把 miss 读成「实体形态不可用」。边角：扫 `minecraft:player` 会**把自己数进去**（循环未排除本地玩家，未修）。
- **三形态共通（已落地）**：命中坐标落 **`state.json` 结构化字段** —— `scan.nearest{found,id,x,y,z}` 与 `goto{x,z,arrived,arrivedDist}`；缺命中时 `goto_target_missing` 的 detail 带「先 scan entities= / blocks=」提示（LLM 可直接据此换意图）。

**执行器落地面（v1 实况，2026-10-01 实装 + `quilt 1.21.11` 三会话真机核）**：
- **已实现意图**（有 `name.equals` 分支）：`walk_to` / `look_at`(yaw|target) / `find_and_goto`(structure|block|entity) / `observe` / `open_gui` / `inventory` / `screenshot` / `wait`(ticks) / `tp`(op/creative) / `stop`；**`mine` / `place` / `interact` 不在 v1**：命中即 `intent 未实现（v1 白名单外）` 判红（不静默）；`wait until=` 同属未实现（`wait_until_unimplemented` fail-closed）。
- **失败语义（邮箱 = 记数据续守候；脚本 = 判红停轮）**：步级失败（goto/land/assert/gui 失败、参数缺、形态不满足、单意图预算耗尽）统一走 `failIntent` —— **邮箱形态** = 记 `intentLog{ok:false}` + 刷新观测 + **继续守候下一条**（会话不死，「选错→判红→换意图→成功」链的底座）；**脚本形态**（`intent` 作为剧本步骤）= `finish(false)` 判红停轮。协议违规（禁列/不在菜单/档位不符）在**写入侧**就被 `playtest_intent` 拒（工具错误码），不进执行器。
- **邮箱协议**：写 `<evidenceDir>/intent.json`（扁平 JSON `{"intent":…, 参数…}`）→ 驱动消费后**改名** `intent.done.json`；`stop` = 收尾（写 rounds + exit-code，**不关游戏**）。写侧六段校验：confirmed → 禁列 → 菜单（13 意图）→ 参数白名单 → 必填 → 邮箱占用（`MAILBOX_BUSY` / `overwrite`）。参数键白名单必须覆盖菜单声明的全集（实测踩过：`observe` 的 `blocks`/`entities` 缺键被静默滤掉 ⇒ 误判「空扫无判据」；现按菜单驱动对账）。
- **证据面**：`rounds.jsonl` **每行一条合法 JSON** —— intentLog 条目**不得**用换行拼接（实测踩过：`"," + nl()` 会把一行拆成多行、判读器整行解析挂）；条目 = `{intent,params,ok,postcondition|failure,detail}`（2026-10-01 质量批拆字段：`ok:true` ⇒ `postcondition` 非空且 `failure` 空；`ok:false` ⇒ 二者恰一非空 —— 判过后置条件没过 = `postcondition` 非空；步级失败 = `failure` 非空，如 `goto_timeout` / `param_not_number`。失败原因**不再挤占** `postcondition`；`state.json.lastIntent` 同形状）。所有进证据的字符串过统一 `jsonEsc`（`\` `"` `\n` `\r` `\t` —— 不转 `\n` 会把 JSONL 一行劈成两半）；邮箱读取用容错解码（`readAllBytes`，非 UTF-8 的 GBK/BOM 变体不再 `MalformedInputException` 断协议，实测 GBK 字节邮箱被正常消费）。截图后置条件带**新鲜度**：只认本条意图起点后落盘的新图（`newestShotMillis` 助手 + shot 步等落盘 ≤60 tick + 判据 `newest ≥ intentStartMillis − 1500`，detail 落 `ageMs`；实测踩过：目录里有 3 小时旧图也会 PASS。真机 `ageMs` 读数为小负值属时钟抖动，按 `-?\d+` 读）。
- **观测契约的刷新三时刻**：会话起步 / 进世界**晚补种**（起步可能早于世界载入，坐标恒 0）/ **每条意图跑完（成败都刷）** —— 缺任一时刻 LLM 会读到陈旧坐标。
- **已验证档**：真执行器只覆盖 `fabric / quilt 1.21.11`（`PLAYTEST_VERIFIED_TIER`），其余档为结构壳。真机读数（as-of 2026-10-01）：会话 1 八意图 —— diamond miss FAIL → 村庄结构 PASS（换意图链）/ `walk_to` 复杂地形 `goto_timeout`（还差 8.31 格，v1 goto 无寻路，nextSteps 给 `find_and_goto{fly=1}`）/ 两张新图 `ageMs=-126/-542`；会话 2 观察反应链八意图 —— `observe{entities}` 空命中判红（参数形态真机走通）/ `ender_dragon`+`villager` miss 判红 / 结构形态 PASS / `look_at{yaw}` PASS（dYaw=0.00）/ `wait{ticks}` PASS / 新图 `ageMs=-1239`；**会话 3（村中寻人，`entity`/`block` 正例补取）** 九意图全 PASS —— 村 #1 到达后 `observe{entities:villager,…}` 空扫（**废弃村**）→ `tp` 3126 格（dist=0.71）→ 村 #2 结构 PASS（dist=22.44）→ `observe` 命中 → `find_and_goto{entity:villager}` PASS（`found=true dist=0.62`）→ `find_and_goto{block:hay_block}` PASS（`onGround=true dist=22.73`）→ 新图 `ageMs=-911` → `stop`；**会话 4（质量批复验：负例 + 证据形状 + GBK 邮箱）** 五意图 —— `walk_to{x:abc}` **FAIL**（`failure=param_not_number`，旧版会静默塌成当前位置判 PASS）→ GBK 字节邮箱 `wait` **被正常消费** → 合法 `walk_to` PASS → `screenshot` PASS（`ageMs=-1870`）→ `stop`；证据双类形状（成功带 `postcondition` / 失败带 `failure`）与 `rounds.jsonl` 单行全验，`exit-code=0`；四会话 `exit-code=0` 且 `rounds.jsonl` 单行可 parse。
- **v1 已知限制**：`goto` 是直线行走 + `fly` 选项，**无寻路** —— 复杂地形可能 1200 tick 超时判红（上面 `walk_to` 实测即此形），靠 nextSteps 换意图兜底；`walk_to` 的「移动量 ≥ 起点→目标距离 − tol」防假绿照旧。

**禁列（不提供）**：`kill` / `tnt` / `fill` 等破坏性动作；`strict_survival` 下不列出 `tp` 与任何 creative-only 意图。

**每轮喂给 LLM 的观测契约（与意图表同等重要；输入封闭 ⇒ 可复现）**：
`player{pos,yaw,pitch,health,food,gameMode,selectedSlot,mainHand}` ＋ `inventory`（摘要 + 命中）＋ **最近一次 `scan`** ＋ **上一步** `{intent,ok,postcondition,detail}` ＋ **剩余预算** ＋ **可用意图列表（按 capabilityProfile 过滤）**。

**实现次序（任务 B）**：⑴ 本表 → ⑵ Java 意图执行器（`intent` 步骤族，复用 `move/goto/scan/gui/shot/assert` 原语；每个意图 = `preflight → 执行 → 后置条件判定 → 写证据`）→ ⑶ `playtest_intent` 工具 + 文件邮箱（`state.json` 观测段 / `intent-menu.json` / `intent.json`，与 `plan.txt` 同形态）→ ⑷ 白名单 + 预算（本表预算列即落点）+ 危险动作禁列 → ⑸ 真机验证（`operator` 档跑「找房子 / 清地 / 试 GUI」+ 一条「选错→判红→换意图」回灌链）→ opt-in 门（默认跳过）。

## 平台降级矩阵（全平台口径）

| 平台档 | 驱动面 | 观察面 | 口径 |
|--------|--------|--------|------|
| 现代 Java：Forge 1.17.1+ / NeoForge / Fabric / Quilt | **桥路线（主）**：装 BlackBoxPro 对应端即可，无需驱动代码（预编译件只覆盖 fabric/neoforge 1.21.11+1.21.1、forge 1.12.2）；**driver 路线（备用）**：Fabric 侧 tick 钩子本仓①级出处 = `data/fabric_1.21.11/reference/1.21.11/src/client/java/com/example/docs/keymapping/ExampleModKeyMappingsClient.java:35`（`ClientTickEvents.END_CLIENT_TICK.register(client -> …)`）；**fabric/quilt 1.21.11 档已签名实证 + 真机跑通**；Forge/Neo 等价钩子未核实 | 桥：截图 + query 响应 + calls.jsonl；driver：framebuffer 截图 + `state.json` + `qa.log` + `exit-code.txt` | 主路线 = 桥（有预编译件时）；无桥档走 driver（现覆盖 fabric/quilt 1.21.11，其余待取证） |
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
3. `generate_playtest_driver`（只吐文本）：默认 `driverMode=external_bridge`（动作序列 + 后置条件 + 证据约定）；**`temporary_client_tick_driver` 在 fabric/quilt 1.21.11 档出真代码**（参数 `expectItem` / `expectSlot` / `enterWorld`；产物含 driver + `plan.json` + `REVERT.md` + 无桥 README）；其余档与 `in_jvm_player_agent` 仅留结构壳（`// TODO(未核实)`，并点名已核实档可作对照但**不得跨版本照抄**）。
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
