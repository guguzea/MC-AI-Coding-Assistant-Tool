# 游玩自测的两条 loop：客户端面 / 服务端面

> 本文件是根 [`AGENTS.md`](../AGENTS.md)「游玩自测作业规则」与「服务端面 loop」两处的**详细内容共同落点**。
> 两条 loop 共用同一套证据纪律（每轮 `state.json` / `exit-code.txt` / `qa.log` ＋ 截图，缺件读作 `absent`，
> 不得读成"没有失败"），差别只在**载体、动作能力与判据位置**：
>
> | | 客户端面 loop | 服务端面 loop |
> |---|---|---|
> | 载体 | `runClient`（无桥 driver / 桥 / 意图会话） | `runServer`（Paper 插件） |
> | 动作能力 | 玩家级：走位 / 跳跃 / 挖掘 / GUI（仅 `PLAYTEST_VERIFIED_TIER` 档） | 命令级：`mark` / `cmd` / `assert marker` / `wait ticks` / `stop` |
> | 判据位置 | 客户端日志 / 截图（发玩家时服务端日志里没有） | 服务端日志 + 探针写出的 `<name>.ok` marker |
> | 档位权威 | `PLAYTEST_VERIFIED_TIER`（正文不数档） | `paper/<ver>/rules/` + 本文件 |
>
> 口径与坑位的家仍是 `community_knowledge/authored/ingame-playtest-automation.md`；服务端面语料与规则载体见 [`server-face-paper.md`](./server-face-paper.md)。

---

## 一、客户端面 loop

### 游玩自测作业规则（长驻会话 + 剧本热载）

适用范围：`mc-ingame-playtest` 工作流的**执行面**（桥路线 / 无桥剧本 driver / 意图会话三条都适用；逐步教程见仓库根 `README.md`「后半 loop 教程」）。

1. **常驻会话，不许"改一次动作就重启"**：无桥 driver（`generate_playtest_driver` 的 `driverMode=temporary_client_tick_driver`）是**长驻解释器**——进世界后守候 `<evidenceDir>/plan.txt`，**文件一变就在同一游戏进程内开新一轮**（轮次日志、`rounds.jsonl` 与杀进程善后见社区文档）。
   - **只有两类改动允许重启游戏**：① driver 生成物 / 被测 mod 的 **Java 源码**变了（JVM 不能热换类）；② 会话崩了，或世界被 `session.lock` 占住。
   - **动作、断言、目标坐标、等待时长、场景编排一律改 `plan.txt`（热载），不得为此重启**。一批代码改动应**攒起来一次重启**，之后在同一次会话里连做多轮。
   - 桥路线同理：能用 `await` / `execute` 解决的，不要重启实例。
2. **fail-closed + 证据三件**：每轮必落 `state.json` / `exit-code.txt`（0 绿 / 1 红）/ `qa.log`（**只含本轮** `[QA]` 段，历史在 `rounds.jsonl`）＋ 截图（`<gameDir>/screenshots/`）。超预算、断言不成立、坐标解析不到、目标找不到**一律判红**；缺件在 `inspect_playtest_evidence` 里读作 `absent`，**不得**读成"没有失败"或 0。
3. **关游戏要先问用户**：要关就精确杀真身 JVM——**别只杀 `gradlew` wrapper**，残留客户端会占住世界 `session.lock`，下一轮进世界报「另一个程序已锁定文件的一部分」。
4. **撤除纪律**：驱动文件 + `PlaytestQaDriver.register();` 调用行测完**必须删**（绝不提交）；证据只留授权根；驱动代码不进正式实例 / 正式分支。
5. **进场 pin、出场 lease（世界位移作废）**：每轮开工前记下进场锚（git HEAD 或本轮构建产物哈希 + `plan.txt` 的版本号/修改时间），判绿前对锚验一次没动过——轮中被改（产物重建、plan 中途热换、游戏进程被人重启）则该轮证据一律作废：不判红、也不当绿，重跑该轮。跨轮引用证据必须带轮次号与锚点，带不出按未验证处理。「并发写盘卡死假红」「npm test 与语料抓取并发假红」「两个 runClient 互拆日志」这类事故都是缺这道检测的成因。
6. **多客户端（多会话）**：会合靠 driver 的 `touch` / `waitfile` 一对**文件**原语 —— 但**各端 `EVIDENCE_DIR` 天然不同**，所以要会合就必须在剧本里写**同一个共享目录的绝对路径**（驱动不猜、不做跨机同步；跨机自己挂共享盘）。判绿用 `inspect_playtest_multi`（**联合判据**：客户端数 ≥1 ∧ 全员 `exit-code=0` ∧ `state.json` 与 `.log` 都 present ∧ `rounds.jsonl` 末轮 `ok≠false` ∧ `expectMarkers` 全 present），并出**锚点表**（各端 `state.json` 的 `at` / `plan.txt` mtime / 末轮号）供跨轮引用。自动发现时 `<evidenceRoot>/sync/` 是**保留名**（会合 marker 的家，不是客户端），跳过必须写进 `autoSkipped` 留痕；**任一**客户端目录 realpath 越出授权根 ⇒ **整体拒**（不逐客户端放行）。

### 桥（`playtest_bridge`）的端口区间与形状握手（2026-11-04 冻结协议）

桥是客户端面的一条独立路线（**不进** `PLAYTEST_VERIFIED_TIER`、不参与 driver 派发）。下面三条是**两侧共同**的契约，
Java 侧（本仓自建桥模板 `mcp-server/src/generators/playtest-bridge-mod.ts`，三套模板 forge / rift / modloader 逐字同形）已实现并跑过：

- **端口区间 = `38081 → 38071`（含两端，共 11 个）**：桥 mod 起 HTTP server 时**从 38081 递减**逐个试 bind，
  **第一个可用端口胜出**；实际端口存进字段，`/status` 的 `httpPort` 回**实际值** ⇒ **别假设 38081**，要连哪个端口以该键为准。
  38081 空闲时行为与旧版**逐字一致**。客户端**显式给 `port` 时只探该端口、不扫描**（向后兼容）。
- **形状握手**：`/status` 在**逐字保留全部旧键**（`status` / `version` / `platform` / `httpPort` / `actions` / `ready`）的前提下
  **追加** `"type":"mc-skill-playtest-bridge"` 与 `"bridgeProtocol":1`。严格档判据 =
  `status=="success"` ∧ `type=="mc-skill-playtest-bridge"` ∧ `typeof bridgeProtocol=="number"` ∧ `bridgeProtocol<=1`；
  **旧桥**（无 `type`，但 `status=="success"` ∧ `platform` 是字符串 ∧ `httpPort` 是数字 ∧ `actions` 是数组）走 **legacy 档**接受，
  但**必须显式披露**（`handshake:"legacy"` + 一条 note），**不得静默当成严格档**；`bridgeProtocol > 1` ⇒ **拒绝**（`BRIDGE_PROTOCOL_TOO_NEW`），不猜不降级。
  客户端侧同一协议还要求：`expectPlatform` / `expectVersion` 与 `/status` 不符 ⇒ `BRIDGE_INSTANCE_MISMATCH`（两侧值都给）；
  每个响应带 `bridge` 块（`{type,bridgeProtocol,platform,version,httpPort,handshake,probedPort}`）。
- **全占用 fail-closed**：11 个端口全被占 ⇒ 桥打一条**含扫描区间**的日志并**不启动**（不静默降级到随机端口、不假装起好了）；
  调用侧扫完一个都没命中 ⇒ `BRIDGE_NOT_FOUND`，载荷带 `scanned:[{port,reason}]`（`reason ∈ refused|timeout|wrong_shape|protocol_too_new`），**不得返回空结果**。
  掉线自愈只对**只读**操作（`status` / `await` 的轮询探针）重解析一次并重试一次；**`execute` 不自动重试**（可能重复施加副作用）。

**验证读数（2026-11-04，本机 JDK 8 `javac 1.8.0_504`）**：三套模板**整文件**对签名替身 COMPILE_OK；HTTP 半边抽出来**真跑**三场景 ——
① 端口全空 ⇒ bind `38081`；② `38081` 被另一座桥占 ⇒ bind `38080`；③ 11 个全占 ⇒ `server == null` 且日志打 `端口区间 [38071, 38081] … 桥不启动（fail-closed）`。
⚠ **替身只证签名形状、不证类存在**（本机无 1.12.2 / 1.13.2 / 1.6.4 构件）。逐条坑位见 `community_knowledge/authored/ingame-playtest-automation.md` 编号 107。

---

## 二、服务端面 loop

### 服务端面 loop（`generate_playtest_server_driver`）

- **闭环**：`generate_paper_plugin` 出骨架 → `generate_playtest_server_driver --evidenceDir <dir>` 出 driver + `plan.example.txt` → 注册（`onEnable` 留了注入位）→ 写 `plan.txt` → 起服。
- **classpath 6 件**（被逐类新 API 逼出来的）：`paper-api` · `adventure-api` · `adventure-key` · `org.jetbrains:annotations` · `guava` · `net.md-5:bungeecord-chat`。⚠ 末件 **Maven Central 404** ⇒ 走 `repo.papermc.io`。JDK **25**。
- **plan verb**：`mark` · `cmd` · `assert marker path=…` · `wait ticks=N` · `stop`。⚠ `cmd`（`dispatchCommand`）**不派发** `ServerCommandEvent`（**T8**）；`stop` 只收工，driver 另调 `Bukkit.shutdown()`，否则 runner 超时强杀。
- **判据范式**：探针每个通过的检查写 `<name>.ok`；plan 用 `assert marker` 断言 ⇒ **marker 缺席 = 没过**（别靠日志措辞）。
- **证据**：`exit-code.txt`（**仅 0 算过**）· `qa.log`（含 `[QA] DONE`）· `rounds.jsonl`（`ok:true`）· `state.json`。
- **起实例必备**：`online-mode=false` · **`white-list=false`** · `level-type`+`generator-settings`（**T3**）· **`-Dmcskill.probe.dir`** · 客户端侧 **`JAVA_HOME`**（逐条表与四个坑见 `rules/09-traps.md` 的 T9/T10）。
- ⚠ **需玩家动作的项（放方块 / 点物品栏 / 破坏方块）走模组面**：`generate_playtest_driver platform=neoforge version=26.3 driverMode=temporary_client_tick_driver`（档位权威 = `PLAYTEST_VERIFIED_TIER`；动作含 `use` / `gui` / `break`）。装配三处 `EVIDENCE_DIR` · `EXPECT_ITEM` · `EXPECT_SLOT` + 客户端加 `PlaytestQaDriver.register();`；`WORLD` 留空时用 **`--quickPlayMultiplayer <host:port>`** 进世界。
- **改文本文件走 Node**（`writeFileSync(f, txt, "utf8")`）：PS 5.1 的 `Set-Content -Encoding UTF8` **写 BOM** ⇒ `build.gradle` 编不过（**T10**）。

---

## 三、两条 loop 的共同纪律

- **判据放接收端**：验证一条链路时判据要放在链路接收端（或接收端能观测到的地方）。只放在发送端只能证明"发出去了"，证明不了"到了"。
- **撤除纪律**：驱动文件与注册调用行测完必须删（绝不提交）；证据只留授权根。
- **fail-closed**：缺证据 = 没通过；超预算 / 断言不成立 / 坐标解析不到 / 目标找不到一律判红。

### 命令回执：把「发出去了」与「效果发生了」分开（2026-11-04 补）

上面第一条（判据放接收端）在**命令**这条链路上最容易破功：发命令的 API 只保证「包交出去了」。
本仓两条路线的处置：

| 路线 | 真值通道 | 表外档怎么办 |
| --- | --- | --- |
| driver（`cmd` 步） | 在**集成服务端线程**（`MinecraftServer.execute`）分发，用 `ServerCommandSource.withReturnValueConsumer` 的 `onResult(boolean,int)` 拿真 `success`/`result` | 回 `{success:false, errorType:"unobserved"}` —— **投递了但未观测**，不假装成功 |
| 桥（`chat_command`） | 本档未取证 ⇒ **只发聊天包** | 返回体带 `observed:false` + `reason`（旧版只回 `sent` = 反模式）；判绿必须**再发一条独立观测**（`await condition=chat_message_matches` / `query_*`） |

**字段语义**：`errorType` 四态 —— `parse`（没进分发器）/ `runtime`（跑了但没成功）/ `success:true`+`result:N`（真成功，`N=0` 也**不是**失败）/ `unobserved`（通道不存在或超时，**既非成功也非失败**）。
**判读消费点**：`inspect_playtest_evidence` 的 `artifacts.commandReceipt` + `failures.fromCommandReceipts` / `failures.fromUnobservedCommands`；桥侧响应带 `observed` / `errorType`。
**真回执覆盖档**：`PLAYTEST_CMD_RECEIPT_TIERS`（现读，正文不数档）；逐条 javap 证据与坑位见 `community_knowledge/authored/ingame-playtest-automation.md` 编号 102–106。

**两个截图假阴性坑**（同编号 104/105）：
- **PauseGuard**：失焦会弹暂停菜单**盖住画面** ⇒ 截图与屏幕读取同时失真。driver 启动时关 `client.options.pauseOnLostFocus`，并在 `[QA]` 日志写明为什么与回退开关。
- **等帧**：`setScreen(null)` / 改视角之后**当前帧缓冲还是上一帧** ⇒ 立刻抓 = 「新文件 + 旧内容」（`mtime` 检查抓不到这个坑）。抓帧前先等 `SHOT_SETTLE_TICKS`；长距离传送后的区块渲染**不在**覆盖范围内，要另补 `wait`。
