# 深挖 langyo/minecraft-mod-mcp

> 调研员：peer-a（共享任务 task-1）。唯一写入文件：本文件。
> 所有路径均相对 clone 根目录 `temp/peer-recon/minecraft-mod-mcp`；行号以该 clone 的实际文件为准。

## 0. 调研基线与口径

- 被调研对象：`langyo/minecraft-mod-mcp`，clone 位于 `temp/peer-recon/minecraft-mod-mcp`。
- HEAD：`853c70320f6fb43c25403cb0897a67c2d8657c9d`（2026-11-03，subject：`⬆️ Refresh the 26.1.2 NeoForge pin to 26.1.2.126 and bump the release version to 0.4.23.`），工作树文件数 1275（排除 `.git`）。
- 口径：**结论一律以源码为准**；README/AGENTS.md 只作「文档声称」并单独标注。凡是 clone 内查不到的，写「未核实」，不补名字、不补版本号。
- 本次实际通读/检索的源码面：`packages/minecraft-mod-mcp/src/**`（TypeScript bridge）、`packages/common/src/main/java/**`（Java 共享库）、`packages/mods/<ver>/<loader>/**`（抽样 1.7.2 / 1.20.1 / 1.21.11 / 26.3）、`scripts/**`（Python）、`.github/workflows/**`、`justfile`、`AGENTS.md`、`CONTRIBUTING.md`、`docs/**`。

---

## 1. 它到底是什么形态

### 1.1 结论：**两者都有，且分工明确 —— 游戏内 mod（HTTP）+ 外部 bridge（MCP/stdio）**

- 游戏内 mod 是 **Java**，用 Forge / Fabric / NeoForge 三种 loader 各出一份构件，**自己起一个 HTTP server**，**不实现 MCP 协议**。
  - 入口：`packages/mods/1.21.11/fabric/src/main/java/xyz/langyo/minecraft/mcp/mod/ModDevMcpMod.java:6-26`（`ClientModInitializer` → `new McpHttpServer(handler, port)` → 独立线程 `"MCP-HTTP"` 里 `httpServer.start()`）。
  - HTTP 实现在共享库：`packages/common/src/main/java/xyz/langyo/minecraft/mcp/common/McpHttpServer.java:74-105`（`server.createContext("/api/screenshot"…)` / `"/api/cmd"` / `"/api/events"` / `"/api/calls"` / `"/api/status"` / `"/debug"` / `"/"`）。
  - mod 侧「不认识 MCP」这句是**文档明确写的**：`packages/minecraft-mod-mcp/README.md:38`（"do not point an MCP client at the mod's HTTP port (the mod does not speak MCP)"），以及 `docs/guides/en/AI-TOOLS.md:22`。
- 外部 bridge 是 **TypeScript**（npm 包 `minecraft-mod-mcp`），**只说 MCP over stdio**，把每次工具调用翻译成一个 HTTP 请求打到 mod。
  - `packages/minecraft-mod-mcp/src/mcp/transport.ts:18-21`：`new StdioServerTransport()` + `mcpServer.connect(transport)`。
  - `packages/minecraft-mod-mcp/src/api/modClient.ts:52-74`：`fetch(`${this.baseUrl}${MOD.cmdEndpoint}`, { method: "POST", body: JSON.stringify({ cmd: method, ...params }) })`。
  - 架构图（文档声称，与源码一致）：`README.md:141-153`、`docs/guides/en/AI-TOOLS.md:30-38`。
- 第三种角色：**CLI / 启动器**。同一个 npm 包同时是「MCP server」和「Minecraft 启动器 + 版本/账号/服务器管理器」：
  - `packages/minecraft-mod-mcp/package.json:10`（`bin.minecraft-mod-mcp = dist/cli.js`）、`package.json:4`（description："MCP server bridge & launcher CLI"）。
  - 子命令清单：`packages/minecraft-mod-mcp/src/cli.ts:22-85`（`mcp` / `launch` / `server` / `serve` / `list` / `installed` / `install` / `auth` / `java` / `status` / `test-matrix` / `tui` / `sdk`），分派在 `cli.ts:100-120`。
- 第四种角色：**构建/测试/代码生成的 Python 工具链**（`scripts/**`，见 §4）。

### 1.2 语言 / 框架 / 运行时

| 面 | 语言 | 关键依赖 | 证据 |
| --- | --- | --- | --- |
| 游戏内 mod | Java（`sourceCompatibility = VERSION_1_8`，toolchain 21） | Gson 2.11.0；`org.java-websocket:Java-WebSocket:1.5.4`（**疑似死依赖**，见 §6） | `packages/common/build.gradle.kts:9-21`；`packages/mods/1.21.11/forge/build.gradle:38-41` |
| MCP bridge | TypeScript（ESM） | `@modelcontextprotocol/sdk`、`zod`；构建 `tsup` + `tsc --emitDeclarationOnly`；`engines.node >= 20` | `packages/minecraft-mod-mcp/package.json:22-29,52-58` |
| 跨运行时 | Node / Deno / Bun | 运行时自检 | `packages/minecraft-mod-mcp/src/api/http.ts:15`（`typeof (globalThis as any).Deno`/`Bun`）、`packages/minecraft-mod-mcp/deno.json` 存在 |
| 工具链 | Python 3.11+ | `just`（justfile）、Gradle wrapper（逐模块） | `CONTRIBUTING.md:11-13`、`justfile:1-4`、`.github/workflows/ci.yml:462-464` |

### 1.3 覆盖的 MC 版本与 loader（清单出处）

- **mod 工程目录 = 版本矩阵的物理形态**：`packages/mods/<mc_version>/<loader>/`。
  - 磁盘实测：`packages/mods` 下 **55 个 MC 版本目录**，含 `build.gradle` 的 `<版本>/<loader>` 组合 **103 个**（实测命令：遍历 `packages/mods/*/*/build.gradle`；列表见 `packages/mods`）。
  - loader 取值只有三种，源码枚举为证：`packages/minecraft-mod-mcp/src/mc/versions.ts:7`（`export type Loader = "forge" | "neoforge" | "fabric";`）。
- **机器可读的版本矩阵**有两份、且有生成关系：
  - Python 侧真源：`scripts/version_config.py:117`（`ALL_VERSIONS = {`），loader 推导 `scripts/version_config.py:404-406`（`def get_loaders(mc)`）。
  - TS 侧运行时真源（CLI 不能 import Python，故内嵌 JSON）：`packages/minecraft-mod-mcp/src/mc/versions-embedded.json`，分区 `fg_eras`:2、`versions`:86、`api_groups`:524、`fabric_loom`:580、`neoforge_gradle`:636、`legacy`:641。
  - 生成器：`scripts/gen_embedded_versions.py:1-12`（docstring 说明它是 `version_config.ALL_VERSIONS` → JSON 的再生器）、`:97-125`（`--check` 模式：不同即 exit 1）。
  - 读取顺序（**先 TOML 后内嵌 JSON 回退**）：`packages/minecraft-mod-mcp/src/mc/versionsData.ts:66-79`（找 `packages/launcher/shared/config/versions.toml`，clone 内**该文件不存在**，故实际永远走内嵌 JSON：`versionsData.ts:84-88`）。
- 版本轴的两个特殊点（源码可见）：
  - **1.7.2 / 1.7.10 走 GTNH ForgeGradle 1.2 时代**：`versions-embedded.json:2-12`（`fg12_gtnh`，Gradle 4.4.1，Java 8）。
  - **26.x 是「去混淆 + JDK 25」段**：`versions-embedded.json:576-578`（`26_1_2`/`26_2`/`26_3` → `api_groups.mc26`）、`neoforge_gradle`:636-639（MDG 2.0 → Gradle 9.3.1）、CI 里 26.x 单列 JDK 25 车道 `.github/workflows/ci.yml:170-179`。
  - Fabric 在 26.1.2 缺失：`README.md:53` 该行 Fabric 列写 `—`；磁盘实测 103 个组合里也确实没有 `26.1.2/fabric`。
- 文档声称的版本跨度：`README.md:67`（"Works with Minecraft **1.7.2** through **26.3**"）、`packages/minecraft-mod-mcp/README.md:16`（"1.8.9 through 26.3"——**与根 README 不一致，属文档漂移**，以磁盘 55 版/103 组合为准）。

---

## 2. MCP 工具面完整清单（源码级，逐字）

- 注册方式：**声明式数组 + 循环注册**。
  - 工具定义：`packages/minecraft-mod-mcp/src/mcp/tools.ts:16`（`export const TOOLS: ToolDef[] = [`），类型 `ToolDef` 在 `tools.ts:3-8`（`name` / `description` / `inputSchema` / `requiresControl?`）。
  - 注册循环：`packages/minecraft-mod-mcp/src/mcp/handlers.ts:45-65`（`for (const tool of TOOLS) server.registerTool(tool.name, { description, inputSchema }, async (params) => …)`）。
- **实测总数 = 46**（grep `^    name: "` 命中 46 条；与文档 `docs/guides/en/AI-TOOLS.md:9`（"the 46 tools the bridge exposes"）一致）。
- 返回形状：**恒为单条 text content**，字符串原样、对象 `JSON.stringify(result, null, 2)`，异常转 `{ isError: true, text: "Error: …" }`。
  - `handlers.ts:56`、`handlers.ts:57-62`、`handlers.ts:333-337`（`formatResult`）。
- **未核实**：是否有 MCP resources / prompts 面 —— `transport.ts:7-16` 只 `registerHandlers`，未见 `registerResource`/`registerPrompt`，但 SDK 是否默认注入未核实。

### 2.1 感知类（8）

| 工具名（逐字） | 参数 | 指针 |
| --- | --- | --- |
| `ping` | 无 | `tools.ts:18`；mod 侧返回字面量 `"pong"`：`McpMessageHandler.java:58` |
| `screenshot` | 无 | `tools.ts:23`；走 `GET /api/screenshot`：`modClient.ts:76-89` |
| `screenshot_to_file` | `path?` | `tools.ts:28-33` |
| `get_player_info` | 无 | `tools.ts:35` |
| `get_world_info` | 无 | `tools.ts:40` |
| `debug_fields` | 无 | `tools.ts:45` |
| `get_screen_buttons` | 无 | `tools.ts:50` |
| `enumerate_widgets` | 无 | `tools.ts:55` |

（表内 8 行，其中 `screenshot_to_file` 是文件落盘变体。）

### 2.2 输入类（19；其中 17 个标了 `requiresControl: true`，`overlay_click` 与 `wait` 未标）

| 工具名 | 参数（逐字） | 指针 |
| --- | --- | --- |
| `click` | `x:int`、`y:int`、`button: "left" \| "right" \| "middle"=left` | `tools.ts:99-107`；枚举 `tools.ts:14` |
| `right_click` | 无 | `tools.ts:109` |
| `mouse_drag` | `x_start`、`y_start`、`x_end`、`y_end`、`button` | `tools.ts:115-125`；**参数改名**：`handlers.ts:323-331`（`x_start→x1` …） |
| `scroll` | `clicks:int` | `tools.ts:127` |
| `scroll_at` | `x`、`y`、`clicks` | `tools.ts:135` |
| `press_key` | `key:string`、`hold_seconds=0` | `tools.ts:145-152` |
| `type_text` | `text`、`press_enter=false` | `tools.ts:154` |
| `paste_text` | `text`、`press_enter=false` | `tools.ts:163` |
| `hotkey` | `keys:string`（逗号分隔） | `tools.ts:172-178` |
| `click_button_id` | `id:int` | `tools.ts:180` |
| `click_button_index` | `index:int` | `tools.ts:188` |
| `switch_tab` | `index:int` | `tools.ts:196` |
| `execute_command` | `command:string` | `tools.ts:204-210` |
| `set_view_angle` | `yaw`、`pitch` | `tools.ts:212` |
| `look_delta` | `delta_yaw`、`delta_pitch` | `tools.ts:221` |
| `use_item` | 无 | `tools.ts:230` |
| `place_block` | 无 | `tools.ts:236` |
| `overlay_click` | `x:int`、`y:int` | `tools.ts:242-248`（**未标 requiresControl**） |
| `wait` | `seconds:number>0` | `tools.ts:250-255`（bridge 侧纯 `setTimeout`：`handlers.ts:135-139`，不下发 mod） |

### 2.3 控制类（7；其中 `close_screen` / `open_chat` 标了 `requiresControl: true`）

| 工具名 | 参数 | 指针 |
| --- | --- | --- |
| `enter_control_mode` | 无 | `tools.ts:60` |
| `exit_control_mode` | 无 | `tools.ts:65` |
| `release_mouse` | 无 | `tools.ts:70` |
| `pause_game` | 无 | `tools.ts:75` |
| `close_screen` | 无 | `tools.ts:80` |
| `open_chat` | 无 | `tools.ts:86` |
| `set_gamemode` | `mode: survival \| creative \| adventure \| spectator` | `tools.ts:92-97` |

### 2.4 管理 / 启动器类（12，全部不下发 mod）

白名单在此：`packages/minecraft-mod-mcp/src/mcp/handlers.ts:38-43`（`MANAGEMENT_TOOLS`），未连接 mod 也允许执行（`handlers.ts:52-54`）。

| 工具名 | 参数（摘要） | 指针 |
| --- | --- | --- |
| `launch_minecraft` | `version`、`loader=forge`、`memory`、`min_memory`、`jvm_args`、`game_args`、`fullscreen`、`width`、`height`、`server`、`server_port` | `tools.ts:257-272`；实现 `handlers.ts:204-266` |
| `kill_minecraft` | 无 | `tools.ts:274`；实现 `modClient.ts:99-108`（Windows 走 `taskkill /PID … /T /F`） |
| `get_minecraft_status` | 无 | `tools.ts:279`；实现 `handlers.ts:147-150` |
| `install_version` | `version`、`loader=forge` | `tools.ts:284-290` |
| `list_supported_versions` | 无 | `tools.ts:292` |
| `list_installed_versions` | 无 | `tools.ts:297` |
| `detect_java` | 无 | `tools.ts:302` |
| `create_offline_account` | `username` | `tools.ts:307-312` |
| `list_accounts` | 无 | `tools.ts:314` |
| `install_server` | `version`、`loader`、`server_type`、`port`、`motd`、`max_players`、`gamemode`、`difficulty`、`online_mode`、`level_seed`、`level_name`、`level_type`、`white_list` | `tools.ts:319-336` |
| `launch_server` | 同上子集 + `memory`/`min_memory`/`jvm_args`/`game_args` | `tools.ts:338-354` |
| `serve` | 同上 + `server_memory` | `tools.ts:356-373`；实现 `handlers.ts:390-463`（装服 → 起服 → 等服 → 起客户端自动连） |

### 2.5 **mod 侧命令面 ≠ MCP 工具面**（重要）

mod 的 `dispatch` 接受 37 个 method（`packages/common/src/main/java/xyz/langyo/minecraft/mcp/common/McpMessageHandler.java:53-104`），其中 5 个**没有对应 MCP 工具**，只能由 raw `POST /api/cmd` 触达：

| mod method | 行号 | 说明 |
| --- | --- | --- |
| `press_enter` | `McpMessageHandler.java:70-73` | 内部把 `key` 改写为 `enter` 后转 `press_key` |
| `direct_scroll` | `:77` | 直接给 `(mouseX,mouseY,delta)`，绕过 `scroll` |
| `select_list_item` | `:78` | 列表项选择 |
| `call_screen_method` | `:89` | 反射调用当前 Screen 的任意方法（`method`/`methodName` 参数，`:357-371`） |
| `drag` | `:79` | `mouse_drag` 的别名 |

反向：`wait` / 12 个管理工具**只存在于 bridge**，mod 完全不知道它们。

---

## 3. 架构关键设计（重点）

### 3.1 传输层：MCP/stdio ↔ **HTTP + SSE**（同机两进程，无 RCON、无 socket 长连）

- **上段（AI ↔ bridge）**：stdio，JSON-RPC。`transport.ts:18-21`。
- **下段（bridge ↔ mod）**：**HTTP 请求/响应**，明文、绑定 `127.0.0.1`，无鉴权、无 token。
  - bridge 侧基址：`packages/minecraft-mod-mcp/src/api/modClient.ts:27,36`（`http://${MCP.bindAddress}:${status.port}`），`MCP.bindAddress = "127.0.0.1"`：`src/mc/defaults.ts:62`。
  - mod 侧监听地址是 `0.0.0.0`（`McpHttpServer.java:77,83` 的 `new InetSocketAddress("0.0.0.0", p)`）——**比 bridge 侧假设更宽**，两者不一致（bridge 只连 127.0.0.1，故实际不暴露到外网；但服务本身对所有网卡可达，这是真实的安全面差异）。
- **端口协商：不用配置文件，用「同区间双向扫描」**。
  - 区间常量：bridge `PORT_START=9876` / `PORT_END=9000`（`src/consts.ts:3-4` ← `src/mc/defaults.ts:57-65`）；mod 侧同值（`McpConfig.java:6-7`）。
  - mod 侧：若未配置固定端口，**从 9876 递减** 找第一个能 bind 的端口（`McpHttpServer.java:79-92`）；可用 `-Dmcp.port` 或 `MC_MCP_PORT` 固定（`McpConfig.java:13-23`）。
  - bridge 侧：**从 9876 递减**逐个 `GET /api/status` 探测，命中即锁（`src/discovery/scanner.ts:21-27`，注意循环是 `port--`）。单次探测超时 2000ms（`defaults.ts:60` `heartbeatTimeoutMs`，用在 `scanner.ts:5-6` 的 `AbortController`）。
  - 握手判据不是「端口通」，而是**载荷形状校验**：`isModStatus` 要求 `ok===true && type==="minecraft-mod" && typeof port==="number"`（`src/consts.ts:18-22`，`statusType` 定义在 `src/mc/defaults.ts:158`）。
- **端点表（逐字）**：`src/mc/defaults.ts:154-160` —— `cmdEndpoint: "/api/cmd"`、`screenshotEndpoint: "/api/screenshot"`、`statusEndpoint: "/api/status"`；mod 侧另有 `/api/events`（SSE）、`/api/calls`、`/debug`（`McpHttpServer.java:94-102`）。
- **/api/status 回执形状**：`{"ok":true,"type":"minecraft-mod","version":…,"loader":…,"forgeVersion"?:…,"pid":…,"port":…,"uptime":…}`（`McpHttpServer.java:107-122`）。
- **SSE 事件流**（给调试面板/记录用，**MCP 面完全没用它**）：`McpHttpServer.java:349-383`；上限 4 个客户端（`:352-355`）、历史回放最近 20 条（`:365-374`）、连接最长 300s（`:375-378`）。环形历史容量 200（`:25`、`:137-141`），`GET /api/calls` 只回最近 50（`:385-398`）。消费方是 in-jar 面板：`packages/common/src/main/resources/mcp-debug/index.html:217`（`new EventSource(BASE+'/api/events')`）。
- **遗留的第二条传输线**：`scripts/mc_vtty.py:1-5` 是独立的 Python **WebSocket(9876) + TCP(9877)** 守护进程，docstring 写「MC mod connects to it」。但 mod 侧 Java 里 **grep 不到任何 WebSocket 客户端实现**（`packages/common/src/**` 的 WebSocket 命中只在语言 JSON；`packages/**/*.java` 对 `org.java_websocket|WebSocketClient` 命中 0）。⇒ 该 WS 路线**当前不在主线**（开发侧遗留工具），**未核实**是否还有别的版本在用。

### 3.2 会话 / 状态 / 并发 / 超时

- **没有会话，也没有请求 ID 关联**（这是它最"薄"的一处）：
  - `McpMessageHandler.java:13` 有 `private int reqId = 0;`，但**全文件再无使用**；`sendInit(Object wsClient)`（`:18-19`）与 `sendResponse(String method, Object result, Object wsClient, String requestId)`（`:106-107`）都是**空方法体**。
  - 关联方式 = **HTTP 同步响应**：一次工具调用 = 一次 `POST /api/cmd`，响应体即结果（`McpHttpServer.java:292-317`；bridge `modClient.ts:59-69`）。
- **bridge 侧状态**：只有「当前 mod 端口 + 当前 MC 子进程」两个字段（`modClient.ts:7-9`）；掉线自愈 = 收到 `502/503` 或 `ECONNREFUSED` 时把端口置空（`modClient.ts:66,71` → `disconnect()` `:47-50`），**下一次调用时重新全区间扫描**（`handlers.ts:52-54`）。
- **后台发现协程**：MCP server 起完立刻在后台扫端口，扫不到就每 5s 重扫直到 `discoverTimeoutMs=300000`（`src/server.ts:18-43`；`defaults.ts:61,64`）。
- **并发**：mod 侧线程池固定 8（`McpHttpServer.java:93`）；**没有队列、没有限流、没有按会话隔离**。请求可并发进 8 条线程。
- **超时（三档，都是硬编码）**：
  1. 端口探测 2000ms（`defaults.ts:60`）；
  2. 「把任务丢到渲染线程并等结果」**5s**，模式是 `CountDownLatch.await(5, TimeUnit.SECONDS)`，在 `McpMessageHandler.java` 里重复出现约 15 次（如 `:114-123`、`:314-321`、`:498-505`）；
  3. 截图专用 **15s**（`ReflectedInputHandler.java:297`）。
  - 超时后**不报错**：多数路径把 `result[0]`（初始 `""`）原样返回，即**静默空串**（如 `:123-124`）。这是「超时被读成成功」的隐患。

### 3.3 它怎么拿到游戏内真实数据（回执机制）

- **线程模型是核心**：HTTP 线程**不允许**直接碰游戏状态，必须把 Runnable 丢到 MC 主/渲染线程，再等 `CountDownLatch`。
  - 调度器发现逻辑（多版本兜底）：`ReflectedInputHandler.java:18-61` —— 依次尝试 `execute(Runnable)` → `addScheduledTask(Runnable)` → 名字含 `Schedule`/`schedule` → 含 `Task` → 任意单参 `Runnable` 的 public 方法，全失败才抛异常。
  - 另一条同类实现（含 1.12.2 SRG 名）：`ReflectionHelper.java:16-44`（`execute`/`addScheduledTask`，`latch.await(5, SECONDS)`）。
  - 1.12.2 SRG 名的显式兜底：`ReflectedInputHandler.java:285`（`"func_152344_a"`）、`:324`（`func_152345_ab` = `isSameThread`）。
  - **明确禁止在非渲染线程内联跑截图**（GL 上下文缺失会杀 JVM）：`ReflectedInputHandler.java:301-305`（注释引 issue #45/#41）。
- **数据来源是反射读 MC 对象，不是解析日志**：
  - 玩家状态 JSON 形状：`{"name","health","pos","rotation","dimension","gamemode","food"}`（`PlayerWorldHelper.java:91-92`）；取值靠逐方法/逐字段试探（`getPlayerName` 甚至硬编码 SRG 片段 `"74861"/"5820"/…`：`PlayerWorldHelper.java:104`）。
  - 世界状态：`PlayerWorldHelper.java:287`（`getWorldInfo`）。
  - 调试面板字段：`PlayerWorldHelper.java:610-613`（返回 `{"class":…,"fieldCount":…}` 等）。
  - **没有任何「读游戏日志」的能力**（grep `logs`/`latest.log` 在 mod 侧无实现）——**未核实**是否存在其他日志通道。
- **命令执行是「投递成功」而不是「拿到命令输出」**（关键局限）：
  - `execute_command` → `PlayerWorldHelper.sendCommand`（`:427-608`）。它优先走**集成服务器命令分发器**：`getSingleplayerServer`/`getServer`/`getIntegratedServer`/`func_71401_C`（`:433-453`）→ `getCommands().getDispatcher()` → `dispatcher.parse(...)` → `parseResult.execute()`，成功即返回 `{"sent":true,"method":"dispatcher.execute"}`（`:486-496`）。
  - 失败才逐级降级：`performCommand`/`execute`（`:497-512`）→ `server.executeCommand`（`:513-523`）→ 玩家 `sendChatMessage("/cmd")`（`:529-536`）→ 网络包 `sendPacket`（`:543-596`）→ 兜底 `{"error":"no command method found"}`（`:606`）。
  - ⇒ **返回值恒为「已投递」语义，没有命令 stdout/回显**。要判定命令效果，必须另发 `get_player_info` / `get_world_info` / `screenshot` 去观测。这一点对我们「判据放接收端」的口径是反面教材。
- **点击结果走静态字段**：`click` 不返回自己的结果，而是把渲染线程里的结果写进 `private static String lastClickResult`（`ReflectedInputHandler.java:131,139,147`），再由 `handleClick` 读取（`McpMessageHandler.java:196`）。**静态字段 + 并发 8 线程 = 可能串台**（未做同步）。

### 3.4 构建 / 编译链路：**代跑 Gradle，但不做增量、不解析错误**

- bridge **确实会代跑 `gradlew build`**，仅限 CLI 的 `sdk` 子命令：
  - `cli.ts:555-668`（`runSdk`）：校验版本/loader → 找 `packages/mods/<ver>/<loader>/gradlew`（`:608-613`）→ 确保 JDK（`:632-636`）→ `runGradle(modProjectDir, gradlew, ["build"], javaExe)`（`:647`）→ 失败时把 **stdout/stderr 全文原样打印**并 `exit 1`（`:649-654`）→ 成功时列出 `build/libs/*.jar`（`:656-662`）。
  - `runGradle` 本体：`cli.ts:1172-1207` —— 设 `JAVA_HOME`（`:1180`）、`assertAllowedProgram(gradlewCmd, GRADLEW_ALLOWLIST)`（`:1182`）、Windows 下 `shell: true`（`:1188`）、收 stdout/stderr 到 `{code,stdout,stderr}`（`:1199-1205`）。
  - 增量 = **交给 Gradle 自己**（没有任何 `--offline`/`--build-cache`/`--configuration-cache` 参数注入，未核实是否在 gradle.properties 里）。
  - 「怎么把错误回给模型」= **原始日志文本**，没有结构化/裁剪。且该路径**不是 MCP 工具**，AI 只能通过 CLI 或 `launch_minecraft` 间接触发。
- **MCP 面没有「编译 mod 工程」的工具**：`install_version` 只下 MC + loader（`handlers.ts:268-310`），不建 mod jar。
- **mod jar 的取用顺序**（决定了「AI 改完代码后游戏里跑的是哪份 jar」）：
  1. 本地已构建产物 `packages/mods/<ver>/<loader>/build/libs/*.jar`（排除 `-sources`/`-javadoc`，按文件名长度排序取第一个）：`src/mc/platform.ts:55-69`；
  2. 否则从 GitHub Releases 下预编译 jar 并缓存到 `~/.minecraft/mcp_launcher/modjars/minecraft-mcp-<ver>-<loader>.jar`：`platform.ts:77-104`（含 `assertSafeUrl` 白名单，`urlGuard.ts:19-25`）；
  3. 都拿不到 → `null`，**游戏以原版启动，静默没有 MCP 能力**（`platform.ts:71-76` 注释明说）。
- **注入方式**：把 jar 拷进实例的 `mods/`，**绝不进 classpath**（注释解释 1.17+ 模块化会 `ResolutionException`）：`src/mc/launch.ts:25-30`、`:232-238`。另注入三个 JVM 参数：`-Dmcp.port`、`-Dmcp.mod.version=0.2.1`、`-Dmcp.mod.loader`（`launch.ts:294-299`）。
  - ⚠ 观察到的不一致：`-Dmcp.mod.version` 硬编码 `0.2.1`（`launch.ts:298`，与 `defaults.ts:4` 的 `LAUNCHER.version` 同值），而当前 mod 构件版本是 `0.4.23`（`packages/mods/1.21.11/forge/src/main/resources/META-INF/mods.toml:7`、`packages/common/build.gradle.kts:7`）。而 `/api/status` 的 `version` 优先取该 system property（`McpConfig.java:25-36`）⇒ **桥接自己启动的实例会上报 0.2.1，手动放进 mods/ 的实例会上报 jar manifest 版本**。
- **进程安全护栏**（值得学）：所有 `spawn` 前必须过 basename 白名单 `assertAllowedProgram`：`src/mc/spawnGuard.ts:4-6`（`JAVA_ALLOWLIST`/`GRADLEW_ALLOWLIST`/`SERVER_SCRIPT_ALLOWLIST`）、`:13-18`；调用点 `handlers.ts:252,450`、`http.ts:75`、`cli.ts:1182`。

### 3.5 多版本 / 多 loader 的抽象方式：**Python 代码生成（外壳）+ Java 反射（内核）**

- 设计声明在生成器 docstring 里（**源码级自述**）：
  - `scripts/generate_sources.py:1-18`：「每个 mod 有一个很薄的 `ModDevMcpMod.java` 处理 FML 生命周期与事件注册，然后委派给 `mcp-common` 的 `ReflectedInputHandler`，后者用反射在**运行时**处理所有版本差异」「除右上角 overlay 外，**没有任何 mod 文件直接 import `net.minecraft.*`**」。
  - `scripts/generate_mods.py:1-21`：FG Era 与 Gradle 版本对应表（FG 1.2 GTNH→Gradle 4.4.1；FG 6.x→8.5；FG 7.x→9.3；MDG 1.0→8.10；MDG 2.0→9.3；Loom 0.12→8.10）。
- **目录/包组织**（三层）：
  1. `packages/common/` = **唯一共享 Java 库**（HTTP server、反射、输入注入、截图、控制模式、overlay 逻辑），打包坐标 `xyz.langyo.minecraft.mcp`（`packages/common/build.gradle.kts:6-7`）。
  2. `packages/mods/<mc>/<loader>/` = **逐组合的薄外壳 + 版本专属 mixin/overlay**（例：`packages/mods/1.21.11/fabric/` 有 5 个 mixin + `ModDevMcpMod.java`）。
  3. 各 mod **直接编译 common 源码**而非依赖制品：`packages/mods/1.21.11/forge/build.gradle:35-36`（`sourceSets.main.java.srcDir '../../../common/src/main/java'` + resources 同理）。全树此类 `srcDir` 命中 204 行（≈102 组合 × 2）。
     - ⇒ `packages/common` 的 `publish` 到 `.maven-local`（`build.gradle.kts:23-33`）与 CI 的 upload/restore（`ci.yml:38-59,198-203`）在 clone 内**找不到任何 maven 坐标消费者**（grep 未见 mod 依赖 `xyz.langyo.minecraft.mcp:*`）。**未核实**是否有外部消费者。
- **版本矩阵怎么表达**：单一 TOML 式结构 + 生成。
  - `versions-embedded.json` 的 `versions` 每条含 `forge`/`fg_era`/`java`/`version_id`（可选 `mappings`/`neoforge`/`mdg`/`fabric_yarn`/`fabric_loader`）：形状定义 `src/mc/versions.ts:35-45`，样例 `versions-embedded.json:87-105`。
  - `fg_eras` 用 `min_mc`/`max_mc` 表达「一个 ForgeGradle 世代覆盖哪个版本区间」：`versions-embedded.json:2-57`。
  - `legacy.eras` 标记需要旧式 `settings.gradle` 的世代：`versions-embedded.json:641-650`、判定 `versions.ts:73-75`。
  - `fabric_loom` 按 MC 版本给 Loom 版本、`neoforge_gradle` 按 MDG 前缀给 Gradle 版本：`versions-embedded.json:580,636`；取用 `versions.ts:214-225`。
- **运行时反射的抽象手法**（比代码生成更值得看）：
  - 类/字段/方法缓存：`packages/common/.../ReflectionCache.java:16-28`（`methodCache`/`fieldCache`/`discoveredFields`/`discoveredMethods` 四个 `ConcurrentHashMap`）。
  - LWJGL2/3 分叉：`ReflectionCache.java:30-36`（用 `Class.forName("org.lwjgl.glfw.GLFW")` 判定）。
  - MC 类名分叉：`Minecraft`（Mojmap）vs `MinecraftClient`（Yarn）：`ReflectionCache.java:43-44`。
  - 窗口尺寸字段名穷举（含 SRG）：`ReflectedInputHandler.java:91-99,113-121`。
  - 每版本一个「overlay 适配块」，把该世代的渲染 API（GL11 / MatrixStack / GuiGraphics / DrawContext / 26.x）适配到统一 `McpOverlayLogic`：`generate_sources.py:48-56`、`generate_sources.py:58-93`。
- **人类在环的「控制模式」闸门**（我认为是这个项目最值得学的一条安全设计）：
  - 默认**不允许**任何输入类命令；mod 侧维护 `ALWAYS_ALLOWED` 白名单（`ping`/`screenshot`/`get_player_info`/`get_world_info`/`debug_fields`/`get_screen_buttons`/`enumerate_widgets`/`overlay_click`/`enter_control_mode`/`exit_control_mode`/`set_gamemode`/`release_mouse`/`pause_game`/`close_screen`/`open_chat`）：`McpMessageHandler.java:43-51`。
  - 非白名单命令在未进控制模式时返回 `{"error":"not in control mode","hint":"Enter control mode via ESC > MCP Take Over"}`：`McpMessageHandler.java:64-67`。
  - 用户必须在游戏内（暂停屏按钮或 overlay）**亲自**接管：`ModDevMcpMod.java:76-97`（`handleTransferOverlayClick` / `handleOverlayClick`）、`ControlModeHelper.java:57-74`（`enterMcpControlMode`）。
  - 接管期间**屏蔽暂停屏**（`MinecraftClientMixin.java:25-30`：`setScreen` HEAD 处 `ci.cancel()` 掉 `GameMenuScreen`）。
  - 失焦/后台输入模式（issue #54）：`McpConfig.java:58-79`（`-Dmcp.background_input` / `MC_MCP_BACKGROUND_INPUT`），只改游戏内鼠标状态、不碰 OS 光标。
- **bridge 侧的 `requiresControl` 字段是死元数据**：`tools.ts:7` 声明 + 19 处赋值，但 grep 全包**无任何读取点**；真正的闸门在 mod 侧。⇒ 工具描述里的 "Requires control mode." 只是文案。

---

## 4. 工程与质量做法

### 4.1 测试怎么组织：**单元测试面几乎为零；真正的测试是「真机 E2E 脚本」**

- **TypeScript 单测：0 个文件**。`package.json:25` 的 `test` 是 `vitest run --passWithNoTests`；`glob **/*.test.*` 与 `**/__tests__/**` 在 `packages/` 下**均 0 命中**。⇒ `npm test` 绿 = 没有测试。
- `tests/` 目录**在 clone 里是空的**：只有 `tests/README.md` 与两个 `.gitkeep`（`tests/metadata/.gitkeep`、`tests/reference-screenshots/.gitkeep`）。`tests/README.md:9-17` 描述的基准截图**不在仓库**（未用 git-lfs：`.gitattributes:1-14` 无 lfs 条目）。
  - 但 CI 代码对缺失基准是**软跳过**：`scripts/ci_helper.py:906-908`（`if ref_path.exists():` 才比对）⇒ 截图回归**当前是空跑**。
- 真测试在 Python 侧，且是**真机驱动**：
  - `scripts/ci_helper.py`（1180 行）：`wait_for_mod(url="http://127.0.0.1:9876", timeout=180, start_port=None)`（`:425`）、`api_call(mod_url, cmd, params=None, timeout=30, retries=4)`（`:511`）、`get_screenshot`（`:536`）、`verify_screenshot`（`:547`）、三档截图比对（`:559,582,634`）、确定性渲染配置 `generate_options_txt`（`:653`）、超平坦测试世界 `_generate_level_dat`（`:322`）、`run_smoke_test`（`:758`）、`run_e2e_test`（`:930`）。
  - `scripts/smoke_test.py`（602 行）、`scripts/matrix_test.py`（457 行）、`scripts/run_full_matrix.py`（260 行）、`scripts/win_matrix_test.py`。
  - 单包级 SDK 自测：`packages/minecraft-mod-mcp/scripts/sdk-test-all.mjs:25-59`（遍历所有 `<ver>/<loader>`，清 `build/libs|classes|tmp` 后逐个跑，可 `--filter=`）。
- 测试环境确定性做法（值得抄）：`tests/README.md:38-47` 明确列出「关云/关粒子/关音效、FOV=70、renderDistance=4、超平坦 Redstone Ready、doFireTick=false」。

### 4.2 CI：分层矩阵 + 按改动面收敛 + 真机 headless

- `.github/workflows/ci.yml`（744 行），`concurrency` + `cancel-in-progress`：`ci.yml:10-12`。
- 作业图：
  1. `build-common`（Windows）：`gradlew :packages:common:clean :packages:common:publish`，并**断言 `.maven-local` 非空**（`ci.yml:35-50`）。
  2. `build-mods`（Windows，矩阵按 **JDK 车道**分 4 组：8 / 17 / 21 / 25）：`ci.yml:61-179`。**PR 只构建被改动的模块**（`scripts/select_mods.py`：`ci.yml:183-196`；共享前缀 `packages/common/`、`gradle/`、`scripts/modgen/` 等 → 全量：`scripts/select_mods.py:23-24,38-41`）。
  3. 历史坑位的工程化修补：**FG 3/4.1 时代（JDK 8）取不到 MCP snapshot 映射，改用 Python（现代 TLS）预热 Gradle 缓存**：`ci.yml:223-231`；`scripts/prepare_cache.py`、`scripts/wrapper_jars.py`（`ci.yml:233-235`）。
  4. `dev-release`：把矩阵产出的 jar 汇总成开发版 Release（`ci.yml:324-367`）。
  5. `headless-smoke`（ubuntu + Xvfb + llvmpipe + lavapipe）：**27 个 <ver>/<loader> 组合**，逐条列出并**显式记录哪些组合被排除及原因**（1.20.4-neoforge 因上游 installer 404；1.20.6-neoforge 因 llvmpipe/narrator）：`ci.yml:368-413`；系统依赖**逐个 apt 安装**以免一个包名消失整批失败：`ci.yml:473-485`；启动 `Xvfb :99 … +extension GLX` 并设 `LIBGL_ALWAYS_SOFTWARE=true`/`GALLIUM_DRIVER=llvmpipe`：`ci.yml:486-494`；先 dump `vulkaninfo/glxinfo`：`ci.yml:495-499`；跑 `python scripts/ci_helper.py smoke …`：`ci.yml:506-515`。
  6. `screenshot-test`（`ci.yml:523-640`）：截图 + 与基准比对 + 上传 artifact。
  7. `e2e-smoke`（1.21.7-forge）：三段式脚本（in-game / inventory / sign）标签约定见 `tests/README.md:19-29`，执行 `ci.yml:725-734`。
  8. `commit-lint` 工作流：`AGENTS.md:31-58` 声明由 `scripts/commit_lint.py` 校验 PR 标题与 master 提交。
- 与 `master` 门禁的耦合：CI 是硬门（AGENTS.md:135-155「CI is a gate for code failures」），**仅 docs-only 可记录豁免**。

### 4.3 门（gate）脚本：**存在但部分未接线**

- **已接线**：`scripts/commit_lint.py`（justfile:176-177、AGENTS.md:31）；`scripts/select_mods.py`（ci.yml:194）；`scripts/wrapper_jars.py`（ci.yml:235）；`.maven-local` 非空断言（ci.yml:38-50）。
- **未接线（我 grep 全 `.github/**/*.yml` 与 `justfile` 均 0 命中）**：
  - `scripts/gen_embedded_versions.py --check`（`gen_embedded_versions.py:101-102,108-125`）—— 存在的**跨语言漂移门**（Python 真源 vs TS 内嵌 JSON），但**没有任何调用者**（grep `embedded`/`gen_embedded` 在 yml 与 justfile 命中 0）。
  - `scripts/check_versions.py`（`:7-9` 用法为 `check_versions.py <tag_version>`）—— 同样无调用者（grep `check_versions` 在 yml/justfile 命中 0）。
  - ⇒ 这正是 `gen_embedded_versions.py:5-9` 自己警告的场景（"It drifts out of sync … the loader-availability checks then silently fail"）。
- `justfile`（238 行）是本地门面：`full` = generate_mods → generate_sources → prepare_cache → build_all（`justfile:58-63`）；`lint-commits`（`:176-177`）；`smoke`（`:139-140`）；`mcp-build`/`mcp-lint`（`:197-202`）。

### 4.4 文档结构

- `docs/guides/<8 语言>/`：每种语言三件套 `README.md` / `AI-TOOLS.md` / `CLI.md`（`docs/guides/en/`、`es/`、`fr/`、`ja/`、`ko/`、`ru/`、`zhs/`、`zht/`）。
- `docs/research/<en|zh-CN>/<ver>+<loader>.md`：**逐版本逐 loader 一份技术调研**（en 23 份、zh-CN 23 份，例 `docs/research/en/1.21.11+neoforge.md`、`docs/research/zh-CN/26.1.2+forge.md`）。
- `docs/website/`：Vue3 + Vite + UnoCSS 的官网（`docs/website/src/App.vue`、`docs/website/package.json`），有独立 workflow `website.yml`。
- 面向 AI 的「一条链接自举」：根 README 让用户把 `docs/guides/en/AI-TOOLS.md` 的 URL 粘给 AI，由 AI 自己写 `.mcp.json`（`README.md:22-31`；面向 agent 的指令块 `AI-TOOLS.md:5-24`）；仓库内自带 `.mcp.json` 与 `.opencode.json`（各 8 行，配置同一 server）。

### 4.5 AGENTS.md / CONTRIBUTING.md 对 AI 协作的约定

`AGENTS.md`（173 行，9 节）——**它是一份面向「多 agent 并行 + 强制 PR」的作业规程**：

| 主题 | 约定（要点） | 指针 |
| --- | --- | --- |
| 分支模型 | `master` 唯一长期分支、**已保护**（强制 PR、0 approval 可自合并、禁 force-push、只允许 squash merge）；`dev` 于 2026-09-03 退役 | `AGENTS.md:16-30` |
| 提交/PR 标题 | CI 强制 `<gitmoji> <Capitalized English one-sentence ending with a period.>`；**禁止** conventional-commit 冒号前缀；squash 后缀 ` (#123)` 豁免 | `AGENTS.md:31-58`；`CONTRIBUTING.md:82-111` |
| 每任务流程 | 建 feature 分支 → **3 轮验证循环**（analyze→improve→verify，任一失败从零重数）→ **非平凡任务必须走 subagent**（给精确文件路径+约定+验收标准，并行起独立子任务）→ 本地 `just full`/`just lint-commits`/`just smoke <version>` → PR → squash 合并删分支 | `AGENTS.md:60-96` |
| PR 经济性 | 一个连贯特性/修复波次一个 PR，别为琐碎改动开 PR | `AGENTS.md:79-81` |
| 版本号自治上限 | **agent 只能自行 bump PATCH**（0.4.0→0.4.1）；MAJOR/MINOR 或改变公开 API 面必须显式授权，否则停下问人 | `AGENTS.md:82-91`（§3.8） |
| push 纪律 | 禁裸 `--force`；只许 `--force-with-lease` 且被拒即停 | `AGENTS.md:97-109` |
| 敏感信息红线 | 凭据/内网 IP 一律不入树；提交前 grep `password \| secret \| token \| api_key`；泄漏按事故处理 | `AGENTS.md:110-134` |
| CI 使用 | 所有 workflow 必须有 `concurrency`；PR 跑 build 矩阵 + commit-lint，push 到 master 才跑 smoke/screenshot/E2E；**不要盯着 CI 看** | `AGENTS.md:135-155` |
| CHANGELOG | **禁止**新建 CHANGELOG 文件；PR 历史即 changelog，发布说明写 GitHub Releases | `AGENTS.md:156-163` |
| 本地 lint | `just lint-commits` / `python scripts/commit_lint.py --subject "…"` | `AGENTS.md:164-171` |
| 多 agent 共存 | 多 agent 共享一个 checkout 时用 `git worktree` 隔离，绝不并发编辑主 checkout | `AGENTS.md:62-64`（§3.1） |
| 显式不采纳项 | 逐条列出从上游 Celestia 工作区规则中**刻意不采纳**的 6 类（代理/节点表/Rust-pnpm 运维/自托管 runner/waiver 文化等） | `AGENTS.md:172-173` + 表格 |

---

## 5. 候选借鉴点清单

> 证据强度：**源码实证** = 我在 clone 里读到了实现；**仅文档声称** = 只在 README/AGENTS/注释里声明，未在源码验证。

| # | 对方做了什么（含指针） | 为什么值得借鉴 | 我们大致缺什么 | 强度 |
| --- | --- | --- | --- | --- |
| 1 | **控制模式闸门**：mod 侧 `ALWAYS_ALLOWED` 白名单 + 未接管即拒绝（`McpMessageHandler.java:43-51,64-67`），用户必须在游戏内亲手「MCP Take Over」（`ControlModeHelper.java:57-74`、`ModDevMcpMod.java:76-97`） | 把「AI 能操作玩家输入」变成**显式、可撤销、用户亲手开启**的能力；与我们的「人在环」口径天然同构，且比我们现在的「授权根 + confirmed」更贴近真实交互风险 | 我们的 playtest 闸门是**环境变量 + 授权根 + confirmed**（路径级），没有「游戏内一次性人工接管」这一手；也**没有**「接管期间屏蔽暂停屏」这类细节 | 源码实证 |
| 2 | **端口零配置双向扫描 + 载荷形状握手**：mod 递减找空端口（`McpHttpServer.java:79-92`），bridge 递减探测并用 `isModStatus` 校验 `type`/`port`（`scanner.ts:21-27`、`consts.ts:18-22`） | 彻底消除「端口写错/被占用」这一整类失败；握手判据是**载荷契约**而不是「端口通」，避免误认 | 我们的桥是固定 38081（`mcp-server/src/playtest-bridge/index.ts:39`、`generators/playtest-bridge-mod.ts:383`），端口冲突即整体失败，没有区间回退，也没有「多实例自动区分」 | 源码实证 |
| 3 | **请求↔结果按同步 HTTP 一一对应，且桥侧掉线自愈**：`modClient.ts:59-69` + 502/503/ECONNREFUSED 即 `disconnect()`（`:66,71`），下次调用重扫（`handlers.ts:52-54`） | 「进程被杀/游戏重启」后 AI 不需要重启 MCP server，下一条命令自动重连；对长驻会话很关键 | 我们的桥一旦端口变了（新实例）需要重新 `status` 探测；**不确定**是否有自动重扫 | 源码实证 |
| 4 | **截图带坐标网格 + 结构化返回**：mod 侧在 PNG 上叠 100px 网格与刻度（`McpHttpServer.java:267-290`），返回 `{original, grid, width, height}`（`:251`） | 让模型「看图点坐标」这件事可被验证——网格把像素坐标显式化，显著降低点击落点漂移 | 我们的截图证据面（`inspect_playtest_evidence` 的截图）**只做存在性/三态判读**，没有坐标网格辅助定位 | 源码实证 |
| 5 | **真机 headless CI 矩阵 + 逐条记录豁免原因**：27 个组合跑 Xvfb/llvmpipe（`ci.yml:368-413,473-499`），被排除的组合写明理由（installer 404 / narrator 环境） | 「哪些版本没测、为什么没测」写在 CI 里，是可审计的覆盖账本；apt 逐包安装避免整批静默失败（`ci.yml:476-485`） | 我们的 playtest 阶梯有 L0–L7 与证据三件，但**没有一份「逐档位跑了/没跑/为何没跑」的机器可读账本**挂在 CI 上 | 源码实证 |
| 6 | **确定性渲染/世界配置**（关云、关粒子、FOV=70、renderDistance=4、超平坦固定种子、`doFireTick=false`）：`tests/README.md:38-47`、`ci_helper.py:322,653` | 截图回归的前提；否则「像素级对比」永远在抖 | 我们的 driver 模式有 `plan.txt` 与状态断言，但**渲染确定性配置**未成文（不确定） | 源码实证（配置清单来自文档+脚本） |
| 7 | **跨语言单一真源 + 漂移门**：Python `ALL_VERSIONS`（`version_config.py:117`）→ 生成 TS 内嵌 JSON（`gen_embedded_versions.py:1-12`），并提供 `--check` 漂移门（`:101-125`） | 版本矩阵这种东西一旦两处维护必然漂移；「生成 + 可校验」是正解 | 我们的版本/档位数据大量以文件树 + 手工登记（`CORPUS_PROVENANCE.md` 等）维护，**没有**「真源 → 生成 → --check 门」这条链 | 源码实证（**注意：对方的门也没接线**，见 §6 第 7 条） |
| 8 | **spawn 白名单护栏**：`assertAllowedProgram` + 三个 allowlist（`spawnGuard.ts:4-18`），所有 `spawn` 前置校验 | 把「AI 可控路径」收敛到「只允许 java/gradlew/run 脚本」这一条不变量上，成本极低、收益极高 | 我们有路径根守卫（`src/utils/project-sandbox.ts`），但**不确定**是否对「可执行文件名」也有 allowlist | 源码实证 |
| 9 | **把「人类在环」写成机器可读的作业规程**：AGENTS.md 的 3 轮验证循环、非平凡任务强制 subagent、PATCH-only 版本自治、PR 经济性（`AGENTS.md:60-96,82-91`） | 这几条直接约束「AI 自主改仓库」的边界，且**可被 review 检查**（不是口号） | 我们的根 AGENTS.md 有大量「不代跑 Gradle / 不拷 jar / 不代上传」的铁律与人在环模板，但**缺**「agent 只能 bump PATCH」这类**权限自治上限**的明文条款 | 源码实证（文本） |
| 10 | **向 agent 自举的文档入口**：把 `AI-TOOLS.md` 链接交给 AI，由 AI 自己写配置（`README.md:22-31`、`AI-TOOLS.md:5-24`），并在正文最前面写「为什么必须是 bridge 而不是 URL」（`AI-TOOLS.md:22`） | 用文档**主动纠正**宿主 AI 最容易犯的错（把 URL 当 MCP 端点），减少无效排查 | 我们的 README/AGENTS 面向的是「已接入的宿主」，**不确定**是否有面向「陌生 AI 第一次接入」的自举页 | 源码实证 |
| 11 | **in-jar 调试面板 + SSE 事件流**：`/debug` 静态页（`McpHttpServer.java:101,176-223`）、`/api/events`（`:349-383`）、`/api/calls`（`:385-398`）、事件环形缓冲 200（`:25,137-141`） | 「AI 刚才到底调了什么、耗时多少、报了什么」有人可看的现场；排障时不用翻日志 | 我们的证据面是 `calls.jsonl` + `qa.log` + `state.json`（文件级），**没有**「活的」实时流与可视化面板 | 源码实证 |
| 12 | **每个版本组合一份技术调研文档**（`docs/research/en` 与 `zh-CN` 各 23 份，如 `<ver>+<loader>.md`） | 版本差异被沉淀成「按组合可检索」的知识，而不是散在代码注释里 | 我们的规则树/语料是按平台×档位组织的，**方向一致**（我们有 / 对方也有），但对方是**逐 ver+loader 组合**粒度 | 源码实证（文件存在） |

---

## 6. 反向结论：明显不值得学 / 不适用的部分

1. **它的「反射兜底」不是我们的路线，不要照抄。** 为了跨 1.7.2→26.3 一份代码，它大量使用「按方法名/字段名/返回类型猜」的反射（`PlayerWorldHelper.java:100-125`、`ReflectedInputHandler.java:91-129`）。这在「AI 生成正确 API 调用」这个目标上是**反方向**的：它把不确定性推给运行时，而我们的口径是**每条 API 论断必须有出处**（规则树/语料/签名）。照抄会直接违反我们的「禁止凭记忆补名字」纪律。
2. **命令执行没有回执，只报「已投递」。** `sendCommand` 成功返回 `{"sent":true,"method":"dispatcher.execute"}`（`PlayerWorldHelper.java:492`），**拿不到命令输出**。这与我们「判据放接收端」的口径正面冲突：用它的形状写测试，会把「命令发出去了」误读成「效果发生了」。**明确不借鉴**。
3. **超时被静默成空串。** 5s `latch.await` 超时后多数路径返回初始 `""`（如 `McpMessageHandler.java:123-124`、`:321-322`），既不报错也不带 `absent` 标记。我们的 playtest 证据纪律要求 **fail-closed + 三态（present/absent/unreadable）**，这种「超时→空值→看似成功」正是我们要拦的反模式。
4. **并发下的共享可变状态。** `lastClickResult` 是 `private static`（`ReflectedInputHandler.java:131`），而 mod 侧线程池 8（`McpHttpServer.java:93`）⇒ 并发点击可能读到别人的结果。**不借鉴**。
5. **绑定地址不一致 / 无鉴权。** mod 监听 `0.0.0.0`（`McpHttpServer.java:77,83`），bridge 却假设 `127.0.0.1`（`defaults.ts:62`）；HTTP 端点无 token、`Access-Control-Allow-Origin: *`（`:219,403`）。**不要**把这个形状带进任何可能被多机访问的场景。
6. **测试面虚高。** `npm test` 是 `vitest run --passWithNoTests`（`package.json:25`），全包 0 个测试文件；`tests/` 目录实际为空、基准截图缺失且 CI 对缺失**软跳过**（`ci_helper.py:906-908`）。**它宣称的「测试」= 真机脚本，不等于单元/集成测试**。不要拿它的「有 CI」当「有测试覆盖」的证据。
7. **门存在但没接线。** `gen_embedded_versions.py --check`（`gen_embedded_versions.py:101-125`）与 `check_versions.py` 都没有任何 workflow/justfile 调用者（grep 0 命中）——而 `gen_embedded_versions.py:5-9` 恰恰警告「不同步会让 loader 可用性判断静默失败」。**教训**：门必须挂在执行路径上，否则只是注释。
8. **代码生成 103 份工程 + 204 行 `srcDir` 的维护成本。** 每个组合一份 build.gradle、mixins、ModDevMcpMod，且都把 common 源码再编译一遍；`.maven-local` 发布物在 clone 内找不到消费者。**形态差异导致不适用**：我们不做「为每个 MC 版本产出可分发 jar」这件事，抄这套矩阵只会引入 103 份需要同步的构建脚本。
9. **死依赖 / 文档漂移。** `org.java-websocket:Java-WebSocket:1.5.4` 出现在 103 份 build.gradle（例 `packages/mods/1.21.11/forge/build.gradle:40`），但**全树 Java 代码 0 引用**；同时 mod 元数据与语言文件仍写 "WebSocket bridge"（`packages/mods/1.21.11/forge/src/main/resources/META-INF/mods.toml:9`、`packages/common/src/main/resources/assets/mcpmod/lang/en_us.json:7`），而实际传输是 HTTP。**教训**：描述文本与依赖清单会长期漂移，需要机器门（我们的 `assert-*-wording` 系列正是干这个的，值得保持）。
10. **`requiresControl` 是死字段。** `tools.ts:7` 声明 + 19 处赋值，无任何读取点。**教训**：声明式元数据如果不在执行路径上被消费，就是给 AI 看的假信号。

---

## 7. 对照我们的仓库（轻量，只写「有/没有/不确定」）

口径：我们的工具名以 `mcp-server/src/tool-registry.ts` 与 `mcp-server/src/wave/register.ts` 为准（本会话实测 `registerTool(` 命中 **89** 处，与根 AGENTS.md「工具面约 89 个」一致）。

| 维度 | 对方 | 我们 | 判定 |
| --- | --- | --- | --- |
| MCP 传输 | stdio（`transport.ts:18-21`） | stdio（`mcp-server/src/index.ts:3,88`） | **有** |
| 游戏内 mod 暴露 HTTP + 外部工具转发 | 有（HTTP + SSE） | 有（`playtest_bridge` 打 `127.0.0.1:38081`；桥 mod 模板 `mcp-server/src/generators/playtest-bridge-mod.ts:383`，`/status`+`/execute` 契约 `:705-723`） | **有**（形态同构） |
| 请求 ID 关联 | **无**（`sendResponse`/`sendInit` 空实现，`McpMessageHandler.java:18-19,106-107`） | **有**（桥协议带 `id`：`generators/playtest-bridge-mod.ts:721`） | **我们有**（优于对方） |
| 启动/管理 MC 实例（`launch_minecraft`/`install_version`/`list_installed_versions`） | 有（`tools.ts:257,284,297`） | grep `launch_minecraft`/`install_version`/`list_installed_versions` 在 `mcp-server/src` **0 命中** | **我们没有**（我们按人在环铁律不代跑/不代启） |
| 代跑 Gradle | CLI `sdk` 会跑 `gradlew build`（`cli.ts:647,1172-1207`） | 不代跑（根 AGENTS.md 铁律；`generate_*` 只吐文本） | **形态差异**：不是缺失，是设计选择 |
| 游戏内真实输入注入（点击/按键/截图） | 有（`ReflectedInputHandler.java:133-264`） | 有（playtest driver / 桥动作；`generators/playtest-driver.ts` 等） | **有**（实现路径不同：我们生成 driver，对方常驻 mod） |
| 命令执行回执 | 只有「已投递」（`PlayerWorldHelper.java:492`） | 证据面是 `exit-code.txt`/`state.json`/`qa.log`/`rounds.jsonl`（根 AGENTS.md「证据三件」） | **我们更严** |
| 版本×loader 覆盖矩阵 | 55 版 / 103 组合（磁盘实测） | 8 棵平台树 + 服务端面；**档位数以规则树/语料为准** | **不确定**能否逐条对齐（本会话未核我们的档位总数） |
| 跨语言真源 + `--check` 漂移门 | 有生成器与 `--check`，但**未接线** | 我们有 `CORPUS_PROVENANCE.md` 记账与多道 `assert-*` 门（`REAL_RUN_GATES`） | **我们有且已接线**（对方是反面教材） |
| 单测 | 0 个测试文件 | **不确定**（本会话未统计我们的单测数量） | 不确定 |
| 真机 headless CI 矩阵 | 有（`ci.yml:368-518`） | **不确定**是否有等价 CI 车道 | 不确定 |
| 面向陌生 AI 的自举文档 | 有（`AI-TOOLS.md`） | **不确定** | 不确定 |
| 权限自治上限（PATCH-only） | 有明文（`AGENTS.md:82-91`） | **没有**（我们的 AGENTS.md 无此条） | **我们缺** |

---

## 8. 一页速览（给 lead 的结论）

- **形态**：双进程 —— 游戏内 Java mod 跑 HTTP+SSE（`McpHttpServer.java:74-105`），外部 TS bridge 说 MCP/stdio 并转发（`transport.ts:18-21`、`modClient.ts:52-74`）；mod **不实现 MCP**（`packages/minecraft-mod-mcp/README.md:38`）。
- **工具面**：MCP **46 个**（`tools.ts`，逐名有指针）；mod 侧另有 37 个 method，其中 5 个（`press_enter`/`direct_scroll`/`select_list_item`/`call_screen_method`/`drag`）**无 MCP 工具**。
- **多版本抽象**：Python 代码生成薄外壳 + Java 运行时反射内核（`generate_sources.py:1-18`）；55 版 / 103 组合；版本矩阵真源 `version_config.py:117` → 生成 `versions-embedded.json`（`gen_embedded_versions.py:1-12`，但 `--check` 门未接线）。
- **最值得学的 3 条**：① 控制模式闸门（白名单 + 用户游戏内亲手接管，`McpMessageHandler.java:43-51,64-67`）；② 端口零配置扫描 + 载荷形状握手（`McpHttpServer.java:79-92`、`consts.ts:18-22`）；③ 截图坐标网格（`McpHttpServer.java:267-290`）与 in-jar `/debug`+SSE 现场（`:349-398`）。
- **明确不学**：命令无回执只报「已投递」、超时静默成空串、静态字段跨线程共享、测试面虚高、门未接线、103 份构建脚本的维护形态。

---

### 附：本报告引用的证据指针索引（按文件）

- `README.md`: 22-31, 36, 49-56, 67, 112, 118, 141-153
- `CONTRIBUTING.md`: 11-13, 37-50, 52-57, 82-111
- `AGENTS.md`: 16-30, 31-58, 60-96, 82-91, 97-109, 110-134, 135-155, 156-163, 164-171, 172-173
- `.github/workflows/ci.yml`: 10-12, 35-50, 61-179, 183-196, 223-235, 324-367, 368-413, 473-499, 506-515, 523-640, 641-744
- `.gitattributes`: 1-14
- `justfile`: 1-4, 58-63, 139-140, 176-177, 197-202
- `tests/README.md`: 9-17, 19-29, 38-47
- `packages/minecraft-mod-mcp/package.json`: 4, 10, 22-29, 25, 52-58
- `packages/minecraft-mod-mcp/README.md`: 9, 16, 19, 38, 100-106
- `docs/guides/en/AI-TOOLS.md`: 5-24, 9, 22, 30-38, 40-44
- `packages/minecraft-mod-mcp/src/mcp/tools.ts`: 3-8, 14, 16, 18-373（逐工具行号见 §2 表）
- `packages/minecraft-mod-mcp/src/mcp/handlers.ts`: 38-43, 45-65, 67-202, 204-266, 268-310, 323-331, 333-337, 390-463
- `packages/minecraft-mod-mcp/src/mcp/transport.ts`: 7-16, 18-21
- `packages/minecraft-mod-mcp/src/server.ts`: 12-21, 23-43
- `packages/minecraft-mod-mcp/src/index.ts`: 1-18
- `packages/minecraft-mod-mcp/src/consts.ts`: 3-5, 7-22
- `packages/minecraft-mod-mcp/src/api/modClient.ts`: 7-9, 27, 36, 47-50, 52-74, 76-89, 99-108
- `packages/minecraft-mod-mcp/src/api/http.ts`: 6-112, 15
- `packages/minecraft-mod-mcp/src/discovery/scanner.ts`: 4-19, 21-27, 29-42, 44-55
- `packages/minecraft-mod-mcp/src/mc/defaults.ts`: 4, 57-65, 154-160, 166-169
- `packages/minecraft-mod-mcp/src/mc/platform.ts`: 55-69, 77-104
- `packages/minecraft-mod-mcp/src/mc/launch.ts`: 25-30, 232-238, 294-299
- `packages/minecraft-mod-mcp/src/mc/spawnGuard.ts`: 4-6, 13-18
- `packages/minecraft-mod-mcp/src/mc/urlGuard.ts`: 19-25
- `packages/minecraft-mod-mcp/src/mc/versions.ts`: 7, 22-54, 60-75, 151-204, 206-225
- `packages/minecraft-mod-mcp/src/mc/versionsData.ts`: 66-79, 84-88
- `packages/minecraft-mod-mcp/src/mc/versions-embedded.json`: 2-57, 86-105, 520-522, 524-579, 580-635, 636-639, 641-650
- `packages/minecraft-mod-mcp/src/cli.ts`: 22-85, 100-120, 555-668, 1172-1207
- `packages/minecraft-mod-mcp/scripts/sdk-test-all.mjs`: 25-59
- `packages/common/build.gradle.kts`: 6-13, 23-33
- `packages/common/src/main/java/xyz/langyo/minecraft/mcp/common/McpHttpServer.java`: 23-25, 74-105, 93, 107-122, 137-141, 176-223, 225-265, 267-290, 292-347, 349-383, 385-398
- `.../McpMessageHandler.java`: 13, 18-19, 43-51, 53-104, 106-107, 114-123, 196, 314-321, 357-371, 498-505
- `.../McpProtocol.java`: 11-28
- `.../McpConfig.java`: 6-23, 25-36, 38-50, 58-79
- `.../ReflectedInputHandler.java`: 18-61, 91-129, 131-147, 133-264, 285, 297, 301-305, 324
- `.../ReflectionHelper.java`: 16-44, 307-322
- `.../ReflectionCache.java`: 16-36, 40-71
- `.../PlayerWorldHelper.java`: 67-96, 100-125, 287, 427-608, 610-613
- `.../ControlModeHelper.java`: 13-15, 57-74, 76+
- `.../lang/en_us.json`: 7
- `packages/common/src/main/resources/mcp-debug/index.html`: 217
- `packages/mods/1.21.11/fabric/src/main/java/xyz/langyo/minecraft/mcp/mod/ModDevMcpMod.java`: 6-26, 76-97
- `packages/mods/1.21.11/fabric/src/main/java/xyz/langyo/minecraft/mcp/mod/mixin/MinecraftClientMixin.java`: 25-30
- `packages/mods/1.21.11/forge/build.gradle`: 35-36, 38-41
- `packages/mods/1.21.11/forge/src/main/resources/META-INF/mods.toml`: 7, 9
- `scripts/generate_sources.py`: 1-18, 48-93
- `scripts/generate_mods.py`: 1-21, 82-114
- `scripts/gen_embedded_versions.py`: 1-12, 97-125
- `scripts/version_config.py`: 117, 404-406
- `scripts/select_mods.py`: 23-24, 38-41
- `scripts/ci_helper.py`: 47-49, 322, 425, 511, 536-634, 653, 758, 906-908, 930
- `scripts/check_versions.py`: 7-9
- `scripts/mc_vtty.py`: 1-18, 49-50, 69-84
- 我们的仓库（对照用）：`mcp-server/src/index.ts`: 3, 88；`mcp-server/src/tool-registry.ts`；`mcp-server/src/wave/register.ts`: 274, 304, 1091, 1296；`mcp-server/src/playtest-bridge/index.ts`: 39；`mcp-server/src/generators/playtest-bridge-mod.ts`: 383, 705-723
