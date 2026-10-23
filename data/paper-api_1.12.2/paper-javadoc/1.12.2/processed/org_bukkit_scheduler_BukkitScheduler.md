---
title: "org.bukkit.scheduler.BukkitScheduler"
package: "org.bukkit.scheduler"
source: https://jd.papermc.io/paper/1.12.2/org/bukkit/scheduler/BukkitScheduler.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T09:54:19.288Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
---

- `<T> Future<T> callSyncMethod(Plugin plugin, Callable<T> task)`
- `void cancelAllTasks()`
- `void cancelTask(int taskId)`
- `void cancelTasks(Plugin plugin)`
- `List<BukkitWorker> getActiveWorkers()`
- `List<BukkitTask> getPendingTasks()`
- `boolean isCurrentlyRunning(int taskId)`
- `boolean isQueued(int taskId)`
- `BukkitTask runTask(Plugin plugin, Runnable task)`
- `BukkitTask runTask(Plugin plugin, BukkitRunnable task)`
- `BukkitTask runTaskAsynchronously(Plugin plugin, Runnable task)`
- `BukkitTask runTaskAsynchronously(Plugin plugin, BukkitRunnable task)`
- `BukkitTask runTaskLater(Plugin plugin, Runnable task, long delay)`
- `BukkitTask runTaskLater(Plugin plugin, BukkitRunnable task, long delay)`
- `BukkitTask runTaskLaterAsynchronously(Plugin plugin, Runnable task, long delay)`
- `BukkitTask runTaskLaterAsynchronously(Plugin plugin, BukkitRunnable task, long delay)`
- `BukkitTask runTaskTimer(Plugin plugin, Runnable task, long delay, long period)`
- `BukkitTask runTaskTimer(Plugin plugin, BukkitRunnable task, long delay, long period)`
- `BukkitTask runTaskTimerAsynchronously(Plugin plugin, Runnable task, long delay, long period)`
- `BukkitTask runTaskTimerAsynchronously(Plugin plugin, BukkitRunnable task, long delay, long period)`
- `int scheduleAsyncDelayedTask(Plugin plugin, Runnable task)`
- `int scheduleAsyncDelayedTask(Plugin plugin, Runnable task, long delay)`
- `int scheduleAsyncRepeatingTask(Plugin plugin, Runnable task, long delay, long period)`
- `int scheduleSyncDelayedTask(Plugin plugin, Runnable task)`
- `int scheduleSyncDelayedTask(Plugin plugin, Runnable task, long delay)`
- `int scheduleSyncDelayedTask(Plugin plugin, BukkitRunnable task)`
- `int scheduleSyncDelayedTask(Plugin plugin, BukkitRunnable task, long delay)`
- `int scheduleSyncRepeatingTask(Plugin plugin, Runnable task, long delay, long period)`
- `int scheduleSyncRepeatingTask(Plugin plugin, BukkitRunnable task, long delay, long period)`
