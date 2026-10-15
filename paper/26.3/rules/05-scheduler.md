# 05 — 调度器

取调度器：`Bukkit.md:63` — `@NotNull public static BukkitScheduler getScheduler()`

## 六个执行入口（逐字，全核过）

`BukkitScheduler.md`：

| 行 | 签名 | 语义 |
|---|---|---|
| `:29` | `@NotNull BukkitTask runTask(@NotNull Plugin, @NotNull Runnable) throws IllegalArgumentException` | 下一个 tick，同步 |
| `:35` | `@NotNull BukkitTask runTaskLater(@NotNull Plugin, @NotNull Runnable, long delay) throws IllegalArgumentException` | 延迟，同步 |
| `:41` | `@NotNull BukkitTask runTaskTimer(@NotNull Plugin, @NotNull Runnable, long delay, long period) throws IllegalArgumentException` | 周期，同步 |
| `:32` | `@NotNull BukkitTask runTaskAsynchronously(@NotNull Plugin, @NotNull Runnable) throws IllegalArgumentException` | **异步** |
| `:38` | `… runTaskLaterAsynchronously(Plugin, Runnable, long delay)` | **异步**+延迟 |
| `:44` | `… runTaskTimerAsynchronously(Plugin, Runnable, long delay, long period)` | **异步**+周期 |

**每个都 `throws IllegalArgumentException`** ⇒ 参数非法（如 period ≤ 0）是**抛**，不是静默降级。

## 从签名本身读得出的两条（不是经验）

1. **别用 `BukkitRunnable` 重载**：**六个入口各有一条**第三形态 `runTaskXxx(Plugin, BukkitRunnable, …)`，它们都标着 **`@Deprecated(since="1.7.10")`**，行号为 **`:31` · `:34` · `:37` · `:40` · `:43` · `:46`**（依次对应 runTask / runTaskAsynchronously / runTaskLater / runTaskLaterAsynchronously / runTaskTimer / runTaskTimerAsynchronously）。`Runnable` 版与 `Consumer<? super BukkitTask>` 版都是非弃用的当前形态。
2. **拿到的 `BukkitTask` 能取消**：`BukkitTask.md:17` `void cancel()`；`BukkitTask.md:13` `int getTaskId()`，配 `BukkitScheduler.md:26` `boolean isQueued(int taskId)`。

**批量收尾**：`BukkitScheduler.md:24` — `void cancelTasks(@NotNull Plugin plugin)`（插件 `onDisable` 时按插件取消全部任务）。

## 实测

- ✅ **`runTaskTimer(plugin, runnable, 1L, 1L)` 在真机上跑通** —— 服务端 driver 的整个 tick 循环就靠它（真 Paper 26.3-190，证据：`[QA]` 十步全执行、`exit-code=0`）。

## 同步 vs 异步（**官方出处已核，2026-10-15**）

`api__scheduler.md`：

| 行 | 官方原文要点 |
|---|---|
| `:70` | "The period in **ticks** between each execution" ⇒ **单位是 tick**（签名里只是 `long`，单位在文档） |
| `:74-81` | 同步任务跑在**主线程**（同一线程处理全部游戏逻辑）；做 web/文件/数据库这类耗时活应考虑异步 |
| `:83-86` | 异步任务跑在**独立线程**，不直接影响服务端性能 |
| `:88-92` | ⚠️ **caution**："**Large portions of the Bukkit API are not safe to use from within asynchronous tasks**. If a method changes or **accesses the world state**, it is not safe to be used from an asynchronous task." |
| `:95-99` | 异步任务**仍由主线程启动** ⇒ 服务端卡顿时会被波及（"20 ticks 不一定正好 1 秒"） |

⇒ **上面这条就是"异步里能调什么"的判据来源**：**改或读世界状态的方法不要在异步里调**。这条我先前标为"未核实"，是错的。

## `Consumer` 重载（**已真机核，2026-10-15**）

```java
Bukkit.getScheduler().runTask(plugin, (BukkitTask t) -> { /* … */ });
```

实测（marker `v-scheduler-consumer.ok`）：**可传 lambda 实参**，且**回调收到的 `BukkitTask` 非空**、`getTaskId()` 返回 `2` ✔

⇒ 这**取代**了原「`Consumer<? super BukkitTask>` 重载的实参写法未在真机试过」这一项。

## 未核实

- `runTaskTimerAsynchronously` 这一支本档未单独试（只试了 `runTaskAsynchronously`）。

## 异步入口（**已真机核，2026-10-15**）

判据不是"没抛异常"，是**回调线程名**：

```java
Bukkit.getScheduler().runTaskAsynchronously(plugin, (BukkitTask t) -> { /* … */ });
```

实测（marker `v-scheduler-async.ok`）：

```
回调线程 = **Craft Scheduler Thread - 3 - PaperQaServer**（主线程名 = **Server thread**）
```

⇒ **回调确实不在主线程** ⇒ `Consumer<? super BukkitTask>` 的**异步**形态成立（同步形态见上一节，`getTaskId()=3`）。这**取代**了原「异步入口未在真机试过」这一项。
