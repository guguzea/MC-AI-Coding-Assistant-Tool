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
