---
title: "org.bukkit.scheduler.BukkitScheduler"
package: "org.bukkit.scheduler"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.12.2-R0.1-SNAPSHOT/spigot-api-1.12.2-R0.1-20180712.012057-156.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:35:10.184Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
jarMd5: "f1c84754979a6e1344a24f09bb1fed35"
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
- `public abstract void cancelAllTasks()`
- `public abstract boolean isCurrentlyRunning(int)`
- `public abstract boolean isQueued(int)`
- `public abstract java.util.List<org.bukkit.scheduler.BukkitWorker> getActiveWorkers()`
- `public abstract java.util.List<org.bukkit.scheduler.BukkitTask> getPendingTasks()`
- `public abstract org.bukkit.scheduler.BukkitTask runTask(org.bukkit.plugin.Plugin, java.lang.Runnable) throws java.lang.IllegalArgumentException`
- `public abstract org.bukkit.scheduler.BukkitTask runTask(org.bukkit.plugin.Plugin, org.bukkit.scheduler.BukkitRunnable) throws java.lang.IllegalArgumentException`
- `public abstract org.bukkit.scheduler.BukkitTask runTaskAsynchronously(org.bukkit.plugin.Plugin, java.lang.Runnable) throws java.lang.IllegalArgumentException`
- `public abstract org.bukkit.scheduler.BukkitTask runTaskAsynchronously(org.bukkit.plugin.Plugin, org.bukkit.scheduler.BukkitRunnable) throws java.lang.IllegalArgumentException`
- `public abstract org.bukkit.scheduler.BukkitTask runTaskLater(org.bukkit.plugin.Plugin, java.lang.Runnable, long) throws java.lang.IllegalArgumentException`
- `public abstract org.bukkit.scheduler.BukkitTask runTaskLater(org.bukkit.plugin.Plugin, org.bukkit.scheduler.BukkitRunnable, long) throws java.lang.IllegalArgumentException`
- `public abstract org.bukkit.scheduler.BukkitTask runTaskLaterAsynchronously(org.bukkit.plugin.Plugin, java.lang.Runnable, long) throws java.lang.IllegalArgumentException`
- `public abstract org.bukkit.scheduler.BukkitTask runTaskLaterAsynchronously(org.bukkit.plugin.Plugin, org.bukkit.scheduler.BukkitRunnable, long) throws java.lang.IllegalArgumentException`
- `public abstract org.bukkit.scheduler.BukkitTask runTaskTimer(org.bukkit.plugin.Plugin, java.lang.Runnable, long, long) throws java.lang.IllegalArgumentException`
- `public abstract org.bukkit.scheduler.BukkitTask runTaskTimer(org.bukkit.plugin.Plugin, org.bukkit.scheduler.BukkitRunnable, long, long) throws java.lang.IllegalArgumentException`
- `public abstract org.bukkit.scheduler.BukkitTask runTaskTimerAsynchronously(org.bukkit.plugin.Plugin, java.lang.Runnable, long, long) throws java.lang.IllegalArgumentException`
- `public abstract org.bukkit.scheduler.BukkitTask runTaskTimerAsynchronously(org.bukkit.plugin.Plugin, org.bukkit.scheduler.BukkitRunnable, long, long) throws java.lang.IllegalArgumentException`
