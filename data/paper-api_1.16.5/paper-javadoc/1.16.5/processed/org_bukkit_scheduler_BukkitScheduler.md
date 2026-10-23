---
title: "org.bukkit.scheduler.BukkitScheduler"
package: "org.bukkit.scheduler"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/scheduler/BukkitScheduler.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `int scheduleSyncDelayedTask&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Runnable task, long delay)`
- `@Deprecated int scheduleSyncDelayedTask&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull BukkitRunnable task, long delay)`
- `int scheduleSyncDelayedTask&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Runnable task)`
- `@Deprecated int scheduleSyncDelayedTask&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull BukkitRunnable task)`
- `int scheduleSyncRepeatingTask&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Runnable task, long delay, long period)`
- `@Deprecated int scheduleSyncRepeatingTask&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull BukkitRunnable task, long delay, long period)`
- `@Deprecated int scheduleAsyncDelayedTask&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Runnable task, long delay)`
- `@Deprecated int scheduleAsyncDelayedTask&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Runnable task)`
- `@Deprecated int scheduleAsyncRepeatingTask&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Runnable task, long delay, long period)`
- `@NotNull <T> @NotNull Future<T> callSyncMethod&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Callable<T> task)`
- `void cancelTask&#8203;(int taskId)`
- `void cancelTasks&#8203;(@NotNull @NotNull Plugin plugin)`
- `boolean isCurrentlyRunning&#8203;(int taskId)`
- `boolean isQueued&#8203;(int taskId)`
- `@NotNull @NotNull List<BukkitWorker> getActiveWorkers()`
- `@NotNull @NotNull List<BukkitTask> getPendingTasks()`
- `@NotNull @NotNull BukkitTask runTask&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Runnable task) throws IllegalArgumentException`
- `void runTask&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Consumer<BukkitTask> task) throws IllegalArgumentException`
- `@Deprecated @NotNull @NotNull BukkitTask runTask&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull BukkitRunnable task) throws IllegalArgumentException`
- `@NotNull @NotNull BukkitTask runTaskAsynchronously&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Runnable task) throws IllegalArgumentException`
- `void runTaskAsynchronously&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Consumer<BukkitTask> task) throws IllegalArgumentException`
- `@Deprecated @NotNull @NotNull BukkitTask runTaskAsynchronously&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull BukkitRunnable task) throws IllegalArgumentException`
- `@NotNull @NotNull BukkitTask runTaskLater&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Runnable task, long delay) throws IllegalArgumentException`
- `void runTaskLater&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Consumer<BukkitTask> task, long delay) throws IllegalArgumentException`
- `@Deprecated @NotNull @NotNull BukkitTask runTaskLater&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull BukkitRunnable task, long delay) throws IllegalArgumentException`
- `@NotNull @NotNull BukkitTask runTaskLaterAsynchronously&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Runnable task, long delay) throws IllegalArgumentException`
- `void runTaskLaterAsynchronously&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Consumer<BukkitTask> task, long delay) throws IllegalArgumentException`
- `@Deprecated @NotNull @NotNull BukkitTask runTaskLaterAsynchronously&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull BukkitRunnable task, long delay) throws IllegalArgumentException`
- `@NotNull @NotNull BukkitTask runTaskTimer&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Runnable task, long delay, long period) throws IllegalArgumentException`
- `void runTaskTimer&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Consumer<BukkitTask> task, long delay, long period) throws IllegalArgumentException`
- `@Deprecated @NotNull @NotNull BukkitTask runTaskTimer&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull BukkitRunnable task, long delay, long period) throws IllegalArgumentException`
- `@NotNull @NotNull BukkitTask runTaskTimerAsynchronously&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Runnable task, long delay, long period) throws IllegalArgumentException`
- `void runTaskTimerAsynchronously&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Consumer<BukkitTask> task, long delay, long period) throws IllegalArgumentException`
- `@Deprecated @NotNull @NotNull BukkitTask runTaskTimerAsynchronously&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull BukkitRunnable task, long delay, long period) throws IllegalArgumentException`
- `@NotNull Executor getMainThreadExecutor&#8203;(@NotNull @NotNull Plugin plugin)`
