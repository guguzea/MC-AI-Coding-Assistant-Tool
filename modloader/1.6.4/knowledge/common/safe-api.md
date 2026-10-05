# 1.6.4 ModLoader 安全 API 表

来源：Risugami's ModLoader 公开 API + MCP 1.6.4 named（写规则时核对）。**表外禁止输出。**

> ⚠️ **历史背景**：Risugami 自 **MC 1.6.2（2013 年）起停止更新 ModLoader**（FML FAQ 原文 "Risugami retired from updating ModLoader with the 1.6.2 minecraft release, in 2013"），**不存在官方 ModLoader 1.6.4 发布物**。本档基于公开 API 源码与 MCP 1.6.4 named 映射整理，仅供维护既有 1.6.4 整合/魔改包；新工程请用 Forge。

## BaseMod（`mod_<Name> extends BaseMod`）

| 方法 | 说明 |
|------|------|
| `public String getVersion()` | 版本字符串 |
| `public void load()` | 加载期 |
| `public void modsLoaded()` | 全部 mod 已 load 之后 |
| `public String getName()` | 显示名（若实现） |

## ModLoader

| 方法 | 说明 |
|------|------|
| `ModLoader.addRecipe(ItemStack, Object...)` 🟡 | 有序合成（公开索引覆盖缺口，内部与已证实半表一致；标 🟡 不删） |
| `ModLoader.addShapelessRecipe(ItemStack, Object...)` 🟡 | 无序合成（公开索引覆盖缺口；标 🟡 不删） |
| `ModLoader.addName(Object, String)` | 语言名 |
| `ModLoader.addLocalization(String, String)` | 本地化键 |
| `ModLoader.registerBlock(Block)` | 注册方块 |
| `ModLoader.registerBlock(Block, Class)` 🟡 | 带 ItemBlock（公开索引覆盖缺口；标 🟡 不删） |
| `ModLoader.registerTileEntity(Class, String)` | TileEntity |
| `ModLoader.addSpawn(Class, int, int, int, EnumCreatureType)` 🟡 | 生物生成（公开索引覆盖缺口；标 🟡 不删） |
| `ModLoader.getUniqueEntityId()` | 实体网络 ID |
| `ModLoader.setInGameHook(BaseMod, boolean, boolean)` | 游戏内 tick 钩子 |
| `ModLoader.setInGUIHook(BaseMod, boolean, boolean)` | GUI 钩子 |

## 常用 Vanilla（MCP named，1.6.4）

`ItemStack`, `Block`, `Item`, `World`, `World.setBlock`, `World.getBlockId`

不在表内：停止生成，请补表或提供 `decompile_mod_jar` 缓存。

## 桥路线可行性核对：**tick 钩子在，其余还差 6 项（2026-10-04）**

**好消息**：本表已有 tick 钩子出处 —— `ModLoader.setInGameHook(BaseMod, boolean, boolean)`（行 29）。

**但「tick 钩子有出处」只是桥的 6 项前置之一**。桥还需要下面这些，而**本档目前一项都没有**：

| 桥需要的 | 本档状态 |
|---|---|
| tick 钩子 | ✅ `ModLoader.setInGameHook(BaseMod, boolean, boolean)`（+ `setInGUIHook`） |
| 客户端单例（不靠 MCP，逐版本名不同） | ❌ 未核 |
| 玩家对象 / 位置字段（1.6.4 的字段名**不能按 1.7.10 推**） | ❌ 未核（本表只写「常用 Vanilla：`ItemStack` `Block` `Item` `World` `World.setBlock` `World.getBlockId`」） |
| 发聊天 / 发命令 | ❌ 未核 |
| 截图 API | ❌ 未核（1.6.4 的截图路径与 1.7.10 不是同一个） |
| 读方块 | ⚠️ 表内有 `World.getBlockId` 名，但**签名与参数形未核**；且「按坐标读方块并回注册名」在 ModLoader 时代**没有注册表名**（`Block` 无 `getRegistryName`）⇒ 只能回数字 id 或类名 |

**构建路径**：本档**无 Gradle 工程形态**（MCP + Eclipse）⇒ 只能「手工 `javac` + 打 jar（含 `mcmod.info`/`mod_*.class`）+ 人工装」。
**本仓不代跑**这一步；要做必须先写一份手工构建说明，并**逐项取证**上面那 5 个 ❌。

**结论**：这一档不是「只差构建路径」，而是**还差 5 类接口出处** + 构建路径。在 ModLoader 已停更（1.6.2 起）、官方文档无稳定落点的现状下，
**优先走替代路线（离线解析存档 + 人工驱动）更划算**；真要自建桥，先补上表那 5 个 ❌（它们展开成**桥的 10 个动作 + `isInWorld`** 共 11 条 throw，逐条清单见下节）。

## 桥模板已出「骨架」（2026-10-04）——**协议半边真、MC 半边全 TODO**

`generate_playtest_driver driverMode=external_bridge platform=modloader version=1.6.4` 现会**附赠**
`playtest/bridge/{mod_examplemod_PlaytestBridge.java, mcmod.info, README.bridge.md}`
（生成器 `mcp-server/src/generators/playtest-bridge-mod.ts`）。

**它是什么**：类 `extends BaseMod`（package `net.minecraft.src`，照 `scaffold/mod_Example.java`），内嵌 `com.sun.net.httpserver`，
线协议与 `playtest_bridge` 逐键一致（`/status` 六键 / `/execute` `{id,status,message,data}` + HTTP 恒 200 / 超时串逐字 `Timeout after 10000ms`）。

**它**不**是什么**：

| 桥前置 | 骨架里的状态 |
|---|---|
| tick 钩子 | ✅ 真：`ModLoader.setInGameHook(this, true, false)`（本表行 29）——**但两个 boolean 的语义未核实** |
| 回调方法名/签名 | ⚠️ `public void onTick()` 是**占位**：本表**没给回调名**；若 ModLoader 反射调的不是它，桥永不 tick（超预算判红，不假绿） |
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

**编译验证强度**：生成物已用 **JDK 8 `javac -encoding UTF-8`** 对 `BaseMod`/`ModLoader` **签名替身**编译通过（exit 0）。
⚠️ **替身只证签名形状、不证类存在** —— 不证明这些类在真实 1.6.4 环境里存在。

**要把它变成真桥**：在自备的 MCP 1.6.4 工作区里核出上表 5 个 ❌（+ 回调名、+ 两个 boolean 语义），
**只改 `Mc` 内部类与 `onTick()` 的签名**，HTTP 半边一行不用动；清单见生成物 `README.bridge.md`。

