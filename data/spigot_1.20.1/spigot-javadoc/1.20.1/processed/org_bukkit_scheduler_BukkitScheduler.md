---
title: "org.bukkit.scheduler.BukkitScheduler"
package: "org.bukkit.scheduler"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.1-R0.1-SNAPSHOT/spigot-api-1.20.1-R0.1-20230921.163938-66.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:33:20.138Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
jarMd5: "1eba255bc0360c0286ee840906c6095c"
---

- `public interface org.bukkit.scheduler.BukkitScheduler`
- `public abstract int scheduleSyncDelayedTask(org.bukkit.plugin.Plugin, java.lang.Runnable, long)`
- `public abstract int scheduleSyncDelayedTask(org.bukkit.plugin.Plugin, org.bukkit.scheduler.BukkitRunnable, long)`
- `public abstract int scheduleSyncDelayedTask(org.bukkit.plugin.Plugin, java.lang.Runnable)`
- `public abstract int scheduleSyncDelayedTask(org.bukkit.plugin.Plugin, org.bukkit.scheduler.BukkitRunnable)`
- `public abstract int scheduleSyncRepeatingTask(org.bukkit.plugin.Plugin, java.lang.Runnable, long, long)`
- `public abstract int scheduleSyncRepeatingTask(org.bukkit.plugin.Plugin, org.bukkit.scheduler.BukkitRunnable, long, long)`
- `public abstract int scheduleAsyncDelayedTask(org.bukkit.plugin.Plugin, java.lang.Runnable, long)`
- `public abstract int scheduleAsyncDelayedTask(org.bukkit.plugin.Plugin, java.lang.Runnable)`
- `public abstract int scheduleAsyncRepeatingTask(org.bukkit.plugin.Plugin, java.lang.Runnable, long, long)`
- `public abstract <T> java.util.concurrent.Future<T> callSyncMethod(org.bukkit.plugin.Plugin, java.util.concurrent.Callable<T>)`
- `public abstract void cancelTask(int)`
- `public abstract void cancelTasks(org.bukkit.plugin.Plugin)`
- `public abstract boolean isCurrentlyRunning(int)`
- `public abstract boolean isQueued(int)`
- `public abstract java.util.List<org.bukkit.scheduler.BukkitWorker> getActiveWorkers()`
- `public abstract java.util.List<org.bukkit.scheduler.BukkitTask> getPendingTasks()`
- `public abstract org.bukkit.scheduler.BukkitTask runTask(org.bukkit.plugin.Plugin, java.lang.Runnable) throws java.lang.IllegalArgumentException`
- `public abstract void runTask(org.bukkit.plugin.Plugin, java.util.function.Consumer<org.bukkit.scheduler.BukkitTask>) throws java.lang.IllegalArgumentException`
- `public abstract org.bukkit.scheduler.BukkitTask runTask(org.bukkit.plugin.Plugin, org.bukkit.scheduler.BukkitRunnable) throws java.lang.IllegalArgumentException`
- `public abstract org.bukkit.scheduler.BukkitTask runTaskAsynchronously(org.bukkit.plugin.Plugin, java.lang.Runnable) throws java.lang.IllegalArgumentException`
- `public abstract void runTaskAsynchronously(org.bukkit.plugin.Plugin, java.util.function.Consumer<org.bukkit.scheduler.BukkitTask>) throws java.lang.IllegalArgumentException`
- `public abstract org.bukkit.scheduler.BukkitTask runTaskAsynchronously(org.bukkit.plugin.Plugin, org.bukkit.scheduler.BukkitRunnable) throws java.lang.IllegalArgumentException`
- `public abstract org.bukkit.scheduler.BukkitTask runTaskLater(org.bukkit.plugin.Plugin, java.lang.Runnable, long) throws java.lang.IllegalArgumentException`
- `public abstract void runTaskLater(org.bukkit.plugin.Plugin, java.util.function.Consumer<org.bukkit.scheduler.BukkitTask>, long) throws java.lang.IllegalArgumentException`
- `public abstract org.bukkit.scheduler.BukkitTask runTaskLater(org.bukkit.plugin.Plugin, org.bukkit.scheduler.BukkitRunnable, long) throws java.lang.IllegalArgumentException`
- `public abstract org.bukkit.scheduler.BukkitTask runTaskLaterAsynchronously(org.bukkit.plugin.Plugin, java.lang.Runnable, long) throws java.lang.IllegalArgumentException`
- `public abstract void runTaskLaterAsynchronously(org.bukkit.plugin.Plugin, java.util.function.Consumer<org.bukkit.scheduler.BukkitTask>, long) throws java.lang.IllegalArgumentException`
- `public abstract org.bukkit.scheduler.BukkitTask runTaskLaterAsynchronously(org.bukkit.plugin.Plugin, org.bukkit.scheduler.BukkitRunnable, long) throws java.lang.IllegalArgumentException`
- `public abstract org.bukkit.scheduler.BukkitTask runTaskTimer(org.bukkit.plugin.Plugin, java.lang.Runnable, long, long) throws java.lang.IllegalArgumentException`
- `public abstract void runTaskTimer(org.bukkit.plugin.Plugin, java.util.function.Consumer<org.bukkit.scheduler.BukkitTask>, long, long) throws java.lang.IllegalArgumentException`
- `public abstract org.bukkit.scheduler.BukkitTask runTaskTimer(org.bukkit.plugin.Plugin, org.bukkit.scheduler.BukkitRunnable, long, long) throws java.lang.IllegalArgumentException`
- `public abstract org.bukkit.scheduler.BukkitTask runTaskTimerAsynchronously(org.bukkit.plugin.Plugin, java.lang.Runnable, long, long) throws java.lang.IllegalArgumentException`
- `public abstract void runTaskTimerAsynchronously(org.bukkit.plugin.Plugin, java.util.function.Consumer<org.bukkit.scheduler.BukkitTask>, long, long) throws java.lang.IllegalArgumentException`
- `public abstract org.bukkit.scheduler.BukkitTask runTaskTimerAsynchronously(org.bukkit.plugin.Plugin, org.bukkit.scheduler.BukkitRunnable, long, long) throws java.lang.IllegalArgumentException`
