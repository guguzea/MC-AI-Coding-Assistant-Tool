---
title: "org.bukkit.scheduler.BukkitScheduler"
package: "org.bukkit.scheduler"
source: https://jd.papermc.io/paper/26.3/org/bukkit/scheduler/BukkitScheduler.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface BukkitScheduler**
`public interface BukkitScheduler`
- `int scheduleSyncDelayedTask(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Runnable task, long delay)`
- `@Deprecated(since="1.7.10") int scheduleSyncDelayedTask(@NotNull @NotNull Plugin plugin, @NotNull @NotNull BukkitRunnable task, long delay)`
- `int scheduleSyncDelayedTask(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Runnable task)`
- `@Deprecated(since="1.7.10") int scheduleSyncDelayedTask(@NotNull @NotNull Plugin plugin, @NotNull @NotNull BukkitRunnable task)`
- `int scheduleSyncRepeatingTask(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Runnable task, long delay, long period)`
- `@Deprecated(since="1.7.10") int scheduleSyncRepeatingTask(@NotNull @NotNull Plugin plugin, @NotNull @NotNull BukkitRunnable task, long delay, long period)`
- `@Deprecated(since="1.4.5") int scheduleAsyncDelayedTask(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Runnable task, long delay)`
- `@Deprecated(since="1.4.5") int scheduleAsyncDelayedTask(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Runnable task)`
- `@Deprecated(since="1.4.5") int scheduleAsyncRepeatingTask(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Runnable task, long delay, long period)`
- `@NotNull <T> @NotNull Future<T> callSyncMethod(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Callable<T> task)`
- `void cancelTask(int taskId)`
- `void cancelTasks(@NotNull @NotNull Plugin plugin)`
- `boolean isCurrentlyRunning(int taskId)`
- `boolean isQueued(int taskId)`
- `@NotNull @NotNull List<BukkitWorker> getActiveWorkers()`
- `@NotNull @NotNull List<BukkitTask> getPendingTasks()`
- `@NotNull @NotNull BukkitTask runTask(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Runnable task) throws IllegalArgumentException`
- `void runTask(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Consumer<? super BukkitTask> task) throws IllegalArgumentException`
- `@Deprecated(since="1.7.10") @NotNull @NotNull BukkitTask runTask(@NotNull @NotNull Plugin plugin, @NotNull @NotNull BukkitRunnable task) throws IllegalArgumentException`
- `@NotNull @NotNull BukkitTask runTaskAsynchronously(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Runnable task) throws IllegalArgumentException`
- `void runTaskAsynchronously(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Consumer<? super BukkitTask> task) throws IllegalArgumentException`
- `@Deprecated(since="1.7.10") @NotNull @NotNull BukkitTask runTaskAsynchronously(@NotNull @NotNull Plugin plugin, @NotNull @NotNull BukkitRunnable task) throws IllegalArgumentException`
- `@NotNull @NotNull BukkitTask runTaskLater(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Runnable task, long delay) throws IllegalArgumentException`
- `void runTaskLater(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Consumer<? super BukkitTask> task, long delay) throws IllegalArgumentException`
- `@Deprecated(since="1.7.10") @NotNull @NotNull BukkitTask runTaskLater(@NotNull @NotNull Plugin plugin, @NotNull @NotNull BukkitRunnable task, long delay) throws IllegalArgumentException`
- `@NotNull @NotNull BukkitTask runTaskLaterAsynchronously(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Runnable task, long delay) throws IllegalArgumentException`
- `void runTaskLaterAsynchronously(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Consumer<? super BukkitTask> task, long delay) throws IllegalArgumentException`
- `@Deprecated(since="1.7.10") @NotNull @NotNull BukkitTask runTaskLaterAsynchronously(@NotNull @NotNull Plugin plugin, @NotNull @NotNull BukkitRunnable task, long delay) throws IllegalArgumentException`
- `@NotNull @NotNull BukkitTask runTaskTimer(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Runnable task, long delay, long period) throws IllegalArgumentException`
- `void runTaskTimer(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Consumer<? super BukkitTask> task, long delay, long period) throws IllegalArgumentException`
- `@Deprecated(since="1.7.10") @NotNull @NotNull BukkitTask runTaskTimer(@NotNull @NotNull Plugin plugin, @NotNull @NotNull BukkitRunnable task, long delay, long period) throws IllegalArgumentException`
- `@NotNull @NotNull BukkitTask runTaskTimerAsynchronously(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Runnable task, long delay, long period) throws IllegalArgumentException`
- `void runTaskTimerAsynchronously(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Consumer<? super BukkitTask> task, long delay, long period) throws IllegalArgumentException`
- `@Deprecated(since="1.7.10") @NotNull @NotNull BukkitTask runTaskTimerAsynchronously(@NotNull @NotNull Plugin plugin, @NotNull @NotNull BukkitRunnable task, long delay, long period) throws IllegalArgumentException`
- `@NotNull Executor getMainThreadExecutor(@NotNull @NotNull Plugin plugin)`
