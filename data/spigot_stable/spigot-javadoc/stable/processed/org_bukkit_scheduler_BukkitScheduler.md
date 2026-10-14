---
title: "org.bukkit.scheduler.BukkitScheduler"
package: "org.bukkit.scheduler"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/scheduler/BukkitScheduler.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface BukkitScheduler**
`public interface BukkitScheduler`
- `int scheduleSyncDelayedTask(@NotNull Plugin plugin, @NotNull Runnable task, long delay)`
- `@Deprecated(since="1.7.10") int scheduleSyncDelayedTask(@NotNull Plugin plugin, @NotNull BukkitRunnable task, long delay)`
- `int scheduleSyncDelayedTask(@NotNull Plugin plugin, @NotNull Runnable task)`
- `@Deprecated(since="1.7.10") int scheduleSyncDelayedTask(@NotNull Plugin plugin, @NotNull BukkitRunnable task)`
- `int scheduleSyncRepeatingTask(@NotNull Plugin plugin, @NotNull Runnable task, long delay, long period)`
- `@Deprecated(since="1.7.10") int scheduleSyncRepeatingTask(@NotNull Plugin plugin, @NotNull BukkitRunnable task, long delay, long period)`
- `@Deprecated(since="1.4.5") int scheduleAsyncDelayedTask(@NotNull Plugin plugin, @NotNull Runnable task, long delay)`
- `@Deprecated(since="1.4.5") int scheduleAsyncDelayedTask(@NotNull Plugin plugin, @NotNull Runnable task)`
- `@Deprecated(since="1.4.5") int scheduleAsyncRepeatingTask(@NotNull Plugin plugin, @NotNull Runnable task, long delay, long period)`
- `@NotNull <T> Future<T> callSyncMethod(@NotNull Plugin plugin, @NotNull Callable<T> task)`
- `void cancelTask(int taskId)`
- `void cancelTasks(@NotNull Plugin plugin)`
- `boolean isCurrentlyRunning(int taskId)`
- `boolean isQueued(int taskId)`
- `@NotNull List<BukkitWorker> getActiveWorkers()`
- `@NotNull List<BukkitTask> getPendingTasks()`
- `@NotNull BukkitTask runTask(@NotNull Plugin plugin, @NotNull Runnable task) throws IllegalArgumentException`
- `void runTask(@NotNull Plugin plugin, @NotNull Consumer<? super BukkitTask> task) throws IllegalArgumentException`
- `@Deprecated(since="1.7.10") @NotNull BukkitTask runTask(@NotNull Plugin plugin, @NotNull BukkitRunnable task) throws IllegalArgumentException`
- `@NotNull BukkitTask runTaskAsynchronously(@NotNull Plugin plugin, @NotNull Runnable task) throws IllegalArgumentException`
- `void runTaskAsynchronously(@NotNull Plugin plugin, @NotNull Consumer<? super BukkitTask> task) throws IllegalArgumentException`
- `@Deprecated(since="1.7.10") @NotNull BukkitTask runTaskAsynchronously(@NotNull Plugin plugin, @NotNull BukkitRunnable task) throws IllegalArgumentException`
- `@NotNull BukkitTask runTaskLater(@NotNull Plugin plugin, @NotNull Runnable task, long delay) throws IllegalArgumentException`
- `void runTaskLater(@NotNull Plugin plugin, @NotNull Consumer<? super BukkitTask> task, long delay) throws IllegalArgumentException`
- `@Deprecated(since="1.7.10") @NotNull BukkitTask runTaskLater(@NotNull Plugin plugin, @NotNull BukkitRunnable task, long delay) throws IllegalArgumentException`
- `@NotNull BukkitTask runTaskLaterAsynchronously(@NotNull Plugin plugin, @NotNull Runnable task, long delay) throws IllegalArgumentException`
- `void runTaskLaterAsynchronously(@NotNull Plugin plugin, @NotNull Consumer<? super BukkitTask> task, long delay) throws IllegalArgumentException`
- `@Deprecated(since="1.7.10") @NotNull BukkitTask runTaskLaterAsynchronously(@NotNull Plugin plugin, @NotNull BukkitRunnable task, long delay) throws IllegalArgumentException`
- `@NotNull BukkitTask runTaskTimer(@NotNull Plugin plugin, @NotNull Runnable task, long delay, long period) throws IllegalArgumentException`
- `void runTaskTimer(@NotNull Plugin plugin, @NotNull Consumer<? super BukkitTask> task, long delay, long period) throws IllegalArgumentException`
- `@Deprecated(since="1.7.10") @NotNull BukkitTask runTaskTimer(@NotNull Plugin plugin, @NotNull BukkitRunnable task, long delay, long period) throws IllegalArgumentException`
- `@NotNull BukkitTask runTaskTimerAsynchronously(@NotNull Plugin plugin, @NotNull Runnable task, long delay, long period) throws IllegalArgumentException`
- `void runTaskTimerAsynchronously(@NotNull Plugin plugin, @NotNull Consumer<? super BukkitTask> task, long delay, long period) throws IllegalArgumentException`
- `@Deprecated(since="1.7.10") @NotNull BukkitTask runTaskTimerAsynchronously(@NotNull Plugin plugin, @NotNull BukkitRunnable task, long delay, long period) throws IllegalArgumentException`
