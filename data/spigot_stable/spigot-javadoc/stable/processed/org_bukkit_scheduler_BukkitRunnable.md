---
title: "org.bukkit.scheduler.BukkitRunnable"
package: "org.bukkit.scheduler"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/scheduler/BukkitRunnable.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class BukkitRunnable**
`public abstract class BukkitRunnable extends Object implements Runnable`
- `public BukkitRunnable()`
- `public boolean isCancelled() throws IllegalStateException`
- `public void cancel() throws IllegalStateException`
- `@NotNull public BukkitTask runTask(@NotNull Plugin plugin) throws IllegalArgumentException, IllegalStateException`
- `@NotNull public BukkitTask runTaskAsynchronously(@NotNull Plugin plugin) throws IllegalArgumentException, IllegalStateException`
- `@NotNull public BukkitTask runTaskLater(@NotNull Plugin plugin, long delay) throws IllegalArgumentException, IllegalStateException`
- `@NotNull public BukkitTask runTaskLaterAsynchronously(@NotNull Plugin plugin, long delay) throws IllegalArgumentException, IllegalStateException`
- `@NotNull public BukkitTask runTaskTimer(@NotNull Plugin plugin, long delay, long period) throws IllegalArgumentException, IllegalStateException`
- `@NotNull public BukkitTask runTaskTimerAsynchronously(@NotNull Plugin plugin, long delay, long period) throws IllegalArgumentException, IllegalStateException`
- `public int getTaskId() throws IllegalStateException`
