# 1.6.4 ModLoader 安全 API 表

来源：Risugami's ModLoader 公开 API + MCP 1.6.4 named（写规则时核对）。**表外禁止输出。**

> ⚠️ **历史背景**：Risugami 自 **MC 1.6.2（2013 年）起停止更新 ModLoader**（FML FAQ 原文 "Risugami retired from updating ModLoader with the 1.6.2 minecraft release, in 2013"），**不存在官方 ModLoader 1.6.4 发布物**。本档基于公开 API 源码与 MCP 1.6.4 named 映射整理，仅供维护既有 1.6.4 整合/魔改包；新工程请用 Forge。
>
> **构件 javap 复核**：官方最后的发布物 **ModLoader 1.6.2**（mcarchive 官方归档；同批取到官方 1.5.2 / 1.2.5）已入库 `F:\MC_GAME\_oracle-jars\modloader\` 并逐类 `javap`；**mcarchive 版本清单独立证实存量最新就到 1.6.2**（无 1.6.4 条目）。下表带「构件复核」的行 = 名字/元数出自真构件，对本档按 **1.6.2 线**的 API 形态落笔。

## BaseMod（`mod_<Name> extends BaseMod`）

| 方法 | 说明 |
|------|------|
| `public String getVersion()` | 版本字符串（构件复核：abstract） |
| `public void load()` | 加载期（构件复核：abstract） |
| `public void modsLoaded()` | 全部 mod 已 load 之后（构件复核） |
| `public String getName()` | 显示名（若实现；构件复核：**非 abstract**，带默认实现） |
| `public boolean onTickInGame(float, Minecraft)` | **每 tick 回调**（构件复核：1.2.5/1.5.2/1.6.2 三件均在；1.2.5/1.5.2 构件第二参逐字 `net.minecraft.client.Minecraft`，1.6.2 为混淆名 `ats`）。**返回 boolean**（返回值语义未核） |
| `public boolean onTickInGUI(float, Minecraft, GuiScreen)` | GUI tick 回调（构件复核，同上；1.6.2 第三参混淆名 `awb`） |
| `public void clientChat(String)` / `serverChat(?, String)` | 聊天回调（构件复核：名字三件都在；**触发语义未核**。1.2.5 线的同族名不同：`receiveChatPacket(String)` / `receiveCustomPacket(?)`） |

## ModLoader

| 方法 | 说明 |
|------|------|
| `ModLoader.addRecipe(ItemStack, Object...)` | 有序合成（构件复核：三件均在，首参在构件里是混淆类名 `yd`/`wm`/`aan` = ItemStack 位） |
| `ModLoader.addShapelessRecipe(ItemStack, Object...)` | 无序合成（构件复核，同上） |
| `ModLoader.addName(Object, String)` | 语言名（构件复核：另有三参重载 `(Object, String, String)`） |
| `ModLoader.addLocalization(String, String)` | 本地化键（构件复核：另有三参重载） |
| `ModLoader.registerBlock(Block)` | 注册方块（构件复核） |
| `ModLoader.registerBlock(Block, Class)` | 带 ItemBlock（构件复核） |
| `ModLoader.registerTileEntity(Class, String)` | TileEntity（构件复核：另有第三参 `(Class, String, TileEntitySpecialRenderer)` 重载） |
| `ModLoader.addSpawn(Class, int, int, int, EnumCreatureType)` | 生物生成（构件复核：另有 `(String, …)` 与带 biome 数组重载，1.6.2 共 4 形；枚举参数混淆名 `og`/`nn`/`acf`） |
| ~~`ModLoader.getUniqueEntityId()`~~ **不存在** | ❌ **勘误（构件复核）**：1.6.2 / 1.5.2 构件**没有**此方法（仅 1.2.5 有 `public static int getUniqueEntityId()`）⇒ 1.6.x 线实体注册改用 `ModLoader.registerEntityID(Class, String, int[, int, int])`（构件复核） |
| `ModLoader.setInGameHook(BaseMod, boolean, boolean)` | 游戏内 tick 钩子（构件复核；**两个 boolean 的语义仍未核**） |
| `ModLoader.setInGUIHook(BaseMod, boolean, boolean)` | GUI 钩子（构件复核） |
| `ModLoader.getMinecraftInstance()` | **客户端单例取法（构件复核）**：1.2.5/1.5.2 构件返回类型逐字 `net.minecraft.client.Minecraft`；1.6.2 为混淆名 `ats` |

## 常用 Vanilla（MCP named，1.6.4）

`ItemStack`, `Block`, `Item`, `World`, `World.setBlock`, `World.getBlockId`

不在表内：停止生成，请补表或提供 `decompile_mod_jar` 缓存。

## 桥路线可行性核对：**tick 钩子 + 回调名 + 客户端单例已取得，其余还差 4 项（构件复核后）**

**新增出处（构件 javap 实证）**：

- **回调实名**：`BaseMod.onTickInGame(float, Minecraft) → boolean`（原「没给回调名」的缺口就此销账；桥骨架里占位的 `onTick()` 是错名）
- **客户端单例**：`ModLoader.getMinecraftInstance()`（1.2.5/1.5.2 构件返回类型逐字 `net.minecraft.client.Minecraft`）
- tick 钩子注册：`ModLoader.setInGameHook(BaseMod, boolean, boolean)`（+ `setInGUIHook`；三件构件均在）

**仍缺（4 项，均因缺 MCP 1.6.4 named 工作区）**：

| 桥需要的 | 本档状态 |
|---|---|
| 玩家对象 / 位置字段（1.6.4 的字段名**不能按 1.7.10 推**） | ❌ 未核（本表只写「常用 Vanilla：`ItemStack` `Block` `Item` `World` `World.setBlock` `World.getBlockId`」） |
| 发聊天 / 发命令 | ⚠️ 名字在（`ModLoader.clientChat(String)` / `BaseMod.clientChat` 回调同族），**触发语义未核**；发命令入口未核 |
| 截图 API | ❌ 未核（1.6.4 的截图路径与 1.7.10 不是同一个） |
| 读方块 | ⚠️ 表内有 `World.getBlockId` 名，但**签名与参数形未核**；且「按坐标读方块并回注册名」在 ModLoader 时代**没有注册表名**（`Block` 无 `getRegistryName`）⇒ 只能回数字 id 或类名 |

**构建路径**：本档**无 Gradle 工程形态**（MCP + Eclipse）⇒ 只能「手工 `javac` + 打 jar（含 `mcmod.info`/`mod_*.class`）+ 人工装」。
**本仓不代跑**这一步；要做必须先写一份手工构建说明，并**逐项取证**上面 4 项。

**结论**：与此前相比少了两类出处（回调名、客户端单例）；仍差的 4 项都在 MC 侧字段 / 渲染 / 背包面，需要 MCP 1.6.4 named 工作区。
**替代路线（离线解析存档 + 人工驱动）在本档仍更划算**；真要自建桥，先补上表 4 项（它们展开成**桥的 10 个动作 + `isInWorld`** 里尚未落地的 throw，逐条清单见下节）。

## 桥模板已出「骨架」——**协议半边真、MC 半边全 TODO**

`generate_playtest_driver driverMode=external_bridge platform=modloader version=1.6.4` 现会**附赠**
`playtest/bridge/{mod_examplemod_PlaytestBridge.java, mcmod.info, README.bridge.md}`
（生成器 `mcp-server/src/generators/playtest-bridge-mod.ts`）。

**它是什么**：类 `extends BaseMod`（package `net.minecraft.src`，照 `scaffold/mod_Example.java`），内嵌 `com.sun.net.httpserver`，
线协议与 `playtest_bridge` 逐键一致（`/status` 六键 / `/execute` `{id,status,message,data}` + HTTP 恒 200 / 超时串逐字 `Timeout after 10000ms`）。

**它**不**是什么**：

| 桥前置 | 骨架里的状态 |
|---|---|
| tick 钩子 | ✅ 真：`ModLoader.setInGameHook(this, true, false)`（本表行 29）——**但两个 boolean 的语义未核实** |
| 回调方法名/签名 | ✅ 已核（构件）：`public boolean onTickInGame(float, Minecraft)`；骨架里原占位的 `onTick()` 已按此改名（1.5.2/1.2.5 构件第二参可读名；1.6.2 为混淆名 `ats`） |
| MC 半边（`Mc` 内部类，**10 动作 + `isInWorld` 共 11 条**） | ❌ 逐条 `throw new UnsupportedOperationException("TODO(未核实)：…")` |

`Mc.execute(...)` 逐动作抛 TODO 的清单（与真模板动作面对齐）：

| 动作 | 骨架状态 |
|---|---|
| `query_player_state` | ❌ 玩家位置/朝向/落地/血量 |
| `chat_command` | ❌ 发聊天 / 发命令 |
| `screenshot` | ❌ 截图 API |
| `block_at` | ❌ 按坐标读方块（含取值方法与参数形） |
| `query_inventory_slot` | ❌ 背包取槽（`InventoryPlayer` / `ItemStack` 的名字与取槽方法） |
| `query_inventory` | ❌ 背包遍历（同上） |
| `query_nearby_entities` | ❌ 世界实体列表 + 实体位置/取名 |
| `query_chat_history` | ❌ 聊天接收钩子（ModLoader 时代是否有可用事件未知） |
| `use_item` | ❌ 右键使用入口（`PlayerController` 之类） |
| `query_screen` | ❌ 当前界面字段/取值 |
| `isInWorld`（`/execute` 前置门） | ❌ 所在世界判定 |

⇒ `/status` 可用（能证明桥进程活着），**`/execute` 十个动作一律 fail-closed**（返回带 `TODO(未核实)` 的 failure）。
**这是刻意的**：宁可出骨架 + fail-closed，也不拿 1.7.10 / Fabric 的记忆填 1.6.4。骨架的 `ACTIONS` 字符串已列全 10 个动作名（形状对齐真桥，便于对照），但每个都只在 `Mc` 里 throw。

**编译验证强度**：生成物已用 **JDK 8 `javac -encoding UTF-8`** 对 `BaseMod` / `ModLoader` + `Minecraft` **签名替身**编译通过（exit 0）。⚠️ **口径**：首次 exit 0 针对的是**旧回调签名**（`public void onTick()`）的产物，不代表现产物；回调实名更新（`onTickInGame(float, Minecraft)`）后双臂复跑——**未更新的旧替身对现产物报 2 errors**（替身须按本表 复核行补齐 `onTickInGame` / `getMinecraftInstance` / `Minecraft` 类），**补齐替身后 exit 0**（本机记录：`D:\mc-skill-temp\adjud2\mlcheck\` 的 `out-orig` / `out-fixed`）。
⚠️ **替身只证签名形状、不证类存在**；**类存在性另有真构件**：`F:\MC_GAME\_oracle-jars\modloader\` 里的官方 1.2.5 / 1.5.2 / 1.6.2 zip 已逐类 `javap`（见本表 复核行）。

**要把它变成真桥**：在自备的 MCP 1.6.4 工作区里核出上表剩余 4 项（玩家字段 / 聊天语义 / 截图 / 读方块签名）+ 两个 boolean 语义，
**只改 `Mc` 内部类**（回调名与签名已按构件实证填好），HTTP 半边一行不用动；清单见生成物 `README.bridge.md`。

