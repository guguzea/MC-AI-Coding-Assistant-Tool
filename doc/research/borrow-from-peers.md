# 对标结论：两个同类 MCP 项目能给我们什么

> 输入：`doc/research/minecraft-mod-mcp.md`（peer-a）、`doc/research/mcp-rogal.md`（peer-b）、`doc/research/our-baseline.md`（baseline）。
> 本文**不引入新事实**：每条结论都可追到上面三份报告里的 `路径:行号` 指针；三份报告各自的「未核实」清单在本文同样有效。
> 调研对象是 clone 快照（minecraft-mod-mcp HEAD `853c703`；mcp-rogal 未记 HEAD），**未运行**任何 Gradle / 游戏实例。
> 本文是研究记录，不是本仓的规范口径（规范口径仍是 `AGENTS.md` 与 `doc/` 下的既有文件）。

---

## 0. 一句话结论

两个项目把「AI 怎么真正碰到游戏」这条路走到了我们**没走的那半边**：它们的 MCP server 是**常驻在游戏进程里**、**同步拿回执**的；我们的 MCP server 是**外部生成器 + 事后读证据**。

- 它们强在**四条真值通道**：命令回执、实时日志、真实输入注入、假玩家（peer-b §9 末句）。
- 我们强在**证据纪律**：fail-closed 三件、多客户端联合判绿、越授权根即整体拒、写盘/构建/发布的人在环闸门。
- ⇒ **可借鉴的绝大多数是「单点机制」，不是「架构」**。照搬它们的形态（常驻 mod、反射兜底、103 份组合矩阵）会与我们既有的出处纪律和人在环模型正面冲突。

---

## 1. 两个项目的定位（形态差异是理解一切的前提）

| | minecraft-mod-mcp | mcp-rogal |
| --- | --- | --- |
| 形态 | **双进程**：游戏内 Java mod 起 HTTP+SSE（**不实现 MCP**）+ 外部 TS bridge 说 MCP/stdio 转发 | **单进程**：Fabric mod 在游戏进程内嵌 JDK `HttpServer`，**自己实现 MCP** |
| 关键指针 | `McpHttpServer.java:74-105`；`transport.ts:18-21`、`modClient.ts:52-74`；mod 侧明说不说 MCP：`packages/minecraft-mod-mcp/README.md:38` | `MCPServerModClient.java:42-43`；`HTTPMCPServer.java:6-8,65-71`；端点 `/mcp`：`HTTPMCPServer.java:66` |
| 覆盖 | 55 个 MC 版本 / 103 个 ver+loader 组合；1.7.2 → 26.3 | 单档：MC 26.2 / Fabric / Java 25 |
| 工具面 | MCP **46 个**（`tools.ts`，逐名有指针）；mod 侧另有 37 个 method，5 个无对应工具 | 客户端 **26 个** / 专用服务器 **14 个**（不注册而不是打 flag：`McpTool.java:8-11`） |
| 与我们最像的地方 | `playtest_bridge` 打 HTTP 的形态 | 生成 driver 驱动真实输入的能力 |
| 与我们最不像的地方 | 它自己**启动/管理**游戏实例（`launch_minecraft` / `install_version`） | 它**常驻**在游戏里，AI 连进来 |

---

## 2. 三列对照表

判定口径：**有** = 有实现且在执行路径上；**部分** = 有但缺关键一环；**无** = 未见实现。

| 能力维度 | minecraft-mod-mcp | mcp-rogal | 我们 |
| --- | --- | --- | --- |
| 传输 | stdio ↔ HTTP+SSE | HTTP `/mcp`（自称 streamable HTTP，实际只单发 POST） | stdio（+ CLI 双入口） |
| 请求↔结果关联 | **无**（`sendResponse`/`sendInit` 空实现，`McpMessageHandler.java:18-19,106-107`） | HTTP 同步响应一一对应 | **有**（桥协议带 `id`：`generators/playtest-bridge-mod.ts:721`） |
| 命令真实回执 | **无**（只报 `{"sent":true}`，`PlayerWorldHelper.java:492`） | **有**（`success`/`result`/`errorType`/`cursor`，`CommandOutcome.java:17-42`、`CommandRunner.java:142-166`） | 无（桥是命令级，无 success/result） |
| 实时日志 | 无（mod 侧 grep 不到读日志实现） | **有**（Log4j appender + 有界环 + 游标 + `missed` + `awaitMatch`） | 无（`inspect_runtime` 只 readSync 文件尾部；全仓零 `fs.watch`） |
| 客户端输入控制 | 有（反射注入，19 个输入类工具） | 有（`@Invoker` 打真实 GLFW 回调） | 有（driver 脚本动词，档位受限） |
| 假玩家 / 多人 | 无 | **有**（真 `ServerPlayer`） | 无（靠起多个真客户端 + 文件原语会合） |
| 游戏实例生命周期 | **有**（12 个启动器类工具） | 无（不管启动） | 无（**设计选择**，人在环） |
| 多版本矩阵表达 | 单一真源 → 生成 TS 内嵌 JSON | 不适用（单档） | 8 棵平台树 + 文件树 + 手工记账 |
| 版本矩阵漂移门 | 有 `--check` 生成器但**未接线**（`gen_embedded_versions.py:101-125` 无调用者） | 不适用 | 有且**已接线**（`REAL_RUN_GATES` 62 条） |
| 声明式元数据是否被消费 | **否**（`requiresControl` 死字段） | **否**（4 个配置键、工具 description 里的假工具名） | 部分（`authorization` 在 3 个 playtest 工具声明但不消费） |
| 子进程白名单 | **有**（`spawnGuard.ts:4-18`） | 不适用 | 有路径根守卫，**未见**可执行文件 allowlist |
| 文件沙箱 | 无 | 有（normalize→toRealPath→首段 allowlist，含逃逸单测） | 有（realpath-native 先解析再比较，`utils/project-sandbox.ts`） |
| 自动化测试证据等级 | 单测 0 个文件；真机脚本为主 | 134 个 `@Test` 全 headless | 门 86 道 + 真 javac 编译腿 + L0–L7 阶梯 |
| 人在环 | 有「游戏内亲手接管」闸门（输入类） | 只有鉴权 + 破坏性 UI 二次门，**无调用前确认** | 强（写盘/构建/发布 + 三通道授权根） |
| agent 权限自治上限 | **有明文**（只能 bump PATCH，`AGENTS.md:82-91`） | 无 | **无** |
| 面向陌生 AI 的自举入口 | **有**（把链接丢给 AI 自己配，`AI-TOOLS.md:5-24`） | 无 | **不确定**（有 README 安装节与 `doc/mcp-troubleshooting.md`，未见面向陌生 AI 的自举页） |
| 实时可视现场 | **有**（in-jar `/debug` + SSE + `/api/calls`） | 无 | 无（只有文件级 `calls.jsonl`） |

---

## 3. 可借鉴清单

优先级：**P0** = 立刻可做、收益高、风险低；**P1** = 值得做需排期；**P2** = 需用户拍板或代价高；**P3** = 只记录。

### 3.1 直接可抄（本仓自足，或只改我们自己生成的产物）

#### A1 · 命令回执三段式 + `executedAs`｜P0
- **对方做法**：先 `Commands.validateParseResults` 拿 `cursor`，再 `performCommand`，用 `CommandSourceStack.withCallback` 收 `(success, returnValue)`，反馈由自定义 `CommandSource` 收；结果分 `PARSE`/`RUNTIME`/`SAFETY`/`SKIPPED`/`REMOTE` 五态（`CommandOutcome.java:17-42`、`CommandRunner.java:142-166,217-220,235-256`）。回执显式说明「以谁的位置与权限执行」（`CommandRunner.java:100-116`），并支持 `run_as.permission_level` 做权限级模拟（`:200-215`）。
- **我们的现状**：桥是命令级（`playtest-bridge/index.ts:16`），`await` 的 6 个 condition 都是玩家状态类（`index.ts:255-295`），**拿不到 `success`/`result`**；driver 的 `cmd` 动词同样没有回执。
- **建议动作**：把 `cmd` 的返回从「已发送」升级为 `{success, result, errorType, cursor, executedAs}`；判读侧给 `errorType ∈ {parse, safety}` 判红，`success=false && error=null`（跑了但没匹配）默认判红、需显式 `allowNoop` 才放过。
- **代价与风险**：要改我们生成的桥/driver 模板（Java 侧）。风险点是**跨档签名核实**：`validateParseResults` / `withCallback` 必须逐档 javap 核实，表外档只能出结构壳 —— 沿用现成的 `PLAYTEST_VERIFIED_TIER` 机制（`playtest-driver.ts:1794`）即可，不要破例。
- **为什么值**：这正是我们 `AGENTS.md` 反复强调的「命令发出去了 ≠ 效果发生了」的假阴性问题，对方把它做成了机读字段。

#### A2 · 日志游标 + 缺口披露 + 阻塞等待｜P0
- **对方做法**：有界 `ArrayDeque` 环 + 单调 id + `missed`/`droppedTotal` **显式披露缺口** + `awaitMatch` 阻塞等待（`LogRingBuffer.java:37-62,90-119,129-149`）；日志与聊天合进同一条可搜尾巴（`McpLogs.java:51-64` + `ChatMessageCaptureMixin.java:17-23`）。
- **我们的现状**：`inspect_runtime` 是「打开→fstat→readSync 尾部→关闭」（`runtime-inspect/index.ts:91,101,134,255`），全仓零 `fs.watch`。
- **建议动作（纯 TS，不改游戏内）**：给 `inspect_runtime` 加「游标 + 缺口披露」契约（返回 `nextId`/`missed`），并新增 `wait_for_log` 式的有界阻塞等待。
- **代价与风险**：低。**必须处理日志轮转**：`latest.log` 被重命名/截断时字节游标会静默失效 —— 要检测 size 回退并明说 `rotated:true`，否则我们就是把对方的优点抄成了「静默丢日志」。

#### A3 · 端口零配置递减扫描 + 载荷形状握手｜P1
- **对方做法**：mod 从 9876 递减找第一个可 bind 的端口（`McpHttpServer.java:79-92`）；bridge 同样递减探测，**握手判据是载荷形状**（`ok===true && type==="minecraft-mod" && typeof port==="number"`，`consts.ts:18-22`）而不是「端口通」（`scanner.ts:21-27`）。
- **我们的现状**：桥固定 `127.0.0.1:38081`（`playtest-bridge/index.ts:39`、`playtest-bridge-mod.ts:383`），端口冲突即整体失败，也没有「连错实例」的判据。
- **建议动作**：桥端口改区间扫描 + `/status` 载荷形状校验；并且**比对方多做一步** —— 把 `/status` 里的 platform/version 与本次请求的档位做一致性校验（对方没有这个校验）。
- **代价与风险**：中。这是**协议变更**，新工具连旧桥/旧工具连新桥都要能活：必须带版本字段并保留 fallback，否则一次升级会把用户已有的桥打废。

#### A4 · 子进程可执行文件白名单｜P1
- **对方做法**：所有 `spawn` 前过 basename 白名单 `assertAllowedProgram`，三张表 `JAVA_ALLOWLIST`/`GRADLEW_ALLOWLIST`/`SERVER_SCRIPT_ALLOWLIST`（`spawnGuard.ts:4-18`，调用点 `handlers.ts:252,450`、`http.ts:75`、`cli.ts:1182`）。
- **我们的现状**：有路径根守卫（`utils/project-sandbox.ts`），`spawn` 落点集中在 `decompile/java/java-process.ts`、`mdk/index.ts`、`cli/index.ts:259`；baseline **未见**可执行文件 allowlist。
- **建议动作**：加一个 `assertAllowedProgram()`，对 `java`/`javaw`/`gradlew`/`gradlew.bat`/`taskkill` 做 basename 校验，所有 spawn 前置。
- **代价与风险**：极低（一个工具函数 + 若干调用点）。

#### A5 · 工具名引用门（对方是反面教材）｜P0
- **对方反面事实**：mcp-rogal 的工具 description 引用了**不存在**的工具：`FakePlayersTool.java:48` 的 `click_dialog_button`、`OpenScreenTool.java:74` 的 `set_option`（真实名是 `options`）—— 模型会照着 description 去调不存在的工具（peer-b §8.3）。
- **我们的现状**：已有 `assert-*-wording` 系列门（baseline §4.3），但**没有**「description 里提到的工具名必须存在于注册表」这道门；而我们的工具描述里大量互引工具名。
- **建议动作**：新增 `assert-tool-name-refs.mjs`：扫 `tool-registry.ts` / `wave/register.ts` / `prompts/templates.ts` / `AGENTS.md` 工具表里形如工具名的标识符，必须能在 `listAllToolSchemas()` 命中，否则红。历史误写先走 `--queue` 人工销账（仿 `assert-rules-api-names.mjs` 的桶机制）。
- **代价与风险**：低。风险是首轮可能红一片 —— 那正是它的价值。

#### A6 · 「命令成功 ≠ 加载成功」：`/reload` 类操作自动带日志回执｜P1
- **对方做法**：`reload_datapacks` 把 `/reload` 之后的日志一并回传，并给 `logHasWarnings` 布尔（`ReloadDatapacksTool.java:55-89`）；因为 `/reload` 即使包坏了也返回成功。
- **我们的现状**：我们有 `validate_datapack_json`，但没有「重载后自动带日志回执」的工具形态；判据放接收端的纪律靠人记。
- **建议动作**：driver 的 `cmd` 动词在命令是 `/reload` 类时，自动附「命令后新增日志 + 警告布尔」。
- **代价与风险**：低。依赖 A2 的游标机制，建议 A2 先行。

#### A7 · 等 tick 的回执：`advance_ticks` 报「实际推进了多少」｜P1
- **对方做法**：返回 `requestedTicks`/`ticksAdvanced`/`startTick`/`currentTick`，未达标附 warning（`AdvanceTicksTool.java:60-71`）。
- **我们的现状**：plan 有 `wait` 动词，但没有「实际推进了多少 tick」的回执 ⇒ 游戏卡住 / `/tick freeze` 时无法区分「等到了」与「没等到」。
- **建议动作**：`wait` 动词返回实际推进量 + 未达标 warning；判读侧把 warning 计入 `qa.log`。
- **代价与风险**：低。

#### A8 · 两个截图假阴性的经典坑（零成本，写进模板与坑位清单）｜P0
- **对方做法**：① 截图前若移动了玩家，等 **2 个 end-of-tick** 再抓帧（`ScreenshotUtils.java:95-104`）；② `PauseGuard` 启动即关 `pauseOnLostFocus`，并在日志里说明原因与回退开关（`PauseGuard.java:31-47`）——否则切窗口后暂停菜单盖住画面，所有截图与屏幕读取同时失真，且症状极难归因。
- **我们的现状**：根 `AGENTS.md` 的游玩自测节与 `doc/playtest-loops.md` 的坑位清单**未提**这两条。
- **建议动作**：写进 driver 生成器模板 + 两份文档的坑位段。纯文档与模板改动，零协议风险。

### 3.2 需要改造（方向对，但形态不同或有跨档代价）

#### B1 · 假玩家（真 `ServerPlayer`）｜P2，需用户拍板
- **对方做法**：真 `ServerPlayer` + `placeNewPlayer` + `EmbeddedChannel` 丢弃出站包；UUID 名字派生、按 UUID 登记、死后自动重生、`despawn` 走 `PlayerList.remove`（`FakePlayer.java:29-94`、`FakePlayerRegistry.java:18-33`、`FakePlayerRespawner.java:22-53`）。好处是**游戏逻辑不 special-case 假玩家**（可被 `@a` 选中、可计分、退赛事件真的触发）。
- **我们的现状**：多人规则靠起多个真客户端 + `touch`/`waitfile` 会合 + `inspect_playtest_multi` 联合判绿（`AGENTS.md:80`）—— 成本高，且覆盖不到「第三人加入/离开」。
- **改造点与真实冲突**：我们的 driver/bridge 是**生成物**而非常驻 mod；服务端面（Paper）是天然落点，但 `AGENTS.md` 明说插件面**不碰 `net.minecraft.*`** ⇒ 只能走 Bukkit 的玩家模拟，能力天花板明显低于对方。**这是一个需要用户拍板的设计冲突，不是可以代劳的实现细节。**
- **代价与风险**：高（新平台面能力 + 跨档签名核实 + 假玩家在不同版本实现差异大）。建议先出调研与最小原型，不直接落。

#### B2 · 控制模式闸门（游戏内人工接管）｜P2，需用户拍板
- **对方做法**：默认**不允许**任何输入类命令；mod 侧维护 `ALWAYS_ALLOWED` 白名单，非白名单命令在未接管时返回 `{"error":"not in control mode", ...}`（`McpMessageHandler.java:43-51,64-67`）；用户必须在游戏内（暂停屏按钮或 overlay）**亲手**接管（`ControlModeHelper.java:57-74`、`ModDevMcpMod.java:76-97`）；接管期间屏蔽暂停屏（`MinecraftClientMixin.java:25-30`）。
- **我们的现状**：授权是**路径级**的（`MC_SKILL_PLAYTEST_ALLOW` + `MC_SKILL_PLAYTEST_ROOT` + `confirmed`，`playtest-evidence/index.ts:52-70`），没有「游戏内一次性人工接管」这一手。
- **改造点**：我们的 driver 正在驱动真实玩家输入，却缺一道「人亲手开门」。可加：driver 启动后进只读观察态，需要一个游戏内动作（口令/按键）才解锁输入类动词，解锁状态写进 `state.json` 作为证据的一部分。
- **代价与风险**：中（driver 生成器 + plan 语义 + 证据契约）。**这是「人在环强度」的取舍，按 `AGENTS.md` 属不可代劳，必须先问用户。**

#### B3 · 真机覆盖账本（哪些档没测、为什么没测）｜P1
- **对方做法**：27 个组合跑 Xvfb/llvmpipe 真机 headless，被排除的组合**写明理由**（installer 404 / narrator 环境）（`ci.yml:368-413,473-499`）。
- **我们的现状**：有 L0–L7 阶梯与证据三件，也有 `PLAYTEST_VERIFIED_TIER`，但**没有**一份「逐档位跑了/没跑/为何没跑」的机器可读账本。
- **建议动作**：新增 `playtest-coverage.json`（档位 × 路线 × 最后验证日期 × 豁免理由），由门校验其与 `PLAYTEST_VERIFIED_TIER` 一致。
- **代价与风险**：低-中。直接补上 baseline 缺口 3 的「账本」面。

#### B4 · 迁移文档固定模板｜P1
- **对方做法**：build 变化 → 源码变化（含前后对照表）→ **逐条验证命令** → 明确未验项（`docs/minecraft-26.2-migration.md:7-41`）。
- **我们的现状**：有 `CORPUS_PROVENANCE.md` 与各平台档，但迁移记录模板未统一。
- **建议动作**：统一模板，强制「未验项」一节。代价低，收益是避免把「编译过」当「功能可用」。

#### B5 · 「已坑过我们的 API 事实」清单（按平台档）｜P1
- **对方做法**：`ARCHITECTURE.md:40-58` 一张清单，逐条写「26.2 已经坑过我们的 API 事实」（`PermissionSet` 不是 int、`Minecraft.gui`、`Window.handle()`、输入事件是 record 等）。一个文件替代无数次翻车，对 agent 尤其有效。
- **我们的现状**：有大量 `doc/*.md` 平台档与反模式库，但没有同形态的「本项目/本档踩坑台账」；且我们的规则树是**按档**的，对方是**按 ver+loader 组合**。
- **建议动作**：各平台档增加 `PITFALLS.md`，每条 = 事实 + 出处 + 已核实档位（我们的 `assert-*-wording` 门可以校验出处）。
- **代价与风险**：中（要持续维护）。

#### B6 · `description` 写成 prompt：主动说明反直觉行为｜P1
- **对方做法**：`ExecuteCommandsTool.java:41-47`（`/function` 除非以 `/return` 结尾否则报 `success=false, result=0`，这是正常 MC 行为不是失败）、`AdvanceTicksTool.java:31-36`。
- **我们的现状**：工具描述质量参差，缺「反直觉行为」这一节。
- **建议动作**：给高风险工具（`playtest_bridge`、`inspect_playtest_evidence`、`generate_*`）的 description 增加该段；已有 `assert-total-semantics-wording.mjs` 作为同类门的先例可仿。

#### B7 · 写入端截断与脱敏｜P1
- **对方做法**：请求/响应体入日志前 base64 脱敏 + 长度截断，且有单测（`HTTPMCPServer.java:30-34,239-257`、`HTTPMCPServerTest.java:167-188`）。理由：一张截图能把 `latest.log` 淹没，反而让真错误不可见。
- **我们的现状**：`inspect_runtime` 读侧有 `maxBytes` 硬顶，但**写侧**（我们的 `calls.jsonl`）未见同类防护。
- **建议动作**：写 `calls.jsonl` 时对 base64/超长字段截断并标 `truncated:true`。

#### B8 · 沙箱逃逸的专门测试｜P1
- **对方做法**：文件沙箱三步 `normalize()` → `toRealPath()` → 首段 allowlist，并有专门测试覆盖 symlink 逃逸（`GameFileAccess.java:78-117`、`GameFileAccessTest.java:45-111`）。
- **我们的现状**：`utils/project-sandbox.ts` 的判据已等价甚至更严（不依赖 `isSymbolicLink()`，一律 realpath-native 解析父目录，`project-sandbox.ts:1-13`）。**但「有专门测试覆盖 Junction/symlink 逃逸」这点要核对。**
- **建议动作**：检查 `test-path-guards.mjs` 是否覆盖 Windows Junction 逃逸；不足则补测试（实现不必改）。

### 3.3 只作参考（形态差异大，只吸收个别细节）

#### C1 · 游戏实例生命周期管理（12 个启动器类工具）｜P3
- **对方做法**：`launch_minecraft` / `install_version` / `install_server` / `create_offline_account` / `list_accounts` / `detect_java` 等（`tools.ts:257,284,297`），`mcp-server/src` 里我们**0 命中**。
- **结论：不作为工具面借鉴** —— 这是我们在人环模型下的**设计选择**（不代跑/不代启）。
- **但两条子做法值得写进坑位清单**：① jar 取用顺序「本地构建产物 → Releases → null 并**明说**『静默没有 MCP 能力』」（`platform.ts:55-104`）；② **注入方式必须拷进 `mods/`，绝不进 classpath**（1.17+ 模块化会 `ResolutionException`，`launch.ts:25-30`）—— 后者对我们「通道 B 装桥」的指引有直接价值。

#### C2 · 按 ver+loader 组合沉淀调研文档｜P3
- **对方做法**：`docs/research/<ver>+<loader>.md` 各 23 份，版本差异沉淀成「按组合可检索」的知识。
- **我们的现状**：规则树/语料按平台×档位组织，方向一致但粒度是「档」不是「组合」。**不需要改**，只在需要时参考。

#### C3 · in-jar 调试面板 + SSE 现场｜P3
- **对方做法**：`/debug` 静态页（`McpHttpServer.java:101,176-223`）、`/api/events` SSE（`:349-383`）、`/api/calls`（`:385-398`），事件环形缓冲 200。
- **我们的现状**：证据是文件级（`calls.jsonl` + `qa.log` + `state.json`）。
- **结论**：SSE 对我们价值有限（我们是事后判读）。若要做，**零游戏内改造的替代**是「读 evidence 目录 → 生成单文件 HTML 报告」，优先级 P3。

#### C4 · 截图叠坐标网格｜P3
- **对方做法**：mod 侧在 PNG 上叠 100px 网格与刻度，返回 `{original, grid, width, height}`（`McpHttpServer.java:267-290`），让「看图点坐标」可被验证。
- **我们的现状**：截图只做存在性/三态判读。
- **注意**：若在**判读侧**叠网格，会破坏「证据原样」原则 ⇒ 应另存 `annotated/` 副本并标注，不能覆盖原图。

---

## 4. 明确不值得我们学的

| # | 对方做法（指针） | 为什么不能学 |
| --- | --- | --- |
| 1 | 命令执行只报「已投递」：成功返回 `{"sent":true,"method":"dispatcher.execute"}`（`PlayerWorldHelper.java:492`） | 与我们「判据放接收端」的口径正面冲突；照它写测试会把「命令发出去了」误读成「效果发生了」 |
| 2 | 超时静默成空串：5s `latch.await` 超时后多数路径返回初始 `""`（`McpMessageHandler.java:123-124,321-322`） | 与 fail-closed + 三态（present/absent/unreadable）纪律正面冲突，正是我们要拦的反模式 |
| 3 | `private static String lastClickResult` 跨线程共享（`ReflectedInputHandler.java:131`），而线程池 8（`McpHttpServer.java:93`） | 并发点击可能读到别人的结果 |
| 4 | 测试面虚高：`npm test` = `vitest run --passWithNoTests`、全包 0 个测试文件；`tests/` 实际为空、基准截图缺失且 CI 对缺失**软跳过**（`ci_helper.py:906-908`） | 不要拿「有 CI」当「有测试覆盖」的证据 |
| 5 | 门存在但**未接线**：`gen_embedded_versions.py --check` 无任何调用者 | 门必须挂在执行路径上，否则只是注释 —— 我们自己的 86 道门要保持「已接线」这个优势 |
| 6 | 绑定地址不一致 + 无鉴权：mod 监听 `0.0.0.0`（`McpHttpServer.java:77,83`）而 bridge 假设 `127.0.0.1`（`defaults.ts:62`），端点无 token、`Access-Control-Allow-Origin: *`（`:219,403`） | 不要把该形状带进任何可能被多机访问的场景 |
| 7 | 反射兜底路线：按方法名/字段名/返回类型猜（`PlayerWorldHelper.java:100-125`、`ReflectedInputHandler.java:91-129`） | 与我们的「每条 API 论断必须有出处」反方向；它把不确定性推给运行时 |
| 8 | 103 份组合的构建脚本 + 204 行 `srcDir`（每个组合把 common 源码再编译一遍） | 我们不产出「每个 MC 版本一份可分发 jar」，抄这套矩阵只会引入 103 份需要同步的构建脚本 |
| 9 | 声明式元数据不在执行路径上：`requiresControl` 声明 + 19 处赋值但**无读取点**（`tools.ts:7`）；mcp-rogal 4 个配置键「写了不生效」（`MCPConfig.java:126-133,141`） | 给 AI 看的假信号。**对策见 A5**：加门 |
| 10 | mcp-rogal 无界线程池 + 无请求队列、无背压（`HTTPMCPServer.java:68`）；自称 streamable HTTP 但无 `Mcp-Session-Id` | 我们工具面大得多，照搬会放大问题 |
| 11 | 聊天采集依赖 Mixin 硬编码签名描述符（`ChatMessageCaptureMixin.java:18`） | MC 改签名即断，且只覆盖客户端；我们若做同类能力应优先不依赖 Mixin 的入口 |
| 12 | 134 个 `@Test` 全 headless 纯逻辑（`TESTING.md:16-23` 自认），无 GameTest、无端到端 | 自动化证据等级低于我们要求的 L4/L5 |

---

## 5. 顺手发现的自家问题（baseline 附带产出，与对标无关但应记账）

1. **`authorization` 参数在 3 个 playtest 工具里声明了但实现不消费**：`inspect_playtest_evidence`（`wave/register.ts:222`，全文仅 1 次命中）、`inspect_playtest_multi`（`playtest-multi/index.ts:61`）、`playtest_intent`（`playtest-intent/index.ts:27`）；只有 `playtest_bridge` 真读（`playtest-bridge/index.ts:64-65`）。**这正是 A5 那道门要拦的形状**（声明式字段必须有消费点）。
2. **一道门的头注与门链数组口径不一致**：`assert-playtest-driver-compiles.mjs:24` 自述「本脚本不进 `npm test`」，但它已登记进 `REAL_RUN_GATES`（`test-scripts.mjs:2239`），而 `npm test` 包含 `test-scripts.mjs`。可解释的一半是缺件时降级并吼（`SKIP(缺件)` exit 0）；**事实是两处口径不一致，需人工裁定**。
3. **文档口径 vs 工具实现**：根 `AGENTS.md` 提到把授权原文写 `$MC_SKILL_CACHE/playtest-authorizations.json`，但 `mcp-server/src` 里**零命中** ⇒ 那是文档约定，工具侧不读也不校验。

> 这三条都不是本次对标引入的，是 baseline 盘点时的副产品；建议单独排期，不要混进对标落地里。

---

## 6. 建议的落地顺序（供用户挑选，本次未改任何代码）

**第一批（P0，纯本仓、零协议风险，可一次性做完）**
A5 工具名引用门 → A2 日志游标与缺口披露 → A8 两条截图坑位写进模板与文档 → A1 命令回执（先在已验证档出真代码，表外档保持结构壳）。

**第二批（P1，需排期；部分含协议变更）**
A4 子进程白名单 → B7 写入端截断 → B8 沙箱逃逸测试核对 → A7 wait 回执 → A6 `/reload` 带日志 → B3 覆盖账本 → A3 端口扫描与形状握手（协议变更，需版本兼容设计）→ B5 各档 PITFALLS → B6 描述反直觉段 → B4 迁移模板 → 面向陌生 AI 的自举页。

**第三批（P2，必须用户拍板）**
B1 假玩家（含插件面「不碰 `net.minecraft.*`」的设计冲突）→ B2 控制模式闸门（人在环强度的取舍）→ 「agent 权限自治上限」条款（对方 `AGENTS.md:82-91` 的 PATCH-only，我们缺；若写进根 `AGENTS.md` 需同步 `README.md` 与 `README.en.md` 三处）。

**不建议做**：C1 启动器工具面、C2 组合粒度文档矩阵、第 4 节全部 12 条。

---

## 7. 证据与边界

- 本文所有指针**转引自**三份源报告；如需逐条核对，请以源报告为准（peer-a 284 条指针 / peer-b 235 条指针 / baseline 162 条指针）。
- 三份报告共同的边界：**未运行**任何 Gradle 与游戏实例，所有运行时结论均为「源码实证」或「文档声称」，未做行为验证。
- 两个 clone 均在 `temp/peer-recon/`（`temp/` 已在 `.gitignore` 内），**未修改**，可随时复核或删除。
- 本机 git/curl 的 schannel TLS 后端失效（`SEC_E_NO_CREDENTIALS`）；本次改用 `git -c http.sslBackend=openssl` 与 Node 内置 fetch 完成取数。