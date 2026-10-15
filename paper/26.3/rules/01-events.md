# 01 — 事件

## 三步（处方）

1. 监听器类 **implements `Listener`**
2. 处理方法标 **`@EventHandler`**
3. 在 `onEnable` 里注册：`Bukkit.getPluginManager().registerEvents(this, this);`

出处（逐字）：
- `PluginManager.md:24` — `void registerEvents(@NotNull Listener listener, @NotNull Plugin plugin)`
- `EventHandler.md:12` — `@Target(METHOD) @Retention(RUNTIME) public @interface EventHandler`
- `EventHandler.md:13-14` — 两个成员：`EventPriority priority` · `boolean ignoreCancelled`

## 优先级：**6 档，全是常量**

`EventPriority.md:13-18`：

```
LOWEST · LOW · NORMAL · HIGH · HIGHEST · MONITOR
```

`ignoreCancelled` 是可选的布尔（`EventHandler.md:14`）—— 事件已被取消时要不要仍收到回调。

## 拿事件的当事人（**已核，2026-10-15**）

| 出处 | 签名 |
|---|---|
| `PlayerEvent.md:15` | `@NotNull public final Player getPlayer()` |
| `PlayerJoinEvent.md:14` | `@Nullable public String getJoinMessage()` |

⚠ **`getPlayer()` 在父类 `PlayerEvent` 上，不在具体事件类上** —— 我先前写「`PlayerJoinEvent#getPlayer`」的引法是错的。找 getter 要**沿继承链看**（签名页只列本类**声明**的成员）。

## 优先级语义（**官方出处已核，2026-10-15**）

`api__event-api__event-listeners.md`：

| 行 | 官方原文要点 |
|---|---|
| `:88-94` | "There are **six** different priorities"，逐个点名 `LOWEST`…`MONITOR` |
| `:96-98` | "The order of the priorities is somewhat counter-intuitive. The **higher** the priority, the **later** the event is called."（要高优先权 ⇒ 用 `HIGHEST`，它最后说） |
| `:100-103` | **note**："The `MONITOR` priority is used to **monitor the event, but not change it**. It is called after all other priorities have been called. This means you can get the result of any plugin interaction such as cancellation or modification." |
| `:130-131` | 事件被取消后**仍会**继续调后续监听器，除非标 `ignoreCancelled = true` |

⚠️ **我先前把"MONITOR 只能观测"写成「本仓无从核实」是错的** —— 官方文档有逐字说明。错因见 `rules.meta.json` 的 `searchTrap`：**我在 `data/**` 下按目录搜索时没给 `glob`**，得到假的 0 命中（同目录同词，给了 `glob` 就命中 44 个文件）。**是我的调用姿势问题，不是搜索工具坏了** —— 但结论一样：**别拿一次目录搜索的 0 命中当否定证据**。

## 服务端 tick 事件（**已核，2026-10-15**）

Paper 有服务端 tick 事件面 —— 在 `data/paper-api_stable/paper-javadoc/stable/processed/` 里搜 `ServerTick` 命中 **7 个文件**，其中两个就是事件类：

| 文件（＝FQCN，扁平成文件名） | 说明 |
|---|---|
| `com_destroystokyo_paper_event_server_ServerTickStartEvent.md` | 服务端 tick **开始** |
| `com_destroystokyo_paper_event_server_ServerTickEndEvent.md` | 服务端 tick **结束** |

⚠️ **我先前写的类名 `ServerTickEvents` 不存在** —— 那是我凭记忆编的。**真名是 `…ServerTickStartEvent` / `…ServerTickEndEvent`**（包 `com.destroystokyo.paper.event.server`）。要用就照上表这两个名字，**别照我先前那句记**。

（另有 `org_bukkit_ServerTickManager.md` / `org_bukkit_Server.md` 也含 `ServerTick` 字样，是 tick 率控制与 Server 接口，**不是事件**。）

## 真机侧已验证（2026-10-15，Paper 26.3-190 / JDK 25）

探针 `VerifyProbe` 里 `registerEvents(this, plugin)` + `@EventHandler` 的**派发链真机跑通** —— 落 `<证据目录>/v-event.ok`，内容：`ServerCommandEvent 收到: say probe-event`。

⚠️ **但同一轮测出一条反直觉事实**（已记为 `09-traps.md` 的 **T8**）：驱动器的 `cmd` verb 底层走 `Bukkit.dispatchCommand(consoleSender, …)`，**它不触发 `ServerCommandEvent`** —— 命令同步执行、返回 `true`，监听器却收不到。⇒ **"发命令"与"事件派发"在服务端是两条路。**

## 未核实（**别把我没验的当结论**）

- 其余事件的 **getter 名**本档**未逐个核**（已给第四例 `PlayerInteractEvent`，见下）—— 要用就查：`get_doc_full platform=spigot id=stable/<fqcn 扁平化>`

## 又一批 getter（**已核，2026-10-15**）

`PlayerInteractEvent.md`：

| 行 | 签名 |
|---|---|
| `:20` | `@NotNull public Action getAction()` |
| `:23` | `@Nullable public ItemStack getItem()` |
| `:28` | `@Nullable public Block getClickedBlock()` |

⚠ **`getPlayer()` 又不在这两个类上**（我搜 `PlayerInteractEvent` 的 `getPlayer` **0 命中**）⇒ 它在**父类 `PlayerEvent`**。**这是本档第四次撞上"签名页只列本类声明的成员"**（前三次：`PlayerEvent` / `InventoryOpenEvent`+`InventoryCloseEvent` 的 `getView` / `World` 的 `getPersistentDataContainer`）。⇒ **找 getter 一律先看继承链。**
- （**已纠正，见下方「服务端 tick 事件」小节**）~~`ServerTickEvents` 搜不到~~ —— 那是**我的类名错**，不是"Paper 没有这个面"。详见上一条与 `rules.meta.json` 的 `searchTrap`。
- （玩家类事件已验，见下）

## 玩家类事件（**已真机核，2026-10-15 · 真客户端**）

用的是**真 26.3 客户端**（`F:/MC_GAME/neoforge-26.3` 的 NeoForge moddev `runClient`；协议与 26.3 服务端一致）。玩家 `Dev` 手动连入后：

| 事件 | 实测（marker） |
|---|---|
| **`PlayerJoinEvent`** | 派发 ✔ · `getPlayer().getName()` = **`Dev`** —— 这是**真·自发派发**（服务端在登录流程里自己调的，不是 `callEvent`） |

服务端日志同时给出更硬的原始行：
```
[22:19:27] Dev[/127.0.0.1:50472] logged in with entity id 21 at ([minecraft:overworld]14.5, 64.0, -2.5)
```

⇒ 这**取代**了原「玩家相关事件的自发派发未测」这一项。

## 自发派发（**已真机核，2026-10-15 二轮**）

**不需要玩家**的自发事件已验：`ServerTickStartEvent`（Paper 专有，包 `com.destroystokyo.paper.event.server`）**每 tick 派发一次**。探针在**无任何玩家在线**的情况下收到，落 marker `v-event-tick.ok`。

⇒ 这**部分取代**了原「事件"自发"派发的时机未测」那项（**tick 类自发事件验过了；玩家类没有**）。

**目前已实测的派发路径**（完整对照见 `09-traps.md` 的 **T8**）：

| 路径 | 是否派发 |
|---|---|
| 手动 `callEvent(...)` | ✔ |
| **服务端 stdin（控制台输入）** | ✔ |
| `Bukkit.dispatchCommand(...)` | ✘ |
