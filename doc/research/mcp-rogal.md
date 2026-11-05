# 对标调研：rogalKraft/mcp-rogal

> 调研对象：`temp/peer-recon/mcp-rogal`（clone 快照，**未修改**）。
> 本文所有证据指针均为 **相对 clone 根目录** 的 `相对路径:行号`；未核实的项一律写「未核实」，不补名字、不猜版本。
> 结论一律以 `src/` 源码为准（本仓不存在 `dist/` 编译产物，全部结论来自 Java 源码与仓库文档）。

---

## 1. 形态

**结论：Fabric 模组（不是 Forge / NeoForge），MC 26.2，模组进程内嵌一个 HTTP MCP server；不是外部进程。**

| 事实 | 证据 |
| --- | --- |
| 加载器 = Fabric Loom | `build.gradle:1-4` —— `id 'net.fabricmc.fabric-loom' version "${loom_version}"` |
| MC = `26.2` | `gradle.properties:7` —— `minecraft_version=26.2` |
| Loader = `0.19.3`，Loom = `1.17-SNAPSHOT` | `gradle.properties:8-9` |
| Fabric API = `0.154.1+26.2` | `gradle.properties:17` |
| mod 版本 = `1.3.0+mc26.2`，包名 `org.wallet.rogalik.mcp` | `gradle.properties:12-14` |
| Java 25 | `build.gradle:61` —— `it.options.release = 25`；`build.gradle:74-75` `JavaVersion.VERSION_25` |
| Fabric 元数据 id = `mcp-rogal`，`environment` = `"*"`（双侧） | `src/main/resources/fabric.mod.json:3`、`:20` |
| 三个入口点 main / client / server | `src/main/resources/fabric.mod.json:21-31` |
| 依赖下限 `minecraft "~26.2"`、`java ">=25"` | `src/main/resources/fabric.mod.json:39-44` |
| 上游血缘 = `cuspymd/mcp-server-mod` | `src/main/resources/fabric.mod.json:11`（`credits`）；`ARCHITECTURE.md:8-9` |
| 许可 = CC0-1.0 | `src/main/resources/fabric.mod.json:18`；`LICENSE` |

**「内嵌 HTTP server」的证据链**：

- 客户端入口在 `ClientModInitializer.onInitializeClient` 里直接 new 出 HTTP server 并 start：
  `src/client/java/org/wallet/rogalik/mcp/MCPServerModClient.java:42-43` ——
  `httpServer = new HTTPMCPServer(config, ClientToolset.build(config)); httpServer.start();`
- 服务端入口在 `ServerLifecycleEvents.SERVER_STARTED` 回调里同样 new + start：
  `src/main/java/org/wallet/rogalik/mcp/MCPServerModServer.java:19`、`:49-50`
- 服务器用的是 JDK 自带 `com.sun.net.httpserver.HttpServer`，**不是** Netty/外部进程：
  `src/main/java/org/wallet/rogalik/mcp/bridge/HTTPMCPServer.java:6-8`（import）、`:65-71`（create/start）
- 端点固定单路径 `/mcp`：`HTTPMCPServer.java:66` —— `httpServer.createContext("/mcp", new MCPHandler())`
- 默认 `localhost:8080`：`src/main/java/org/wallet/rogalik/mcp/config/MCPConfig.java:107-108`（`port = 8080`、`host = "localhost"`）
- 自述：「The mod runs an HTTP server inside the Minecraft client or a dedicated server and exposes 26 MCP tools」：`README.md:9-10`

**源码集划分（Fabric split environment）**：

- `build.gradle:22` —— `splitEnvironmentSourceSets()`；`:24-29` 把 `sourceSets.main` 与 `sourceSets.client` 都挂到 mod `mcp-rogal`
- `build.gradle:31-35` —— `runs { server { source sourceSets.client } }`，即 dev 的 dedicated server 也会带 client 源码集（这一点与 `ARCHITECTURE.md:63-64` 的「`src/main` must never import client classes」并不冲突，是给 dev run 用的）
- `ARCHITECTURE.md:62-86` 给出两侧目录职责：`src/main` 共享且能在 dedicated server 跑，`src/client` 只能引用 `Minecraft` 等客户端类

**mappings 口径**：`README.md:47` 明写 —— "Minecraft 26.2 is unobfuscated. This mod is built against Mojang official names and does not use Yarn mappings."（与 `docs/minecraft-26.2-migration.md:5` 一致）。⇒ 本项目的类名/方法名可直接当 mojmap 名读。

---

## 2. MCP 工具面完整清单

工具名 **逐字**取自各工具实现的 `name()` 返回值；注册点取自两个入口类的 `ToolRegistry` 链。

**注册即可用性**（没有 availability flag）：`src/main/java/org/wallet/rogalik/mcp/server/tools/McpTool.java:8-11` 的 javadoc —— "Availability is decided by registration rather than by a flag on the tool"；`ARCHITECTURE.md:93-94` 同义。

### 2.1 客户端注册（26 个）

注册点：`src/client/java/org/wallet/rogalik/mcp/MCPServerModClient.java:70-102`。

| # | 工具名（逐字） | `name()` 指针 | 参数（逐字取自 `inputSchema()`） |
| --- | --- | --- | --- |
| 1 | `execute_commands` | `src/main/java/org/wallet/rogalik/mcp/server/tools/ExecuteCommandsTool.java:26` | `commands`(array,req)、`validate_safety`(bool,def true)、`wait_ticks`(int,def 0)、`run_as`{ `player`,`permission_level` } |
| 2 | `get_player_info` | `.../server/tools/GetPlayerInfoTool.java:21` | `player`(string)、`include_inventory`(bool,def true) |
| 3 | `get_blocks_in_area` | `.../server/tools/GetBlocksInAreaTool.java:24` | `from`{x,y,z,req}、`to`{x,y,z,req} |
| 4 | `take_screenshot` | `.../server/tools/TakeScreenshotTool.java:35` | `x`,`y`,`z`,`yaw`,`pitch`（number，全可选） |
| 5 | `advance_ticks` | `.../server/tools/AdvanceTicksTool.java:26` | `ticks`(int,req,1–12000) |
| 6 | `get_logs` | `.../server/tools/GetLogsTool.java:17` | `since_id`、`tail`、`min_level`(enum TRACE..FATAL)、`pattern`、`logger_pattern`、`sources`(array)、`limit`(1–2000,def 200) |
| 7 | `wait_for_log` | `.../server/tools/WaitForLogTool.java:25` | `pattern`(req)、`timeout_ms`(def 15000)、`min_level`、`logger_pattern`、`since_id`、`sources` |
| 8 | `get_crash_reports` | `.../server/tools/GetCrashReportsTool.java:24` | `count`(def 3,1–10)、`include_latest_log`、`log_tail_lines`(def 200,1–2000) |
| 9 | `list_ids` | `.../server/tools/ListIdsTool.java:38` | `registry`(enum,req)、`filter`、`regex`、`limit`(def 200,1–5000)、`offset` |
| 10 | `describe_block_state` | `.../server/tools/DescribeBlockStateTool.java:19` | `block`(req)、`include_example`(def true) |
| 11 | `validate_command` | `.../server/tools/ValidateCommandTool.java:29` | `command`(req)、`suggest`(def false) |
| 12 | `files` | `.../server/tools/FilesTool.java:30` | `action`(enum list/read/write/mkdir/delete,req)、`path`(req)、`content`、`recursive` |
| 13 | `get_world_info` | `.../server/tools/WorldInfoTool.java:25` | 无参数（`SchemaBuilder.empty()`，`WorldInfoTool.java:42`） |
| 14 | `reload_datapacks` | `.../server/tools/ReloadDatapacksTool.java:27` | `include_log`(bool,def true) |
| 15 | `fake_players` | `.../server/tools/FakePlayersTool.java:33` | `action`(enum spawn/despawn/list,req)、`name`、`position`{x,y,z}、`dimension`、`gamemode`(enum)、`yaw`、`pitch` |
| 16 | `press_key` | `src/client/java/.../input/PressKeyTool.java:29` | `key`(req)、`modifiers`(array)、`action`(enum tap/press/release)、`hold_ticks`(def 0)、`repeat`(def 1) |
| 17 | `type_text` | `.../input/TypeTextTool.java:23` | `text`(req)、`press_enter`(def false) |
| 18 | `send_keybind` | `.../input/SendKeybindTool.java:27` | `keybind_id`(req)、`hold_ticks`(def 0) |
| 19 | `list_keybinds` | `.../input/ListKeybindsTool.java:18` | `filter`、`only_bound`(def false) |
| 20 | `mouse` | `.../input/MouseTool.java:25` | `action`(enum move/click/press/release/scroll/drag,req)、`x`,`y`、`button`(enum)、`coord_space`(enum gui/window)、`scroll_x`,`scroll_y`、`modifiers` |
| 21 | `get_open_screen` | `src/client/java/.../ui/GetOpenScreenTool.java:17` | `filter`、`only_clickable`(def false) |
| 22 | `click_widget` | `.../ui/ClickWidgetTool.java:29` | `label`、`index`、`button`(enum)、`allow_destructive`、`settle_ticks`(def 5) |
| 23 | `open_screen` | `.../ui/OpenScreenTool.java:63` | `screen`(req)、`settle_ticks`(def 2) |
| 24 | `options` | `.../ui/OptionsTool.java:28` | `filter`、`name`、`value` |
| 25 | `reload_resources` | `.../ui/ReloadResourcesTool.java:27` | `timeout_ms`(def 120000) |
| 26 | `rejoin_world` | `.../ui/RejoinWorldTool.java:30` | `timeout_ms`(def 120000) |

### 2.2 专用服务器注册（14 个）

注册点：`src/main/java/org/wallet/rogalik/mcp/MCPServerModServer.java:30-47`。

`execute_commands`、`get_player_info`、`get_blocks_in_area`、`advance_ticks`、`get_logs`、`wait_for_log`、`get_crash_reports`、`list_ids`、`describe_block_state`、`validate_command`、`files`、`get_world_info`、`reload_datapacks`、`fake_players`。

差集 = **`take_screenshot` 与 11 个 client-control 工具**（`press_key`/`type_text`/`send_keybind`/`list_keybinds`/`mouse`/`get_open_screen`/`click_widget`/`open_screen`/`options`/`reload_resources`/`rejoin_world`）在服务端**根本不注册**。注释把机制写明：

- `MCPServerModServer.java:28-29` —— "take_screenshot is simply not registered here - there is no framebuffer on a dedicated server, so it never appears in tools/list."
- `MCPServerModServer.java:91` —— "Input and interface control, client only by nature."（客户端侧）
- 单元测试把这条行为钉住：`src/test/java/org/wallet/rogalik/mcp/bridge/HTTPMCPServerTest.java:122-136`（未注册工具 ⇒ `Unknown tool: take_screenshot`）

### 2.3 MCP 协议面

- 支持的方法只有 4 个：`initialize` / `ping` / `tools/list` / `tools/call` —— `HTTPMCPServer.java:286-301` 的 switch
- `notifications/*` 返回 null（HTTP 202）—— `HTTPMCPServer.java:280-283`、`:154-157`
- 协议版本只认 `2025-03-26`，其余一律回默认 `2025-06-18` —— `HTTPMCPServer.java:309-316`
- `serverInfo.name` = `minecraft-mcp-http`，`version` = `1.0.0` —— `HTTPMCPServer.java:322-325`
- 工具结果信封 = `{"isError":bool,"content":[{"type":"text","text":...}]}`（或 image 块）—— `src/main/java/org/wallet/rogalik/mcp/server/MCPProtocol.java:15-27`、`:47-60`
- `tools/list` 保序（`LinkedHashMap`）—— `.../server/tools/ToolRegistry.java:23`、`:50-60`
- 未知工具名 / 工具抛异常都被转成 MCP 错误响应，不外泄到 HTTP 层 —— `ToolRegistry.java:66-80`

> **命名一致性缺陷**：`README.md:140` 写 "Plus `get_player_info` and `get_blocks_in_area`"，`TOOLS.md:3` 写 "26 tools"。源码实测客户端 26 / 服务端 14，与文档一致。但 `FakePlayersTool.java:48` 的 description 让模型去用 `click_dialog_button`，`OpenScreenTool.java:74` 让模型去用 `set_option` —— **这两个工具名在整个仓库里都不存在**（见 §8.3）。

---

## 3. 四条卖点的实现机制

### 3.1 real command results —— 用 `CommandSourceStack.withCallback` + `Commands.validateParseResults`

**机制（三段式：先 parse、再 execute、用 callback 收成功位与返回值）**

核心类 `CommandRunner`（`src/main/java/org/wallet/rogalik/mcp/server/exec/CommandRunner.java`）：

1. 先解析、单独校验语法，拿到**光标位置**：
   - `CommandRunner.java:142-143` —— `server.getCommands().getDispatcher().parse(command, source)`
   - `CommandRunner.java:145-150` —— `Commands.validateParseResults(parse)` 抛 `CommandSyntaxException` 时返回 `CommandOutcome.parseError(originalCommand, e.getRawMessage().getString(), e.getCursor(), ...)`
2. 真正执行，用 callback 捕获「成功标志 + 返回值」：
   - `CommandRunner.java:152-153` —— `server.getCommands().performCommand(parse, command)`
   - `CommandRunner.java:217-220` ——
     ```java
     return source.withCallback((commandSucceeded, returnValue) -> {
         success.set(commandSucceeded);
         result.set(returnValue);
     });
     ```
3. 反馈消息**不是**从聊天里嗅探，而是换掉 `CommandSource` 把 `sendSystemMessage` 收进 list：
   - `CommandRunner.java:210` —— `CommandSourceStack source = base.withSource(new CapturingSource(messages));`
   - `CommandRunner.java:235-256` —— `private record CapturingSource(List<String> messages) implements CommandSource`，`sendSystemMessage(Component)` → `messages.add(message.getString())`，`acceptsSuccess()/acceptsFailure()` 都返回 `true`，`shouldInformAdmins()` 返回 `false`（**不打扰管理员**）

**四种可区分的结果**（`CommandOutcome`，`src/main/java/org/wallet/rogalik/mcp/server/exec/CommandOutcome.java`）：

- `CommandOutcome.java:28-42` —— `enum ErrorType { PARSE, RUNTIME, SAFETY, SKIPPED, REMOTE }`，注释逐条说明语义
- `CommandOutcome.java:44-73` —— 六个工厂方法：`succeeded` / `ranWithoutSuccess` / `parseError` / `runtimeError` / `rejectedBySafety` / `skipped` / `sentToRemote`
- `CommandRunner.java:163-165` —— 执行完但 `success.get()==false` ⇒ `ranWithoutSuccess`（即「解析通过、跑完、什么都没做」）
- 对外 JSON 字段：`CommandOutcome.java:116-148` —— `index` / `command` / `success` / `result` / `error` / `errorType`（小写枚举名）/ `cursor` / `messages` / `chatMessages`（同一份数组的 `deepCopy()`，兼容老客户端）/ `executionTimeMs` / `status` / `accepted` / `applied` / `summary`
- 老字段是从新数据**派生**的，不是另一套猜测：`CommandOutcome.java:79-90` —— `legacyStatus()`；`:93-97` `accepted()`；`:99-114` `summary()`

**「谁的坐标 / 谁的权限」被显式回执**：

- `CommandRunner.java:100-116` —— `describeSource(...)` 产出 `executedAs`，三种文案：指名玩家 / 「唯一在线玩家」/ 「server console at the world origin - relative coordinates are NOT the player's position」
- `CommandRunner.java:200-208` —— 无 `run_as` 时，若**恰好一个玩家在线**则以该玩家为源并 `withPermission(LevelBasedPermissionSet.OWNER)`；否则用 `server.createCommandSourceStack()`
- `CommandRunner.java:212-215` —— `run_as.permission_level` 生效方式：
  `source.withPermission(LevelBasedPermissionSet.forLevel(PermissionLevel.byId(runAs.permissionLevel())))`
  （注释 `:179-185` 说明理由：`execute as <player>` 只换 `@s`，**不换权限**，所以只有这里能模拟普通玩家被拒的真实结果）
- `CommandRunner.java:229-232` —— `solePlayer()`：多于一个玩家时**不猜**，返回 null

**单机 vs 多人（客户端侧的关键分流）**：

- `src/client/java/org/wallet/rogalik/mcp/command/ClientCommandExecutor.java:46-48` —— 有 integrated server ⇒ 直接委托 `CommandRunner`（拿到真结果）
- `:50-54` —— 没有连接 ⇒ 报错「Not connected to a world」
- `:57-110` —— 连的是**别人的服务器** ⇒ 只能发包，结果不可观测：`CommandOutcome.sentToRemote`（`CommandOutcome.java:68-73`，`ErrorType.REMOTE` 是**唯一**仍报 `status:"unknown"` 的情形，见 `CommandOutcome.java:37-41`、`:88`）
- 远端路径仍尽力收聊天反馈：`ClientCommandExecutor.java:117-125` `client.getConnection().sendCommand(command)`，`:128` 固定等 `REMOTE_FEEDBACK_WINDOW_MS = 500L`（`:30`）
- 该路径的聊天采集靠 Mixin：`src/client/java/org/wallet/rogalik/mcp/mixin/client/ChatMessageCaptureMixin.java:17-23` 注入 `ChatComponent.addMessage(Lnet/minecraft/network/chat/Component;Lnet/minecraft/network/chat/MessageSignature;Lnet/minecraft/client/multiplayer/chat/GuiMessageSource;Lnet/minecraft/client/multiplayer/chat/GuiMessageTag;)V` 的 HEAD，并把消息分三类（`SYSTEM` / `PLAYER_CHAT` / `UNKNOWN`，`:25-39`）

**超时与阻塞**：

- `CommandRunner.java:166` —— `server.submit(...).get(config.getServer().getRequestTimeoutMs(), TimeUnit.MILLISECONDS)`（默认 30000，`MCPConfig.java:112`）
- 中断/异常都变成 `runtimeError` 而不是 500：`CommandRunner.java:168-176`
- `wait_ticks` 在每条命令后阻塞等待：`CommandRunner.java:90-92` + `ServerTicks.await`

**批量语义**：`validate_safety` 命中即中断，并把**后续命令全部标 `SKIPPED`**（`CommandRunner.java:77-85` + `:258-262`）；响应汇总字段见 `:264-302`（`totalCommands`/`succeededCount`/`failedCount`/`acceptedCount`/`appliedCount`/`results`/`chatMessages`/`hint`）。

> **与上游旧方案的差别（值得单独记一笔）**：仓库里仍留着旧计划书 `docs/execute-commands-response-improvement-plan.md`，它提出的路线是「命令级消息窗口 + 字符串规则判 `applied`」（`:82-94` 给出 `cannot/failed/successfully/teleported` 之类关键词表）。**上线代码没有走这条路**：源码里既没有 `CommandOutcomeAnalyzer`，也没有关键词表，改用 callback + 语法校验（本 § 上文）。这是「从猜文本升级为读真实返回值」的一次实质重构。

### 3.2 live logs —— Log4j 自挂 appender + 有界环形缓冲 + 游标读 + 阻塞等待

**采集**：

- 自定义 Log4j appender：`src/main/java/org/wallet/rogalik/mcp/logs/McpLogAppender.java:23` —— `public class McpLogAppender extends AbstractAppender`
- **程序化挂载，不走 log4j2.xml**，理由写在 javadoc：`McpLogAppender.java:16-22` —— "Minecraft supplies its own Log4j configuration at startup, and the copy bundled in this mod's resources disables the root logger outright, so a file-based appender definition would never take effect."
  （对应事实：`src/main/resources/log4j2.xml:8` 确实写着 `<Root level="OFF">`，`:3-4` 只有一个 `NullAppender`）
- 挂到 root logger：`McpLogAppender.java:61-65` —— `configuration.addAppender(appender)` + `configuration.getRootLogger().addAppender(appender, null, null)` + `context.updateLoggers()`
- 防递归：`McpLogAppender.java:31` —— `private static final ThreadLocal<Boolean> REENTRANT`；`:94-96` 命中即返回
- 采集失败绝不反噬游戏日志：`:103-116` 的 `catch (Throwable ignored)`；挂载失败也只 warn（`:69-72`）
- 等级门槛在 appender 里就过滤：`McpLogAppender.java:98-101`（`minLevel` 来自 `logs.minLevel`，默认 `"INFO"`，`MCPConfig.java:176`）
- 异常栈整体存进同一条：`McpLogAppender.java:119-126` `stackTraceOf(Throwable)`
- 安装入口：客户端 `MCPServerModClient.java:28`（注释 `:27` "Attach before anything else so the buffer catches startup errors too."）、服务端 `MCPServerModServer.java:22`

**chat 也进同一个尾缓冲**（因为聊天不落日志文件）：

- `src/main/java/org/wallet/rogalik/mcp/logs/McpLogs.java:57-64` —— `recordChat(String)` 以 `LogSource.CHAT`、`LogLevel.INFO` 追加；javadoc `:51-56` 解释理由
- 调用点是聊天 Mixin（见 §3.1）：`ChatMessageCapture.java:29` —— `McpLogs.recordChat(message)`，注释 `:26-28` 说明「队列是命令窗口、缓冲是永久可搜尾巴，两者必须独立」

**缓冲结构**：

- 有界环形缓冲 = `ArrayDeque` + 容量上限 + 单调递增 id + 淘汰计数：`src/main/java/org/wallet/rogalik/mcp/logs/LogRingBuffer.java:26-30`（`entries`/`nextId = 1`/`droppedTotal = 0`）、`:52-56`（满了 `removeFirst()` 并 `droppedTotal++`）
- 容量来自 `logs.bufferSize`（默认 5000）：`McpLogs.java:35`；默认值 `MCPConfig.java:172`
- 条目模型：`src/main/java/org/wallet/rogalik/mcp/logs/LogEntry.java:9-18`（`id/timestampMs/level/logger/thread/source/message/throwable`）；`LogSource` 只有 `GAME`/`CHAT`（`:36-41`）；自建 `LogLevel` 枚举刻意与 Log4j 解耦（`:43-48` 注释、`:49-69`）

**按请求返回（过滤 + 分页 + 缺口披露）**：

- 查询模型：`LogRingBuffer.java:172-204` —— `record Query(sinceId, minLevel, loggerPattern, messagePattern, sources, limit)`，`matches()` 同时匹配 message 与 throwable（`:201-202`）
- `query()`：`LogRingBuffer.java:90-119`；`tail` 语义 = 取**匹配集中最新 N 条**（`:111-115`）；返回 `Result(entries, nextId, missed, droppedTotal)`（`:117`、`:206-207`）
- `missed` 的计算方式（关键：把「落后」显式化）：`LogRingBuffer.java:95-100`
- 参数解析与钳制统一在 `LogQueryParser`：`src/main/java/org/wallet/rogalik/mcp/logs/LogQueryParser.java:27-48`（`limit`/`tail` 都钳到 1–2000，`:39-45`）；非法正则与非法 source 都抛 `InvalidQueryException`（`:21-25`、`:62-64`、`:78-81`），工具侧转成 MCP 错误（`GetLogsTool.java:56-61`）
- 正则一律 `Pattern.CASE_INSENSITIVE`（`LogQueryParser.java:77`）

**`get_logs` 返回**：`GetLogsTool.java:70-80` —— `entries`/`count`/`nextId`/`missed`/`droppedTotal`/`bufferedEntries`，且 `missed>0` 时附 warning 文案。

**`wait_for_log`（阻塞等待，真·live 那一半）**：

- `LogRingBuffer.java:129-149` —— `awaitMatch(Query, timeoutMs)`：先扫已缓冲（`entry.id() >= cursor && query.matches(entry)`），再 `lock.wait(remaining)`；`append()` 里 `lock.notifyAll()`（`:58-59`）唤醒
- 超时钳制独立于普通请求超时：`WaitForLogTool.java:73-74` —— `Math.clamp(requested, 100L, config.getLogs().getMaxWaitMs())`（默认 60000，`MCPConfig.java:174` 注释写明「independent of requestTimeoutMs」）
- 命中后附上下文：`WaitForLogTool.java:100-104` + `LogRingBuffer.java:151-169` `contextAround(id, 5, 3)`（`WaitForLogTool.java:14-15` 常量）

**另有磁盘面兜底**：`get_crash_reports` 读 `crash-reports/` 最新 N 个（`GetCrashReportsTool.java:52-65`）并可选 tail `logs/latest.log`（`:103-114`），内容截断 20000 字符（`:20`、`:116-122`）。工具 description 说明分工：进程还活着用 `get_logs`/`wait_for_log`，进程死了才用这个（`GetCrashReportsTool.java:29-32`）。

### 3.3 client control —— 走真实 GLFW 回调入口 + 客户端线程调度；仅客户端可用

**能控制什么**：键盘（含修饰键、按住 N tick）、字符输入、按键绑定（按 id）、鼠标（移动/点击/滚动/拖拽，GUI 与 window 两套坐标）、屏幕（开/读/点）、设置读写、资源重载、重进世界。清单与参数见 §2.1 的 16–26 号。

**机制一：复用窗口回调的私有入口，而不是直接改状态**

- 混入访问器暴露私有方法：`src/client/java/org/wallet/rogalik/mcp/mixin/client/KeyboardHandlerAccessor.java:16-23` —— `@Mixin(KeyboardHandler.class)` + `@Invoker("keyPress")` / `@Invoker("charTyped")`；`MouseHandlerAccessor.java:14-24` —— `@Invoker("onButton")` / `@Invoker("onMove")` / `@Invoker("onScroll")`
- 理由写在 javadoc：`KeyboardHandlerAccessor.java:9-15` —— 直接设 `KeyMapping` 状态「would only work in the world and would be invisible to menus」；`MouseHandlerAccessor.java:8-13` 同义
- 分发器统一入口：`src/client/java/org/wallet/rogalik/mcp/input/InputDispatcher.java:50-53`（`mcp$keyPress(windowHandle(), action, event)`，且必须传真 window handle）、`:112-128`（鼠标三件）
- 键盘事件是 record：`InputDispatcher.java:51` `new KeyEvent(key, scancodeOf(key), modifiers)`；字符事件 `:98` `new CharacterEvent(codePoint)`；鼠标 `:117` `new MouseButtonInfo(button, modifiers)`（与 `ARCHITECTURE.md:54-55` 记录一致）
- `typeText` 走 `charTyped` 而非 key event，理由见 `InputDispatcher.java:88-93` —— "Key events alone never produce characters"
- 修饰键既进事件掩码、也真按下去：`InputDispatcher.java:63-74`（注释 `:66-68`：屏幕读掩码，世界里的 keybinding 看物理键是否按下）
- GUI↔window 坐标换算：`InputDispatcher.java:136-150`（乘除 `getGuiScale()`）

**机制二：客户端线程 + tick 调度；阻塞只发生在 HTTP 线程**

- `InputDispatcher.java:34-46` —— `onClientThread(Runnable)` 用 `minecraft.execute(...)` 排队并返回 `CompletableFuture`
- `src/client/java/org/wallet/rogalik/mcp/utils/ClientTickScheduler.java:44-55` —— `runAfterTicks(ticks, runnable)` / `waitTicks(ticks)`；`:68-96` `onEndTick` 收集到期任务、**锁外执行**（注释 `:64-66`）
- 驱动点：`MCPServerModClient.java:33-36` —— `ClientTickEvents.END_CLIENT_TICK.register(client -> { ClientTickScheduler.onEndTick(client); PauseGuard.apply(client, config); })`
- 铁律写在 `ARCHITECTURE.md:108-111`：客户端相关一律经 `InputDispatcher.onClientThread` 或 `ClientTickScheduler`；**绝不在客户端线程上等 future**，HTTP handler 有自己的 executor，要阻塞就在那边阻塞
- 代码层面的兑现：各工具的等待都用 `future.get(config.getServer().getRequestTimeoutMs(), MILLISECONDS)`，例如 `PressKeyTool.java:166-168`、`MouseTool.java:170-173`、`ClickWidgetTool.java:134-143`

**具体能力边界**

- `press_key`：`tap`/`press`/`release`；`hold_ticks` 用 `ClientTickScheduler` 定时释放并**等释放完成**再回执（`PressKeyTool.java:151-164`）；`repeat` 钳到 1–100（`:89`）；`hold_ticks` 钳到 `input.maxHoldTicks`（`:86-88`，默认 200，`MCPConfig.java:155`）
- `send_keybind`：按 id 查 `KeyMapping`，自动区分 MOUSE/KEYBOARD（`SendKeybindTool.java:86-92`）；未绑定直接报错并提示去控制菜单绑（`:68-73`）；`KeybindLookup.byName` 同时接受 `key.inventory` 与 `inventory`（`KeybindLookup.java:25-42`）
- `mouse`：默认 GUI 坐标，`coord_space:"window"` 切原始像素（`MouseTool.java:83-84`、`:153-160`）；回执同时给 `windowX/windowY/guiX/guiY/guiScale`（`:148`、`:162-168`）
- `get_open_screen`：扁平化整棵 widget 树，报 type/text/rect/active/visible/focused/hovered/clickable，**且列表行从父列表借几何**（`src/client/java/org/wallet/rogalik/mcp/ui/ScreenInspector.java:103-157` 的 `RowGeometry`，注释 `:105-108`）；深度上限 12 防环（`:31-32`）；文本读取包了异常（`:211-218`）
- `click_widget`：先精确匹配、再唯一子串；**多义时点空并回候选**（`ScreenInspector.java:227-253`、`ClickWidgetTool.java:89-97`）；点的是控件中心（`ClickWidgetTool.java:127-137`）；点完报 `screenBefore/screenAfter/screenChanged`，屏幕没变则回附当前 widget 列表（`:155-167`）
- `open_screen`：内置 11 个命名屏幕工厂（`OpenScreenTool.java:35-49`：title / pause / options / options.video / options.sound / options.accessibility / options.keybinds / world_select / multiplayer / inventory），另有 `close`（`:101`）
- `options`：无参数列全部设置，带 `name`+`value` 则改一项并 `client.options.save()`（`OptionsTool.java:59-62`、`:117-120`）；改设置需要 `input.enabled`（`:93-96`）
- `reload_resources`：走 `Minecraft.getInstance().reloadResourcePacks()`，默认给 120s（`ReloadResourcesTool.java:16-17`、`:57`、`:66`）
- `rejoin_world`：单机专用；先 `disconnectWithSavingScreen()`，等 integrated server 消失，再用 `createWorldOpenFlows().openWorld(levelId, ...)` 重开（`RejoinWorldTool.java:54-95`）；`levelId` 来自 accessor（`:62` + `MinecraftServerAccessor.java:17-18`）
- **防暂停副作用**：启动时把 `pauseOnLostFocus` 关掉，否则切窗口后暂停菜单会盖住一切截图与屏幕读取 —— `src/client/java/org/wallet/rogalik/mcp/utils/PauseGuard.java:31-47`（`:44` `client.options.pauseOnLostFocus = false;`），配置开关 `input.preventPauseOnLostFocus`（`MCPConfig.java:156-161`）

**单机 / 多人 / 服务端**

- 客户端控制**只在物理客户端存在**（整包 11 个工具在服务端不注册，见 §2.2）
- 单机下命令走 integrated server（§3.1）；连别人服务器时客户端控制仍可用，但命令结果不可观测
- 服务端侧另有 `ServerScreenshotUtils`，但它**从未被注册**（见 §8.1）

### 3.4 fake players —— 真 `ServerPlayer` + 丢弃式 Netty 连接；Carpet 之外的一条路

**怎么造的**（`src/main/java/org/wallet/rogalik/mcp/server/fakeplayer/`）：

- `FakePlayer.java:29` —— `public final class FakePlayer extends ServerPlayer`；构造 `:31-33` 调 `super(server, level, profile, ClientInformation.createDefault())`
- **UUID 由名字派生**（离线 UUID），理由是分数/统计能跨 despawn-respawn 存活：`FakePlayer.java:51-54` —— `new GameProfile(UUIDUtil.createOfflinePlayerUUID(name), name)`
- **走正常入服路径**：`FakePlayer.java:61-63` —— `server.getPlayerList().placeNewPlayer(connection, player, CommonListenerCookie.createInitial(profile, false))`；之后 `:65` `player.setGameMode(gameMode)`
- **网络是唯一假装的部分**：`FakePlayer.java:69-94` —— `discardingConnection()` 用 `new net.minecraft.network.Connection(PacketFlow.SERVERBOUND)` + 匿名 `ChannelOutboundHandlerAdapter`（`write` 里 `ReferenceCountUtil.release(message); promise.setSuccess();`），塞进 `new EmbeddedChannel(discard, connection)`。注释 `:70-73` 解释「用真 channel 而不是打桩 Connection，是为了让 vanilla 发送路径原样跑完」；`:88-91` 解释 handler 必须比 connection 更靠 head 才能吞掉出站包
- 类名冲突被显式限定：`FakePlayer.java:59-61` 注释 —— `ServerPlayer` 会把 `WaypointTransmitter.Connection` 拉进作用域，遮蔽网络 `Connection`（与 `ARCHITECTURE.md:56-57` 一致）

**身份登记（为什么不按类型判断）**：

- `FakePlayerRegistry.java:9-15` javadoc —— 重生会换成新的 `ServerPlayer`，类检查会失效，所以按 **UUID** 记；`:18` `ConcurrentHashMap.newKeySet()`；`:31-33` `isFake(player)` = `player instanceof FakePlayer || FAKE_IDS.contains(player.getUUID())`

**能做什么**（自述 + 源码支撑）：

- `FakePlayersTool.java:38-49` 的 description 逐条列：`@a`/`@p` 能选中、计分板计它、`/trigger` 有效、会受伤/死亡/重生/换维度；`despawn` 走真实离线路径
- 传送到指定维度/坐标/朝向/游戏模式：`FakePlayerManager.java:86-101`（`server.submit(...)` 后在服务端线程造）、`FakePlayersTool.java:145-173`
- 默认落点 = 「唯一真实玩家身边」，否则世界出生点，再退到 `(0.5, 64, 0.5)`：`FakePlayerManager.java:71-84`
- 维度解析接受 `the_nether` 或 `minecraft:the_nether`：`FakePlayerManager.java:45-58`
- 名字校验：非空、≤16、`[A-Za-z0-9_]+`：`FakePlayerManager.java:21-33`
- 数量上限 `fakePlayers.maxCount`（默认 8）：`FakePlayersTool.java:138-143`、`MCPConfig.java:209`
- **死后自动重生**（假玩家没有客户端点 Respawn）：`FakePlayerRespawner.java:11-17` javadoc、`:22-23` `RESPAWN_DELAY_TICKS = 20`（先让死亡逻辑跑完）、`:36` 每 10 tick 扫一次、`:50-53` `getPlayerList().respawn(player, false, Entity.RemovalReason.KILLED)` 后**重新登记 UUID**；驱动点 `MCPServerMod.java:27` —— `ServerTickEvents.END_SERVER_TICK.register(FakePlayerRespawner::tick)`
- `despawn` 走 `PlayerList.remove`（会触发真实离开事件）：`FakePlayerManager.java:103-120`（注释 `:104-108` 说明这是测宽限期/退赛规则的唯一办法）

**不能做什么**（自述，逐字）：

- `FakePlayersTool.java:47-48` —— "What they cannot do: press buttons in a dialog, because that needs a client."
- `TOOLS.md:101` —— "**What they cannot do:** press a dialog button. That needs a client."
- `TOOLS.md:161-166` —— 未实现清单：fake player movement（"Baritone does not fit — it drives the *local* player through a client input controller, and a fake player has no client"）、`profile_ticks`、rich `get_player_info`
- `ARCHITECTURE.md:120-121` 的纪律 —— 游戏逻辑里**不许**加「这是假玩家就跳过」的判断，只有 list 工具能区分

**与 Carpet 风格的关系**：源码里**没有**任何 Carpet 依赖或引用（`gradle.properties` 依赖只有 fabric-loader / fabric-api / junit；`build.gradle:39-50`）。⇒ 这是**独立自研**的一条路（真 `ServerPlayer` + EmbeddedChannel），不是 Carpet 的 `EntityPlayerMPFake`。是否与 Carpet 实现同构 —— **未核实**（未读 Carpet 源码）。

---

## 4. 通信与线程模型

| 问题 | 事实 | 证据 |
| --- | --- | --- |
| MCP server 跑在哪个线程 | JDK `HttpServer` + **无界缓存线程池** `Executors.newCachedThreadPool()`，每个请求一个线程 | `HTTPMCPServer.java:68-69` |
| 有无请求队列 | **没有显式队列/背压**；`create(address, 0)` 的 backlog 参数是 0（走系统默认），并发由线程池兜 | `HTTPMCPServer.java:65`、`:68` |
| 游戏主线程怎么被驱动 | 服务端侧 `MinecraftServer.submit(...)`（返回 future，在 server thread 执行）；客户端侧 `Minecraft.execute(...)`（`InputDispatcher.onClientThread`）+ `ClientTickEvents.END_CLIENT_TICK` 驱动的 `ClientTickScheduler` | `CommandRunner.java:129`、`ValidateCommandTool.java:70`、`InputDispatcher.java:37`、`MCPServerModClient.java:33-36` |
| 阻塞与超时 | **在 HTTP 线程上阻塞**：`future.get(requestTimeoutMs)`。`requestTimeoutMs` 不是 HTTP 层超时，而是「等游戏线程完成」的预算（默认 30000） | `CommandRunner.java:166`、`FakePlayerManager.java:96-98`、`TakeScreenshotTool.java:76-86`、`MCPConfig.java:112` |
| tick 等待 | `ServerTicks.await` 轮询 `server.getTickCount()`，每 5ms 一次，带 deadline | `ServerTicks.java:16`、`:30-47` |
| `advance_ticks` 上限 | `MAX_TICKS = 12000`，入参 `Math.clamp`；未达标会附 warning（`/tick freeze` 或卡顿） | `AdvanceTicksTool.java:14`、`:58-71` |
| 单次 tick 内读写不可见 | 明确承认并用 `wait_ticks`/`advance_ticks` 解决 | `ServerTicks.java:9-12`、`AdvanceTicksTool.java:31-36` |
| 死锁规避 | `validate_command` 在服务端线程上取补全时用 `future.getNow(null)`（**不阻塞**），注释明说否则会把服务端线程锁死 | `ValidateCommandTool.java:106-111` |
| 流式 HTTP / SSE | **未实现**：`GET` + `Accept: text/event-stream` 直接 405 | `HTTPMCPServer.java:173-180` |
| session id | **未实现**：全仓 `Mcp-Session-Id` 0 命中 | grep 结果（0 命中） |
| 长任务超时 | 部分工具自带更长默认：`reload_resources`/`rejoin_world` 各 120000ms | `ReloadResourcesTool.java:17`、`RejoinWorldTool.java:19` |

---

## 5. 安全与人在环

**有**（逐条给证据）：

1. **绑定与鉴权**：非 loopback 且没配 token 时**拒绝启动**（错误文案把风险写明：可跑命令、注入输入、写文件）—— `HTTPMCPServer.java:52-59`；`Authorization: Bearer <token>` 校验用**常量时间比较** —— `:214-223`、`:263-272`
2. **Origin 白名单**：只放行 localhost/127.0.0.1 的 http/https、`null`、`file://` —— `HTTPMCPServer.java:225-232`、`:120-124`
3. **命令白名单 + 危险模式**：默认只允许 14 条命令（`fill clone setblock summon tp give gamemode effect enchant weather time say tell title`）—— `MCPConfig.java:18-21`；白名单外直接拒 —— `SafetyValidator.java:41-43`；`kill @a|@e` 正则拒 —— `:14`、`:45-47`；`gamemode creative @a` 拒（可配置）—— `:15`、`:49-52`；`Count:N` 超限拒 —— `:16`、`:54-61`；`fill` 体积超限拒 —— `:17`、`:63-83`。总开关 `server.enableSafety`（默认 true）—— `:24-26`
4. **权限级模拟**：`run_as.permission_level`（0–4，钳制）—— `CommandRunner.java:212-215`、`:337-339`
5. **UI 破坏性操作二次门**：标签命中 delete/erase/wipe/reset world/… **以及俄语** `удал`/`сброс`/`стереть`（用 `UNICODE_CASE`）—— `src/client/java/org/wallet/rogalik/mcp/ui/DestructiveActions.java:17-30`；拒绝条件是「配置允许 **且** 调用方传 `allow_destructive`」**两者同时成立** —— `ClickWidgetTool.java:112-119`；配置默认 `input.allowDestructiveUi = false` —— `MCPConfig.java:152-153`
6. **文件沙箱**：先 `normalize()` 再比前缀（挡 `..`），再 `toRealPath()` 复查（挡 symlink），再检查首段是否在 allowlist —— `GameFileAccess.java:78-104`、`:109-117`；绝对路径直接拒 —— `:73-76`；根目录本身不可写 —— `:111-114`；大小上限 `files.maxFileSizeBytes`（默认 2MiB）—— `:124-130`；`delete` 默认关且**拒删目录** —— `FilesTool.java:168-176`；默认根 `saves config datapacks resourcepacks logs crash-reports` —— `MCPConfig.java:194-196`
7. **假玩家数量上限**：`fakePlayers.maxCount`（默认 8）—— `FakePlayersTool.java:138-143`
8. **扫描面积上限**：`server.maxAreaSize`（默认 10，`GetBlocksInAreaTool.java:76-78`；注意 README 配置示例里也写 10）
9. **日志体截断 + 图片脱敏**：请求/响应体记录前先正则替换掉 base64 图片数据，再按 `logs.maxBodyLogChars`（默认 2000）裁剪 —— `HTTPMCPServer.java:30-34`、`:239-257`；并有单测钉住 —— `HTTPMCPServerTest.java:167-188`

**未见**（明确写「未见」，避免误读成「有」）：

- **未见**任何「工具调用前需人类确认」的交互式确认机制（没有 confirm 参数、没有暂停等待人批准的分支）。与「人在环」最接近的只有 §5.5 的破坏性 UI 二次门与 §5.1 的鉴权，**都不等于人工确认**。
- **未见**只读模式（没有 read-only 全局开关；关掉的粒度是各子系统的 `enabled` 与 `allowDelete`）。
- **未见**工具级权限分级/白名单（任何能连上端点的客户端都能调所有已注册工具）。
- **未见**审计日志（`client.logCommands` 是死配置，见 §8.2）。
- **未见**速率限制。
- **未见** CSRF/OPTIONS 预检处理：`Access-Control-Allow-Methods` 里写了 `OPTIONS`（`HTTPMCPServer.java:198`），但 `handle` 只分支 POST/GET，OPTIONS 落到 405（`:126-132`）。

---

## 6. 工程做法

**仓库级文档分工**（这是最值得学的部分）：

| 文件 | 作用 | 指针 |
| --- | --- | --- |
| `README.md` | 面向使用者：卖点、配置、接线、协议速览 | `README.md:1-275` |
| `ARCHITECTURE.md` | 面向改代码的人/agent：目录职责、加工具的方法、命令执行与线程铁律、**踩坑清单** | `ARCHITECTURE.md:1-133` |
| `TOOLS.md` | 逐工具参考：字段语义、陷阱、示例 | `TOOLS.md:1-168` |
| `TESTING.md` | 单测能测什么 / 不能测什么 / 手工验证步骤 | `TESTING.md:1-40` |
| `docs/*-migration.md` | 逐版本迁移记录 + **验证命令清单** + 未验项 | `docs/minecraft-26.2-migration.md:7-41` |

**几条可复制的约定**：

1. **把「不要猜 API」写成检查动作**：`ARCHITECTURE.md:38-58` 给出 `javap -p -cp <minecraft-merged-official.jar> net.minecraft.client.MouseHandler` 的具体命令，并列出**已经踩过的坑**（`PermissionSet` 而非 int、当前屏幕在 `Minecraft.gui`、`Window.handle()`、输入事件是 record 且 handler 私有、`GameProfile` 是 record 用 `name()`…）。
2. **注释解释 why 而不是 what**：`ARCHITECTURE.md:115` —— "Comments explain *why*, never *what*. If a line needs a comment to say what it does, rewrite it." 源码确实照做（例：`FakePlayer.java:88-91` 解释 handler 顺序、`LogRingBuffer.java:111` 解释 tail 语义、`CommandRunner.java:200-203` 解释为何锚到唯一玩家）。
3. **工具 description 当 prompt 写**：`ARCHITECTURE.md:116-117` —— "Tool descriptions are prompt text … Say what the tool is for and what the traps are, concretely." 实际文本质量很高（例：`ExecuteCommandsTool.java:41-43` 主动说明 `/function` 返回 `success=false` 是 vanilla 行为而非失败；`AdvanceTicksTool.java:31-36` 解释为什么必须等待 tick）。
4. **纯逻辑必配单测**：`ARCHITECTURE.md:118-119` —— "Every new piece of pure logic gets unit tests. Sandbox escapes, cursor arithmetic and name parsing are exactly where bugs hide." 实测 `@Test` 共 **134 个**（与 `ARCHITECTURE.md:17` 的 "134 of them" 一致；逐文件计数：`LogRingBufferTest` 16、`KeyCodesTest` 15、`GameFileAccessTest` 12、`ScreenInspectorMatchTest` 11、`LogQueryParserTest` 10、`HTTPMCPServerTest` 10 …）。
5. **沙箱边界用测试钉死**：`GameFileAccessTest.java:45-111` 覆盖 `..` 逃逸、落在允许根外的回退、绝对路径、根目录本身、symlink 逃逸（symlink 建不出来时**优雅跳过**而不是假装通过 —— `:102-105`）。
6. **不可测的部分坦白承认**：`TESTING.md:16-23` 明列单测**测不到**的四类（GPU/OpenGL 截图、传送、活对象交互、依赖 `FabricLoader` 的文件 IO），`:28-30` 说明 GameTest API 尚未接入 CI。
7. **CI 极简但有效**：`ubuntu-24.04` + JDK 25 + `gradle/actions/wrapper-validation` + `./gradlew build`（含单测）+ 上传 `build/libs/` —— `.github/workflows/build.yml:10-30`
8. **构建/测试命令集中登记**：`ARCHITECTURE.md:15-22`（`build` / `test` / `runClient` / `runServer`）；迁移文档里给一串逐条验证命令并标注哪条真的跑过 —— `docs/minecraft-26.2-migration.md:27-37`
9. **「活体验证」有标准姿势**：`ARCHITECTURE.md:24-36` 给出等日志出现 `HTTP MCP Server started` 再用 `Invoke-RestMethod` 打 `POST /mcp` 的样例，并说明「必须先加载世界」「可以用自己的工具链把菜单开到 `world_select` → `get_open_screen` → `click_widget` 来加载世界」。
10. **平台抽象只留一个接口**：`src/main/java/org/wallet/rogalik/mcp/platform/Platform.java:6-12` javadoc —— 其余代码只经 `Platform` 触达加载器，换加载器只需新写一个实现；实现只有 `FabricPlatform.java:10-35`（`gameDir`/`configDir`/`isClient`/`loadedMods`）。注入点 `MCPServerMod.java:22-24`（`Platform.set(new FabricPlatform())`，注释说明它早于 client/server 初始化器）。

---

## 7. 候选借鉴点清单

证据强度：**强** = 有源码 + 有测试/文档互证；**中** = 有源码、无测试；**弱** = 只有文档自述。

| # | 对方做了什么（指针） | 为什么值得借鉴 | 我们大致缺什么 | 强度 |
| --- | --- | --- | --- | --- |
| 1 | 命令结果三段式：先 `Commands.validateParseResults` 拿 `cursor`，再 `performCommand`，用 `CommandSourceStack.withCallback` 收 `(success, returnValue)`；反馈用自定义 `CommandSource` 收（`CommandRunner.java:142-166`、`:217-220`、`:235-256`） | 把「解析失败 / 跑完没成功 / 真成功」三种结果分开，是 datapack 调试的核心信息；比嗅探聊天文本可靠 | 我们的 `playtest-bridge` 是**命令级**能力（`mcp-server/src/playtest-bridge/index.ts:185`），拿不到 `success`/`result` 语义 | 强 |
| 2 | `executedAs` 显式回执 + 「恰好一个玩家在线才锚定其坐标与权限」+ `run_as.permission_level`（`CommandRunner.java:100-116`、`:200-215`） | 消灭「`~ ~ ~` 到底是谁的坐标」这类静默歧义；权限级模拟能提前发现 OP-only 路径 | 我们的 driver 断言里没有「以谁的身份执行」这一维 | 强 |
| 3 | 有界日志环 + 单调 id + `missed`/`droppedTotal` 显式披露缺口 + `awaitMatch` 阻塞等待（`LogRingBuffer.java:37-62`、`:90-119`、`:129-149`） | 「落后了就明说落后」比静默丢日志强得多；阻塞等待省掉轮询循环 | 我们读证据是读文件三件套（`AGENTS.md:76`），没有「游标 + 缺口披露」这套契约 | 强 |
| 4 | 把游戏日志与**聊天/命令反馈**合进同一条可搜尾巴（`McpLogs.java:51-64` + `ChatMessageCaptureMixin.java:17-23`） | 聊天不落日志文件，但它是 datapack 结果最常出现的地方；分开就搜不到 | 我们 AGENTS 已经写明「判据放接收端」，但没有统一的「日志+聊天同源可搜」载体 | 强 |
| 5 | 假玩家 = 真 `ServerPlayer` + `placeNewPlayer` + `EmbeddedChannel` 丢弃出站包；UUID 名字派生；按 UUID 登记；死后自动重生；`despawn` 走 `PlayerList.remove`（`FakePlayer.java:29-94`、`FakePlayerRegistry.java:18-33`、`FakePlayerRespawner.java:22-53`、`FakePlayerManager.java:103-120`） | 多人规则（计分板、`@a`、退赛事件、宽限期）无法用单个真人客户端覆盖；「不 special-case 假玩家」是让测试有意义的前提 | 我们多客户端要起两个真客户端 + 文件原语会合（`AGENTS.md:80`），成本高且覆盖不到「第三人加入/离开」 | 强 |
| 6 | 客户端输入走**真实 GLFW 回调私有入口**（`@Invoker("keyPress"/"charTyped"/"onButton"/"onMove"/"onScroll")`）而不是直接改状态（`KeyboardHandlerAccessor.java:16-23`、`MouseHandlerAccessor.java:14-24`、`InputDispatcher.java:50-128`） | 同一入口同时覆盖世界、菜单、文本框、keybinding；直接改状态会漏掉菜单 | 我们的 driver 是脚本动词（`move`/`goto`/`break`/`gui`…），菜单/文本框类交互的保真度未核实 | 强 |
| 7 | 用**渲染文本 + 矩形**读菜单，而不是只靠截图；并处理「列表行没有自己的几何」这一坑（`ScreenInspector.java:40-86`、`:103-157`、`GetOpenScreenTool.java:20-29`） | 断言可以打在字符串与坐标上，比图像比对便宜且稳定；还能当场暴露未翻译的 raw key | 我们判绿靠截图 + `[QA]` 段；UI 级断言能力未核实 | 强 |
| 8 | 破坏性 UI 二次门（配置 + 调用方参数**同时**成立才放行），且覆盖俄语标签（`DestructiveActions.java:17-30`、`ClickWidgetTool.java:112-119`） | 「点错菜单按钮不可恢复」，所以宁可不点并回候选；多语言标签是真实存在的漏网 | 我们的驱动动作面没有这类「标签级」拒绝规则 | 强 |
| 9 | 文件沙箱三步：`normalize()` → `toRealPath()` → 首段 allowlist；并有专门测试（`GameFileAccess.java:78-117`、`GameFileAccessTest.java:45-111`） | 顺序错了沙箱就是漏的（先校验字符串再解析是经典错误）；测试覆盖 symlink 逃逸 | 我们有 `src/utils/project-sandbox.ts`（`AGENTS.md:64` 引用），但「先解析再比较」这条纪律值得对齐检查 | 强 |
| 10 | `ARCHITECTURE.md` 里那张「已经坑过我们的 API 事实」清单（`ARCHITECTURE.md:40-58`） | 一个文件替代无数次翻车；对 agent 尤其有效（可直接当规则读） | 我们有大量 `doc/*.md` 平台档，但没有同形态的「本项目踩坑台账」 | 强 |
| 11 | 工具 description 写成 prompt：主动说明反直觉行为（`ExecuteCommandsTool.java:41-47`、`AdvanceTicksTool.java:31-36`） | 模型读 description 决策；把陷阱写进去能显著降低误用 | 我们的工具描述质量参差；缺「反直觉行为」这一节 | 中 |
| 12 | 长任务自带更长默认超时、并把它与「等待游戏线程」的预算分开（`ReloadResourcesTool.java:16-17`、`WaitForLogTool.java:73-74`、`MCPConfig.java:173-174` 注释） | 一个超时值打天下会让重载类操作假失败 | 我们的 playtest 工具超时策略未核实 | 中 |
| 13 | 截图前若移动了玩家，等 **2 个 end-of-tick** 再抓帧（`ScreenshotUtils.java:95-104`） | 「改视角后立刻抓」会抓到旧帧，是截图类验证的经典假阴性 | 我们的截图流程是否等帧未核实 | 中 |
| 14 | `PauseGuard`：启动即关 `pauseOnLostFocus`，并在日志里说明原因与回退开关（`PauseGuard.java:31-47`） | 「切窗口→暂停菜单盖住画面」会让所有截图与屏幕读取同时失真，且症状极难归因 | 我们 AGENTS 的游玩自测未提这一条 | 强 |
| 15 | 请求/响应体入日志前做 base64 脱敏 + 长度截断，并有单测（`HTTPMCPServer.java:30-34`、`:239-257`、`HTTPMCPServerTest.java:167-188`） | 一张截图能把 latest.log 淹没，反而让真错误不可见 | 我们未见同类防护 | 强 |
| 16 | `advance_ticks` 返回 `requestedTicks`/`ticksAdvanced`/`startTick`/`currentTick`，未达标附 warning（`AdvanceTicksTool.java:60-71`） | 「等到了没有」本身是证据；游戏卡住/`/tick freeze` 时不能假装成功 | 我们的 plan 有 `wait` 动词，但没有「实际推进了多少 tick」的回执 | 中 |
| 17 | `reload_datapacks` 把 `/reload` 之后的日志一并回传，并给 `logHasWarnings` 布尔（`ReloadDatapacksTool.java:55-89`） | `/reload` 即使包坏了也返回成功；把「命令成功」与「真的加载成功」分开 | 我们已有「判据放接收端」纪律，但没有「重载后自动带日志回执」的工具形态 | 强 |
| 18 | `get_world_info` 直接报本 build 期望的 `dataPackFormat`/`resourcePackFormat`（取自 `SharedConstants`）（`WorldInfoTool.java:56-63`） | `pack_format` 写错只会得到含糊的 "Error reading pack metadata"，函数静默失效 | 我们有 `validate_datapack_json`，但「当前 build 期望哪个 format」的来源未核实 | 中 |
| 19 | 迁移文档固定模板：build 变化 → 源码变化（含前后对照表）→ **逐条验证命令** → 明确未验项（`docs/minecraft-26.2-migration.md:7-41`） | 「验证到什么程度」写清楚，避免把「编译过」当「功能可用」 | 我们有 `CORPUS_PROVENANCE.md` 与各平台档，但迁移记录模板未统一 | 强 |
| 20 | 用 `ToolRegistry` 注册序决定 `tools/list` 顺序，且「不适用就不注册」（`ToolRegistry.java:23`、`McpTool.java:8-11`、`MCPServerModServer.java:28-29`） | 比 availability flag 更难写错：不存在的工具不可能被调用 | 我们工具面约 89 个，能力开关的分层方式未核实 | 中 |

---

## 8. 反向结论（不值得我们学的部分）

### 8.1 死代码与永不执行的路径

- `src/client/java/org/wallet/rogalik/mcp/MCPServerModClient.java:53-58` 的 `onClientShutdown()` **从未被注册或调用**（全仓仅此一处出现），即客户端侧的 HTTP server 没有显式 stop 路径。
- `src/main/java/org/wallet/rogalik/mcp/platform/Platform.java:22` + `FabricPlatform.java:28-35` 的 `loadedMods()`/`ModInfo` **没有任何消费方**。
- `src/client/java/org/wallet/rogalik/mcp/utils/CommandParser.java:8` 与 `src/main/java/org/wallet/rogalik/mcp/utils/CoordinateUtils.java:5` 两个类**全仓零引用**（上游 fork 的遗留）。
- `src/main/java/org/wallet/rogalik/mcp/logs/McpLogAppender.java:76-90` 的 `uninstall()` **无人调用**。
- `src/main/java/org/wallet/rogalik/mcp/server/tools/ServerScreenshotUtils.java:7-13` 定义了「服务端截图必然失败」的实现，但**从未注册**（服务端注册表里根本没有 `take_screenshot`）。它作为「拒绝语义的落点」是合理的，但实际不可达。
- 两个脚手架混入**仍是空实现却仍被注册**：`src/main/java/org/wallet/rogalik/mcp/mixin/ExampleMixin.java:9-14`（注入 `MinecraftServer.loadLevel` 的 HEAD，方法体只有注释）、`src/client/java/org/wallet/rogalik/mcp/mixin/client/ExampleClientMixin.java:9-14`（注入 `Minecraft.run` 的 HEAD）；两者分别在 `src/main/resources/mcp-rogal.mixins.json:5-7` 与 `src/client/resources/mcp-rogal.client.mixins.json:5-11` 里注册。⇒ 上线包带着两个无功能的注入点。

### 8.2 配置项「写了但不生效」

以下键在 `MCPConfig` 里有字段与 getter，且 `README.md:78-99` 把它们作为可配置项公开，但**源码里除 getter 自身外零引用**：

- `safety.requireOpForAdminCommands`（`MCPConfig.java:141`、`:146`）
- `client.logCommands`（`MCPConfig.java:128`、`:133`）
- `client.showNotifications`（`MCPConfig.java:126`、`:131`）
- `client.logLevel`（`MCPConfig.java:127`、`:132`）

另外 `server.transport` 的注释声称支持 `"stdio"`（`MCPConfig.java:106`），但两个入口都只处理 `"http"`，否则打 warn 并**不启动**（`MCPServerModClient.java:41-46`、`MCPServerModServer.java:51-53`）。⇒ 配置面存在「文档承诺 > 实现」的漂移，这本身是我们要避免的反面教材。

### 8.3 工具 description 引用了不存在的工具名（最危险的一类）

- `src/main/java/org/wallet/rogalik/mcp/server/tools/FakePlayersTool.java:48` —— "Use `click_dialog_button` on the real player for those."，但**全仓没有任何名为 `click_dialog_button` 的工具**（grep 全仓仅 2 处命中：`FakePlayersTool.java:48` 与 `ARCHITECTURE.md:133` 的「known gaps」自认）。
- `src/client/java/org/wallet/rogalik/mcp/ui/OpenScreenTool.java:74` —— "changing a setting is usually better done with `set_option`"，但真正的工具名是 `options`（`OptionsTool.java:28`），`set_option` 全仓仅此 1 处。

⇒ 模型会照着 description 去调一个不存在的工具。**工具描述里出现的每个工具名都必须有一条机器门去核对** —— 这是我们该加的，不是该学的。

### 8.4 文档漂移（同一仓库三种「事实源」）

- `design.md:1-7` 是韩文，且写的是 **Fabric 1.21.4 / Java 21 / Fabric 0.16.14** 的旧设计；`:69-131` 描述的协议面（`server/info`、`/mcp/tools/list` 等）与现行实现不符。
- `docs/execute-commands-response-improvement-plan.md:69`、`:79`、`:121`、`:129` 仍写 `src/client/java/cuspymd/mcp/mod/...` 路径（上游包名），`:87-94` 的「按关键词判定 `applied`」路线已被放弃（见 §3.1 末注）。
- `docs/minecraft-26.2-migration.md:23` 同样写 `src/client/java/cuspymd/mcp/mod/utils/ScreenshotUtils.java`。
- `docs/server_support_notes.md:24` 提的 `getCommandManager().executeWithPrefix(...)` 是 Yarn 时代 API 名，现行代码用的是 `server.getCommands().performCommand(...)`（`CommandRunner.java:153`）。
- 两处 README 与 TOOLS 的工具数一致（26），但 `README.md:138` 的分组表把 `get_player_info`/`get_blocks_in_area` 排除在分组外、`:140` 另起一句补上 —— 属于可读性小瑕。

### 8.5 架构层面我们不该照搬的

- **无界线程池 + 无请求队列**（`HTTPMCPServer.java:68`）：并发请求会各占一个线程并各自 `future.get` 等游戏线程，没有背压；工具本身也没有全局并发闸门。我们的工具面大得多，直接照搬会放大问题。
- **`requestTimeoutMs` 语义含糊**：名字像 HTTP 请求超时，实际是「等游戏线程的预算」，且不是所有工具都遵守（`OptionsTool.java:120`、`ReloadResourcesTool.java:64` 用同一个值，但 `reload_resources` 另有自己的 `timeout_ms`）。我们如果引入同类参数，应当把名字与语义对齐。
- **SSE / session 缺失**（`HTTPMCPServer.java:173-180`，`Mcp-Session-Id` 0 命中）：自称 streamable HTTP，但只实现了单发 POST JSON。对本地自用够，对外部宿主兼容性有风险。
- **聊天消息采集依赖 Mixin 打在客户端 `ChatComponent.addMessage` 上**（`ChatMessageCaptureMixin.java:18`）：签名是整串描述符硬编码，MC 改签名即断；且只覆盖客户端。我们若做同类能力，应优先考虑不依赖 Mixin 的入口。
- **测试面偏纯逻辑**：134 个 `@Test` 全部是 headless 纯逻辑（`TESTING.md:16-23` 自认），**没有** GameTest、没有端到端回放；`ARCHITECTURE.md:26-27` 把「真实验证」交给人工按文档操作。对「mod 是给玩家玩的产品」这个标准，其自动化证据等级明显低于我们仓库要求的 L4/L5（`AGENTS.md` 的游玩测试阶梯）。

---

## 9. 与我们仓库的对照（轻量，只读指针，不臆测）

**能力朝向是反的**：mcp-rogal 把 MCP server **放进游戏进程**，由外部 AI 宿主连进来；我们的 `playtest-bridge` 是 **MCP 工具进程主动去连游戏里的桥**（`mcp-server/src/playtest-bridge/index.ts:185` `callPlaytestBridge`，默认 `127.0.0.1:38081`，`index.ts:39`）。⇒ 它解决「AI 连不上游戏」，我们解决「AI 驱动的自测要有可判读证据」。

| 维度 | mcp-rogal（证据） | 我们（证据） |
| --- | --- | --- |
| 真实命令回执 | 有 `success`/`result`/`errorType`/`cursor`（`CommandRunner.java:142-166`、`CommandOutcome.java:116-148`） | 桥是**命令级**：`BridgeAction = "status" \| "execute" \| "await"`（`mcp-server/src/playtest-bridge/index.ts:16`），`await` 的 6 个 condition 是玩家状态类（`index.ts:255-295`），无 `success`/`result` 语义 |
| 实时日志 | 进程内环 + 游标 + 阻塞等待（`LogRingBuffer.java:90-149`） | 读盘证据三件套 + 三态判读（`mcp-server/src/playtest-evidence/index.ts:17` `EvidenceState = "present" \| "absent" \| "unreadable"`、`:123` `inspectPlaytestEvidence`；纪律见 `AGENTS.md:76`、`AGENTS.md:486-489`） |
| 客户端控制 | 键盘/鼠标/菜单/设置/资源重载/重进世界（§2.1 的 16–26） | plan 动词（`move`/`goto`/`break`/`gui`/`jump`/`look`/`shot`/`scan` 等，见 `AGENTS.md` 游玩自测节），**能力天花板按路线分**（driver=玩家级 / 桥=命令级） |
| 假玩家 | 真 `ServerPlayer`，可被 `@a` 选中、可计分、可退赛（`FakePlayer.java:29-94`） | 多客户端要起多个真实客户端 + `touch`/`waitfile` 会合 + `inspect_playtest_multi` 联合判绿（`AGENTS.md:80`） |
| 证据纪律 | 单次工具调用同步返回，无「每轮三件」概念 | fail-closed 三件 + `exit-code.txt` 仅 0 算过 + 多客户端越根整体拒（`AGENTS.md:76`、`AGENTS.md:488-489`） |
| 人在环 | 只有鉴权 + 破坏性 UI 二次门；**无**调用前确认（§5「未见」） | 强：写盘/Gradle/拷 jar/上传一律先清单后确认；游玩自测按三通道有界放开（`AGENTS.md` 人在环节） |

**最直接的差距**（一句话）：它的强项是**「命令/日志/输入/假玩家」四条真值通道**，我们的强项是**「证据纪律 + 多客户端联合判绿 + 越根即拒」**。二者互补：若把它的 `executedAs` + `success/result/cursor` + 游标日志 + 假玩家接进我们的 bridge/driver 证据链，L4/L5 的判据会从「看到画面」升级到「读到状态与回执」。

---

## 10. 未核实清单（明确列出，禁止外推）

1. **运行时行为**：本次调研**未**运行 `./gradlew build` / `test` / `runClient`，所有结论均来自源码与仓库文档；「134 个测试全绿」未核实（只核实了 `@Test` 计数 = 134）。
2. **`MinecraftServer.submit(...)` 的确切语义与线程保证**：源码按「提交到 server thread 并返回 future」使用（`CommandRunner.java:129`），但该 API 的 javadoc/签名**未核实**（未读 MC 26.2 反编译源）。
3. **`Commands.validateParseResults` 与 `CommandSourceStack.withCallback` 的完整契约**（例如 callback 是否只在 `performCommand` 路径触发）：**未核实**，本文只描述其在本仓库中的用法。
4. **假玩家与 Carpet 的实现是否同构**：**未核实**（未读 Carpet 源码）；可确认的是本仓库**不依赖** Carpet。
5. **`SharedConstants.DATA_PACK_FORMAT_MAJOR` 在 26.2 的具体数值**：源码只透传，**未核实**具体数字。
6. **`EmbeddedChannel(discard, connection)` 这种 handler 顺序在所有平台/Netty 版本下的健壮性**：**未核实**（只读了作者的注释理由 `FakePlayer.java:88-91`）。
7. **README 声称的「works in single-player and on dedicated servers」在 dedicated server 上的实测**：**未核实**（只有 `docs/minecraft-26.2-migration.md:32-35` 记录 `runServer` 到 EULA 提示即停，未见完整启动日志）。
8. **`tools/list` 在真实 MCP 宿主下的兼容性**（协议版本只认 `2025-03-26`、无 `Mcp-Session-Id`）：**未核实**。
9. **`modrinth-meta.md` / `DESCRIPTION.md` / `DESCRIPTION.ru.md`** 的内容未逐字核对（与本文结论无依赖）。
10. **`src/client/java/.../utils/BlockScanner.java`、`ServerBlockScanner.java`、`BlockCompressor.java`、`PlayerInfoProvider.java`、`ServerPlayerInfoProvider.java`、`KeyCodes.java`** 仅做引用级浏览，未逐行核对其压缩算法与键位表（本文未对它们下结论）。
