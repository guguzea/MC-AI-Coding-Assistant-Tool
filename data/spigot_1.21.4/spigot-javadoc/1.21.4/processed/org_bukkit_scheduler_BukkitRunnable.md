---
title: "org.bukkit.scheduler.BukkitRunnable"
package: "org.bukkit.scheduler"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.4-R0.1-SNAPSHOT/spigot-api-1.21.4-R0.1-20250325.160956-56.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:30:34.551Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
jarMd5: "6ce70a28800bf30e68da45b12871f1f2"
---

- `public abstract class org.bukkit.scheduler.BukkitRunnable implements java.lang.Runnable`
- `public org.bukkit.scheduler.BukkitRunnable()`
- `public synchronized boolean isCancelled() throws java.lang.IllegalStateException`
- `public synchronized void cancel() throws java.lang.IllegalStateException`
- `public synchronized org.bukkit.scheduler.BukkitTask runTask(org.bukkit.plugin.Plugin) throws java.lang.IllegalArgumentException, java.lang.IllegalStateException`
- `public synchronized org.bukkit.scheduler.BukkitTask runTaskAsynchronously(org.bukkit.plugin.Plugin) throws java.lang.IllegalArgumentException, java.lang.IllegalStateException`
- `public synchronized org.bukkit.scheduler.BukkitTask runTaskLater(org.bukkit.plugin.Plugin, long) throws java.lang.IllegalArgumentException, java.lang.IllegalStateException`
- `public synchronized org.bukkit.scheduler.BukkitTask runTaskLaterAsynchronously(org.bukkit.plugin.Plugin, long) throws java.lang.IllegalArgumentException, java.lang.IllegalStateException`
- `public synchronized org.bukkit.scheduler.BukkitTask runTaskTimer(org.bukkit.plugin.Plugin, long, long) throws java.lang.IllegalArgumentException, java.lang.IllegalStateException`
- `public synchronized org.bukkit.scheduler.BukkitTask runTaskTimerAsynchronously(org.bukkit.plugin.Plugin, long, long) throws java.lang.IllegalArgumentException, java.lang.IllegalStateException`
- `public synchronized int getTaskId() throws java.lang.IllegalStateException`
