---
title: "org.bukkit.scheduler.BukkitRunnable"
package: "org.bukkit.scheduler"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
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
