# 09 — 实测陷阱（**全部是 2026-10-15 本次真机跑踩出来的**）

本文件与其余规则的区别：**每条都有一次实测的对照**，不是推断。判据都写明"怎么证伪"。

## T1 · JDK 底线是 **25**，不是 21

- **症状**：`bad class file: …/org/bukkit/Bukkit.class  class file has wrong version 69.0, should be 65.0`
- **根因**：class file version 69 = Java 25（Java N ⇒ 44+N）
- **证伪**：换 JDK 21 编 `paper-api-26.3.build.178-stable.jar` 必复现；换 JDK 25 即过

## T2 · classpath **只放 `paper-api` 编不过**

- **症状**：`class file for net.kyori.adventure.key.Namespaced not found`
- **根因**：Paper 侧 `CommandSender` 继承 Adventure 的 `Audience`
- **修**：加 `adventure-api` + `adventure-key`
- **证伪**：只给 paper-api 编必复现（本次两次复现）

## T3 · `level-type=minecraft:flat` + 空 `generator-settings` ⇒ 建世界报错

- **症状**：`[ERROR]: No key layers in MapLike[{}]`，出现在 `No existing world data, creating new world` 的**下一行**
- **根因**：flat 生成器的 codec 要 MapLike 里有 `layers` 键，空 `generator-settings` 给了 `{}`
- **证伪（已做，两轮对照）**：
  - 第 1 轮：`level-type=minecraft\:flat` + 空 settings ⇒ **有**该 ERROR
  - 第 2 轮：撤掉 `level-type`（默认），**世界同样全新建**（日志仍有 `No existing world data, creating new world`）⇒ 该 ERROR **消失**
  - ⇒ 是**配置**引起的，与插件/驱动无关。要设 flat 就同时给合法 `generator-settings`

## T4 · `plugin.getLogger().info(中文)` 在 Windows 控制台**乱码**

- **症状**：控制台显示 `[QA] �չ���ͣ����plan �� stop ���裩`
- **根因**：走**平台控制台编码**，不是 UTF-8
- **边界（重要）**：**证据件不受影响** —— `qa.log` 由 `Files.write(…, StandardCharsets.UTF_8)` 直写，实测 `[QA] DONE stop` 可读正常；判读器认的 `[QA] DONE` / `[QA] ERROR` 是 ASCII ⇒ **判读链无碍**
- **修法方向**（未实施）：控制台只打 ASCII，或显式设 Java 的编码

## T5 · 服务端发行件的取件口已换代

- **症状**：`api.papermc.io/v2/...` → **HTTP 410**，body `{"ok":false,"error":"sunset","message":"This API version has been sunset and is no longer available…"}`
- **修**：走 `https://fill.papermc.io/v3/projects/paper/versions/<ver>/builds`（实测 200，且带 `sha256`）
- **实测值**：`paper-26.3-190.jar` · size `55152206` · sha256 `db0fd325…`（哈希比对 **True**）

## T6 · 自测 driver 的 `stop` 语义：**停服 vs 不停服**是可观测差别

- **第 1 轮**（driver `stop` 只收工、不停服）：runner 300 秒超时强杀 ⇒ **`java rc=null err=ETIMEDOUT`**（证据完整，但"跑完还挂着"不是能用的语义）
- **第 2 轮**（`stop` 收工后 `runTaskLater(…, 20L)` 再 `Bukkit.shutdown()`）：**`java rc=0`**，日志出现 `Disabling …` → `… disabled`
- **设计**：只有 `stop` 停服；**plan 跑完 / 判红不停服**（留现场给人查看）——差异是刻意的

## T7 · 写**本仓生成器**时的坑（不是插件坑，但会让整档编不出来）

- 生成器模块把 Java 源码放在 **TS 模板字面量**里 ⇒ **模板体内出现反引号会直接终止字面量**：实测 `error TS1005: ';' expected`，并连带 javac `reached end of file while parsing`。
- 同理 `${…}` 会被当插值、`\n` 会被吃掉。
- **处方**：模板体内一律不出现反引号；用 `(char) 92` / `(char) 34` 表达反斜杠与双引号；换行用 Java 侧 `System.lineSeparator()`。本次两处都是这么修的。

## T8 · `dispatchCommand` **不触发** `ServerCommandEvent`（2026-10-15 实测 + 隔离实验）

**现象**：驱动器 `cmd` verb 底层是 `Bukkit.dispatchCommand(consoleSender, "say probe-event")`。
它**返回 `true`（命令真的执行了）**，但**已注册的 `ServerCommandEvent` 监听器什么都收不到**。

**隔离实验**（关键 —— 只看上面一条无法区分"注册链坏了"还是"派发路径不同"）：
把触发方式从 `dispatchCommand` 换成**手动** `Bukkit.getPluginManager().callEvent(new ServerCommandEvent(Bukkit.getConsoleSender(), "say probe-event"))`，
**同一份监听器代码立刻收到**（marker `v-event.ok` = `ServerCommandEvent 收到: say probe-event`）。
⇒ 排除"注册链坏了"，**差异只能归因于派发路径**。

**第三条腿：把"控制台输入路径"从推断变成实测**（2026-10-15 二轮）。上一步只证明了"监听器没坏"，**还没证明**"控制台输入真的会派发它"。于是从**服务端 stdin** 敲一条命令（runner 直接 `child.stdin.write("say stdin-probe\n")`）：

```
[PROBE] PASS v-event-stdin :: ServerCommandEvent 收到（**stdin 控制台路径**）: say stdin-probe
```

⇒ **三条路各跑过一次**，结论才是被证过的：

| 触发方式 | `ServerCommandEvent` 是否派发 |
|---|---|
| `Bukkit.dispatchCommand(consoleSender, …)`（＝ driver 的 `cmd` verb） | **否**（命令执行、返回 `true`，监听器收不到） |
| **服务端 stdin**（控制台输入路径） | **是** ✔ |
| 手动 `callEvent(...)` | **是** ✔ |

⚠ **首跑踩到的坑（测试设计，值得记）**：stdin 探针原来在 `Done (` 之后 **3000ms** 才敲，而那个 plan 只有 10 步（≈0.5s 就跑到 `stop`）⇒ **命令到得太晚、服务端已在关停**，`v-event-stdin.ok` 没出现。**那是测试设计缺陷，不是"控制台输入不派发"的负结果** —— 改成 `Done` 后 200ms 敲入、并给 plan 加 `wait ticks=40` 留窗口后即命中。⇒ **"没验到"与"验到没有"必须分清：前者要查测试，后者才是结论。**

**处方**：
- **别拿 `cmd`（或任何 `dispatchCommand`）当事件触发器** —— 那是两条路。要验事件链，用 `callEvent` 或造真实触发源。
- 反过来：**`cmd` 本身没问题**（返回 `true`、命令真执行），它只是**不是**事件触发器。

**证伪方式**：起服 → plan 走 `cmd say probe-event` → 看 `v-event.ok` 出现否。**实测记录**：首轮**没出现**（判红），换手动 `callEvent` 后出现。

## T9 · 协议级机器人连不上，但**真客户端可以**（2026-10-15：先判死、后突破）

**结论（已更新）**：**别用"没有机器人"当"验不了"** —— 真客户端的路走得通，见下。

### 第一半：协议级机器人（`mineflayer`）**确实连不上**

```
Server List Ping → version.name = Paper 26.3 · version.protocol = 777
minecraft-data（mineflayer 的协议数据源）：26.1 = 775 · 1.21.11 = 774 · 1.21.9 = 773
                                           26.3 只在版本**名**列表里、**没有协议数据**
                                           ⇒ 已知最高 = 775
```
⇒ 服务端 **777** > 客户端数据 **775** ⇒ **连不进去**（服务端拒协议不匹配的登录，不是降级就行）。`mineflayer 4.39.0`（MIT）装在 `F:\MOD_TEST\bot`，**探针成功、机器人无数据**。

### 第二半：**真 26.3 客户端可以**（这是突破）

**来源**：本机 `F:\MC_GAME\neoforge-26.3` 是 NeoForge moddev 工程（`minecraft_version=26.3`），它的
`build/moddev/artifacts/minecraft-patched-26.3.0.43-beta-merged.jar`（47.5 MB）**含 `net/minecraft/client/main/Main.class`** ⇒ **就是一个 26.3 客户端**。

**起它踩到的四个坑（逐个都记着，下次一次过）**：

| # | 坑 | 报错原文 / 现象 | 处方 |
|---|---|---|---|
| 1 | `gradlew.bat` **不在 PATH**，`cmd /c gradlew.bat` 也不解析 cwd 下相对可执行名 | `'gradlew.bat' is not recognized as an internal or external command` | 用**绝对路径** |
| 2 | gradlew 默认吃 **JVM 8** | `Gradle requires JVM 17 or later to run. Your build is currently configured to use JVM 8.` | 显式 **`JAVA_HOME=G:\jdk25\…`**（NeoForge 26.3 要 JDK 25） |
| 3 | 客户端进服参数：往 `build.gradle` 的 `client()` 后注入 `programArguments.addAll '--server','127.0.0.1','--port','25565'` **没能自动进服**（客户端仍停在主菜单） | 日志里**没有** `Connecting to…` | **让人手点进服**（或改用 `--quickPlayMultiplayer`）——**本档不依赖它**，人工点就够了 |
| 4 | 服务端 `white-list=true` | 客户端弹 `You are not whitelisted on this server!` | `server.properties` 置 **`white-list=false`**（或把用户名写进 `whitelist.json`） |

⚠ **第 4 条是我自己漏的**：写服务端实例配置时只动了 `level-type` 那几个，**漏了白名单**。⇒ **起服务端实例的必备配置清单**（照这张核）：`online-mode=false` · **`white-list=false`** · `level-type` · `generator-settings` · 以及**探针的 `-Dmcskill.probe.dir`**。

### 起服务端实例的「必备配置清单」（免得再逐个踩）

| 项 | 值 | 漏了会怎样 |
|---|---|---|
| `online-mode` | `false` | 离线客户端进不来（要真账号） |
| **`white-list`** | **`false`** | **客户端被拒：`You are not whitelisted on this server!`** |
| `level-type` + `generator-settings` | 要么都不设，要么都设对（见 **T3**） | 建新世界报 `No key layers in MapLike[{}]` |
| `-Dmcskill.probe.dir` | 证据目录的**绝对路径** | marker 落到服务端工作目录，断言找不到（**与"功能不工作"是两回事**） |
| `JAVA_HOME`（起客户端时） | `G:\jdk25\…` | Gradle 报 JVM 8 |

## T9 的旧正文（保留：协议级机器人的取证细节）

**结论**：想验「GUI 交互事件」「`PlayerJoinEvent`」这类**必须有玩家**的项，**本轮造不出来**。**不是没试，是试了发现路是堵的**：

```
Server List Ping → version.name = Paper 26.3 · version.protocol = 777
minecraft-data（mineflayer 的协议数据源）：26.1 = 775 · 1.21.11 = 774 · 1.21.9 = 773
                                           26.3 在版本**名**列表里，但 mcData("26.3") = 没有协议数据
                                           ⇒ 已知最高 = 775
```

⇒ 服务端说 **777**、客户端数据最高 **775** ⇒ **连不进去**（且服务端会拒协议不匹配的登录，不是"降级连"就行）。

**我试到哪一步**：`mineflayer 4.39.0`（**MIT** ✔ 通道 C 许可条件满足）已装到 `F:\MOD_TEST\bot`（依赖 91 包），并写了 Server List Ping 探针读出了上面那两行 —— **探针成功、机器人无数据**。

**处方**：要验玩家类事件，只能等 mineflayer/`minecraft-data` 补 777 数据，或**用真客户端手连**（本仓不代跑客户端）。**别用"没有玩家"当"验证过了"** —— 那批项**仍是未核实**（后续已由真客户端打通，见上「T9 附」）。

## T10 · **UTF-8 BOM 会让 `build.gradle` 直接编不过**（2026-10-15 实测 · **我自己踩的**）

**报错原文**（Gradle 配置阶段，**770ms 就失败**）：

```
Could not compile build file '…/build.gradle'.
> startup failed:
build file '…/build.gradle': 1: Unexpected character: '' @ line 1, column 1.
1 error
BUILD FAILED in 770ms
```

⇒ **`build.gradle` 开头多了一个 UTF-8 BOM（`EF BB BF`）**，而 Gradle 的 Groovy 解析器**不接受 BOM**。

**我是怎么把它弄出来的**：清理注入时用了 **PowerShell 的 `Set-Content -Encoding UTF8`** —— **PowerShell 5.1 的 `-Encoding UTF8` 会写 BOM**（`-Encoding utf8NoBOM` 才是无 BOM 写法）。

**症状为什么难认**：`gradlew runClient` 只吐 **1095 字节**就停，`java` 侧看不到、客户端日志不增长 —— **看起来像"客户端连不上"，实际是"构建脚本压根没编译过"**。我为此绕了三轮（先猜 `--server` 参数不对、再猜 Gradle daemon 被我的批量杀进程弄坏）。

**处方**：
- **改文本文件一律走 Node**（`readFileSync(f,'utf8')` → 去掉 `\uFEFF` → `writeFileSync(f, txt, 'utf8')`），**不要用 PowerShell 的 `Set-Content -Encoding UTF8`**；
- 排查"客户端起不来"时，**先跑一次 `gradlew help`** —— 它只做配置阶段、几秒钟，能立刻把"构建脚本坏"与"别的问题"分开；
- 判据：`gradlew help` 应 `BUILD SUCCESSFUL`；失败时**读 `What went wrong`**，不要停在"输出很短"这个表象上。

## T9 附 · 「有玩家参与」的**无人值守**已做成（2026-10-15）

**结论**：用 **`--quickPlayMultiplayer 127.0.0.1:25565`**（现代 MC 的自动进服参数）**可以无人值守**。实测日志：

```
[客户端] [minecraft/ConnectScreen]: Connecting to 127.0.0.1, 25565
[服务端] System chat: Dev joined the game
[服务端] Dev[/127.0.0.1:55926] logged in with entity id 108 at ([minecraft:overworld]27.3, 56.3, 44.9)
[PROBE] PASS v-player-join · v-inv-open · v-inv-close       ← 三项全自动
```

| 事件 | 无人值守？ |
|---|---|
| `PlayerJoinEvent` | ✅ 能（`--quickPlayMultiplayer`） |
| `InventoryOpenEvent` / `InventoryCloseEvent` | ✅ 能（插件开 / 定时关） |
| **`InventoryClickEvent`** | ❌ **不能** —— 需要一次**点击**。三条路：① 人工点（判据已取得）② UI 自动化（**本档不做**）③ 客户端侧 mod 发点击包（可行，未做） |

⚠ 注：`--server`/`--port` 那一对**在 moddev 的 `client` 块里没能自动进服**（客户端停主菜单、日志无 `Connecting`）；**`--quickPlayMultiplayer` 才行**。

## T11 · 让客户端「自己点一下」的**三条坑**（2026-10-16 实测 · 逐层定位 · 已解决）

**目标**：让驱动器在客户端里**自动完成一次真实右键放置**（⇒ 服务端 `BlockPlaceEvent` ⇒ 验官方 `api__pdc.md:226/:228`）。

| # | 现象 | 根因（证据） | 处方 |
|---|---|---|---|
| 1 | 按住 `useKey` 20 tick，**手里箱子一动不动**、服务端**零事件** | `KeyMapping.setDown(boolean)` 的字节码**只有** `putfield isDown` —— **不推 `clickCount`**；而 `Minecraft.handleKeybinds()` 对 use/attack/pickItem 是 `while (options.keyX.consumeClick())` ⇒ **只 setDown 永不触发**（移动键没事，它读 `isDown()`） | 走真入口：静态 `KeyMapping.click(client.options.keyX.getKey())`（`getKey()` = 当前绑定键，尊重改键）。attack 另需 `setDown(true)` 保持 —— 继续破坏靠 `isDown()` |
| 2 | 补上 `KeyMapping.click` 后**仍然没放出去**；推断"`handleKeybinds` 没跑"，**被自己的诊断推翻**（`winActive=true`） | 动作键需要走**更下层**的交互 API | `MultiPlayerGameMode.useItemOn(LocalPlayer, InteractionHand, BlockHitResult)` / `useItem(Player, InteractionHand)`（`Minecraft.gameMode`/`hitResult` 是 **public 字段**；vanilla 的 `Minecraft.startUseItem()` 是 **private** 调不到） |
| 3 | `useItemOn` 返回 **`Fail`** ⇒ **静默**、不发包 | ① 先排除其**唯一早期 Fail**（世界边界）：实测 `inBorder=true`（`6e7@0,0`）⇒ 不成立；② 真因是 **26.x 客户端预测**（`startPrediction` → `performUseItemOn`）：**放置位与玩家碰撞箱重叠**即判 Fail；③ **转视角无效**——实测 20 条诊断的 `loc` **一字不差** ⇒ `client.hitResult` 在该运行时**是冻住的**，而刷新它的 `Minecraft.pick(float)` 是 **private** | **自算射线**：`player.pick(4.5, 1.0f, false)`（`Entity.pick(double,float,boolean)` 是 **public**，`LocalPlayer` 继承）⇒ 拿新鲜 `BlockHitResult` 交给 `useItemOn`，并回填 `client.hitResult`。**这不是造包**：用的就是游戏内部那套射线投射 |

**结果**（同一轮）：20 条诊断里 **13 条 `Success[swingSource=PREDICTED, … heldItemTransformedTo=1 minecraft:chest]`** ⇒ 服务端 `BlockPlaceEvent` ⇒ **`v-pdc-place.ok`** ✅

**三条通用教训**：

- **`setDown` 只能驱动"读 `isDown()` 的"输入**（移动/潜行/冲刺）；**"读 `consumeClick()` 的"动作键**（use / attack / pickItem）必须走 `KeyMapping.click(...)` 或直接调交互 API。
- **"改视角再交互"在连服档不可靠** —— `hitResult` 可能是陈旧的；**要新鲜命中就自己 `pick()`**。
- **客户端预测会静默否决**：`Fail` 就**不发包** ⇒ 服务端**什么痕迹都没有**（无事件、无日志）⇒ **判据里必须带客户端侧的返回值**，否则只能对着"什么都没有"无限猜。

## T12 · 查「区块里的实体」必须用 **`Chunk#getEntities()`**，`World#getEntities()` 会给假否定（2026-10-17）

**现象**：实体明明已落盘、也明明在区块里，但 `world.getEntities()` 一直返回 **0** ⇒ 连续几轮判成「实体没保存」，其实是**判据取错 API**。

**决定性诊断行**（同一时刻、同一进程）：

```
[PROBE] entity diag: chunk=-4,3 chunkEntities=34 allWorldsEntities=0 spawn=-64,97,48
                            ↑ Chunk#getEntities()        ↑ World#getEntities()
```

⇒ **无玩家的服务端上 `World#getEntities()` 不可靠**（返回 0），**必须用 `Chunk#getEntities()`**（并先 `chunk.load(true)`）。

**同一项上还踩出两条必要条件**：

1. **`spawnEntity` 之前必须 `world.getChunkAt(x>>4, z>>4)` 加载区块** —— 否则实体被丢进未加载区块并**静默丢弃**（`spawnEntity` 仍返回非 null，你以为成功了）。
2. **实体类型要选"不会自己消失"的**：僵尸会**白天自燃**、掉落物会 **despawn** ⇒ 跨重启测试用 **`ARMOR_STAND`**（不自燃、不 despawn、无 AI 走开）。

**落盘位置也别找错**：26.x 的存档是**按维度分目录** —— `world/dimensions/<ns>/<dim>/{region,entities,data}`（不是老布局 `world/entities/`）。找不到时先看 `world/dimensions/`。

## T13 · 往容器里塞物品必须写**活库存**，`getState()` 是**快照**（2026-10-17）

**现象**：`block.setType(CHEST)` 后，用 `block.getState()` 拿到 `Container`、往 `getInventory().setItem(0, item)` 写，
再 `update(true,false)` —— **重启后那格是空的**（诊断原文：`方块=CHEST 物品=null`）。方块在、库存内容没落盘。

**原因**：`Block#getState()` 返回**快照**；在快照的 `Inventory` 上写，只改内存副本，不会写进 **TileEntity**。

**正解**（javap 实证：`Block#getState(boolean)` 与 `Chest#getBlockInventory()` 都存在）：

```java
BlockState live = block.getState(false);              // ★ 非快照
if (live instanceof Chest) ((Chest) live).getBlockInventory().setItem(0, it);   // ★ 活库存
else { ((Container) live).getInventory().setItem(0, it); live.update(true, false); }
```

⇒ 与 **T12** 是同一类错误：**拿"快照/代办对象"当"活的"用**（T12 是 `World#getEntities()` 只覆盖已加载、T13 是快照库存不落盘）。

## T14 · 有两份 `plan.txt`（服务端 / 客户端各一份），旧剧本里的 `stop` 会让**每次起服都自杀**（2026-10-17）

**现象**：组合跑时服务端**就绪约 15 秒后自己停服**，客户端随即 `Connection refused`（netty 栈），而外部脚本只表现为"客户端日志冻住、等不到裁决"。

**服务端日志逐字**（判据就这两行）：

```
[QA] mark: phase2-start
[QA] DONE stop
[QA] 收工即停服（plan 的 stop 步骤）：20 tick 后 Bukkit.shutdown()
```

**根因**：插件里有**两份**东西 —— **探针** + **服务端 driver**。后者在**每次起服**时读 `<证据目录>/plan.txt` 并照它执行；那份是上一轮两阶段跑留下的旧剧本，**末步是 `stop`** ⇒ driver 调 `Bukkit.shutdown()`。

**处方**：

- **复跑前重写（或清掉）`<证据目录>/plan.txt`**；跑"服务端 + 客户端"组合时，服务端剧本**不要写 `stop`**（只 `mark` + `wait ticks=N`），停服交给外部收尾（`stdin` 写 `stop` / 优雅 kill）。
- ⚠ **别搞混两份剧本**：**服务端** driver 读 `<证据目录>/plan.txt`；**客户端** driver（`temporary_client_tick_driver`）读它自己的 `--evidenceDir` 下的 `plan.txt`（本项目是 `run/qa/plan.txt`）。两个目录、两份剧本，改错一份就等于没改。

## T15 · 客户端 driver 里做「UI 点击」的两条硬约束（2026-10-17 实测）

**背景**：要验 `ClickEvent` 的**点击行为**（服务端必须收到 `/probe-clickable`）。驱动器已经能
**打开 `ChatScreen`**（`client.setScreen(new ChatScreen("", false))` 实测生效，日志 `screen=ChatScreen`），
但下面两条把它卡住：

1. **`stepTicks` 是「轮内 tick」，不是「步内 tick」** ⇒ **不能**用 `if (stepTicks == 1)` 做步骤入口。
   实测：那样写这一步**永不进入**、每 tick 自旋，直到 `budget exhausted (24000 ticks)`；
   用 `stepTicks % 2 == 0` 做节流则**整段一条日志都没有**。⇒ 步骤要么**一次调用做完再 `next()`**，
   要么用**自己的静态计数器**，别读 `stepTicks`。
2. **`ChatScreen` 底部是输入框（`EditBox`），横跨整宽** ⇒ 从 `y = height - 8` 起扫会**全部命中输入框**
   （实测 `hits=5`、同一 y、跨 5 个 x），**点了也不发命令**。消息区在输入框**上方**（从 `height - 46` 起往上，每行 9 px）。

**还没打通的那一步（下次从这继续）**：靠"网格猜坐标"不稳。**正解**是用游戏自己的命中 API ——
`ChatComponent#captureClickableText(ActiveTextCollector, int, int, DisplayMode)`（**javap 实测 public**）：
实现一个极小的 `ActiveTextCollector` 收集 `accept(...)` 的矩形，就能拿到**可点击文本的精确范围**再点。
（`ChatScreen#handleComponentClicked(Style, boolean)` 是 **private**，调不到。）

3. **`ChatScreen.mouseClicked` 判定"点在哪条消息"用的是**真实鼠标位置**，不是合成事件的坐标**
   —— 实测对照：合成事件点**底部输入框**（`y = height - 8`）能命中 **5 次**（widget 命中用事件坐标）；
   点**消息区**（`y = height - 46` 起）**`hits = 0`**，120 个点全空。
   ⇒ 要在消息区命中，得先**移动"内部鼠标"**再点。**正确写法**（javap 取证 · **不会动 OS 光标**）：

   ```java
   // MouseHandler.xpos/ypos 是私有字段；onMove 的字节码只有 putfield，类内无任何 glfwSetCursorPos ⇒ OS 光标不动
   double gs = client.getWindow().getGuiScale();                 // 命中用缩放后坐标，onMove 收原始坐标
   client.mouseHandler.onMove(client.getWindow().handle(), x * gs, y * gs, 0.0, 0.0);   // dx/dy=0：否则关屏后视角被带飞
   screen.mouseClicked(new MouseButtonEvent(x, y, new MouseButtonInfo(0, 0)), false);
   ```
   **实测结论（2026-10-17 收尾 · 已试尽）**：命中的 **7 次全在同一个 y**（`h-12 = 228`，x 从 8 到 200 整行），
   而**消息带**（`h-21 / h-30 / h-39` = 219/210/201）**一次都不中** ⇒ 那一行是 `ChatScreen` 的**输入框（EditBox）**带，
   **不是消息**。把可点击消息**补发为最底行**也无效。
   ⇒ **判定**：**`ChatScreen.mouseClicked` 到不了"消息命中"那条路径**（26.x 的消息点击走 **ActiveText 收集器**那一套），
   所以"合成点击 + 猜坐标"这条路**结构上走不通**。
   **再补一步也无效**（2026-10-18 收尾）：加上 **`screen.mouseMoved(x, y)`**（Screen 自己缓存的 mouseX/mouseY）
   之后**仍然只命中 `y = 228` 那一行**（输入框带），消息带 **0**。
   ⇒ 最终判定：26.x 的**消息点击在渲染期的 `ActiveTextCollector` 里完成**，`mouseClicked` 到不了；
   而 **`ChatComponent` 实例不可达**（javap：`Gui` 只有 `openChatScreen/openChatAndAddText`、`Minecraft` 只有 `ChatListener`，
   **都没有 `getChat()`**）⇒ **收集器路线也断**。
   ⇒ **本 harness（无 mixin 的外部 tick driver）无法验证 `ClickEvent` 的点击行为**；要验得 **mixin/ASM 注入
   `ChatScreen#render` 那段收集器**（或注入 `getStyleAt`）。这条结论到此为止，别再花循环试坐标。

## 未核实（明写 —— 本档不含通识推断，凡没实测的一律在此）

- **本档全部实测都在同一台机 / 同一网络**（Windows 11 + JDK 25 + Paper 26.3-190），**跨平台/跨版本的可复现性未核**。
- **`gradlew runClient` 的自动进服只在一种参数下验过**（`--quickPlayMultiplayer`）；`--server`/`--port` 那一对在 moddev 的 `client` 块里**没能自动进服**（现象见 **T9 附**）。

## T3 的**权威格式来源**（2026-10-16 补）

不靠猜、也不靠 wiki：**服务端件里就带着第一方 datapack JSON**：

```
data/minecraft/worldgen/flat_level_generator_preset/classic_flat.json     （实测件内 10 个预设）
```

`classic_flat.json` 全文（**`paper-26.3.jar` 里原文**）：

```json
{
  "display": "minecraft:grass_block",
  "settings": {
    "biome": "minecraft:plains",
    "features": false,
    "lakes": false,
    "layers": [
      { "block": "minecraft:bedrock",     "height": 1 },
      { "block": "minecraft:dirt",        "height": 2 },
      { "block": "minecraft:grass_block", "height": 1 }
    ],
    "structure_overrides": "minecraft:villages"
  }
}
```

⇒ **`generator-settings` 就填它的 `settings` 对象**（**不含外层 `display`**）。⚠ 我先前从 `javap` 的字段名**推**出来的最小形式（只有 `layers`+`biome`）**能跑通**，但**推不出** `features` / `lakes` / `structure_overrides` 这三个字段 —— **这正是"权威源"比"从签名推"多给的东西**。

**件里其余 9 个预设**（可直接借用其 `settings`）：`bottomless_pit` · `desert` · `overworld` · `redstone_ready` · `snowy_kingdom` · `the_void` · `tunnelers_dream` · `water_world`（+ `visible` 标签列出前 9 个可见项）。

## T3 的正解（**已验，2026-10-15**）

**权威结构从哪来**：不是猜的、也不是抄的 —— 是 **`javap` 消费 `generator-settings` 的那个类**（`paper-26.3.jar` 里就有）：

```java
public static final Codec<FlatLevelGeneratorSettings> CODEC;
private final List<FlatLayerInfo> layersInfo;   // ← 报错原文点名的必填键就是 "layers"
private final Holder<Biome> biome;
private boolean decoration;
private final List<Holder<PlacedFeature>> lakes;
// FlatLayerInfo：private final Holder<Block> block;   private final int height;
```

**用的 settings**（`server.properties` 里 `:` 要转义）：

```
level-type=minecraft\:flat
generator-settings={"layers":[{"block":"minecraft:bedrock","height":1},{"block":"minecraft:dirt","height":2},{"block":"minecraft:grass_block","height":1}],"biome":"minecraft:plains"}
```

**判定（两个条件缺一不可）**：

| 条件 | 实测 |
|---|---|
| 世界**真是全新建的**（否则测不到那段代码） | `No existing world data, creating new world` = **true** |
| `No key layers` 消失 | **false**（不再出现） |

⇒ **原「T3 的正解未验」关闭**。键名 `layers` 来自**报错原文**，`block`/`height`/`biome` 来自**字段名** —— 三者经这次跑一并验过。
- **本档全部实测都在同一台机 / 同一网络**（Windows 11 + JDK 25 + Paper 26.3-190），**跨平台/跨版本的可复现性未核**。

## 已核掉的旧未核实项（2026-10-15，逐条带证据）

| 原项 | 结果 |
|---|---|
| **T1/T2**：更低版本 `paper-api` 能否在 JDK 21 上编 | ✅ **能**。取 `paper-api-1.21.4-R0.1-20250925.065901-231`（2.44 MB · 从 `repo.papermc.io` 的 SNAPSHOT metadata 解出精确件名），**JDK 21 编得过 `rc=0`**；JDK 25 也过。**JDK 17/16/8 全 `cannot access Bukkit`**（太老，读不了 class file） |
| **T4**：控制台编码修法 | ✅ **部分**。给 JVM 传 **`-Dfile.encoding=UTF-8`** 后**日志里含可读中文**（判据：子进程 stdout 按 UTF-8 解出的文本含 CJK）。⚠ 这**不是"控制台显示"那一半** —— 我看到的 `��` 是 PowerShell 显示层 |
| **T5**：替代取件口 | ✅ **已探**：`api.papermc.io/v2` → **HTTP 410 sunset** · `v3` → **403** · **`fill.papermc.io/v3` → 200**（**唯一可用口**）；`fill-data.papermc.io/` 根 **404**（只有具体对象路径可用）。**附带一条更普适的**：`net.md-5:bungeecord-chat` 在 **Maven Central 404**，**须走 `repo.papermc.io/repository/maven-public`**（实测 200 · 168,064 B）⇒ **Central 缺的 Paper 系依赖去 Paper repo 找** |
| **T7**：加门抓"模板体内反引号" | ✅ **已建并挂链**：`mcp-server/scripts/assert-generator-template-safety.mjs`（已进 S4 `REAL_RUN_GATES`，S4 自印 P===K=82/82） |

⚠ **T1/T2 的矩阵里有一行是我脚本的污染，不能当证据**：`javac(21) × paper-api-26.3 → rc=0` —— 那次 classpath 把**两个** paper-api 都放进去了，字典序让 `paper-api-1.21.4-old.jar` **先被解析** ⇒ 掩盖了"26.3 需 JDK 25"。**"26.3 需 JDK 25"这条结论不受影响，但那行无效。**

> **T6 已移出未核实 —— 2026-10-15 真机两侧都跑出来了**：判红时**不停服**这条是**实测**的，不是"代码里写的"猜测。证据：探针首轮 `assert marker` 判红 ⇒ 驱动**没有**调停服、服务端一直挂着，直到 runner 的 240 秒超时把它强杀（`java rc=null err=ETIMEDOUT`）；第二轮四项全绿 ⇒ `stop` 生效 ⇒ **`java rc=0` 优雅退出**。**红/绿两侧的停服行为各跑出一次。**
