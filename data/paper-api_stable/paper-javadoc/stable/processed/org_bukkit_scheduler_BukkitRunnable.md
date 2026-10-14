---
title: "org.bukkit.scheduler.BukkitRunnable"
package: "org.bukkit.scheduler"
source: https://jd.papermc.io/paper/26.3/org/bukkit/scheduler/BukkitRunnable.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class BukkitRunnable**
`public abstract class BukkitRunnable extends Object implements Runnable`
- `public BukkitRunnable()`
- `public boolean isCancelled() throws IllegalStateException`
- `public void cancel() throws IllegalStateException`
- `@NotNull public @NotNull BukkitTask runTask(@NotNull @NotNull Plugin plugin) throws IllegalArgumentException, IllegalStateException`
- `@NotNull public @NotNull BukkitTask runTaskAsynchronously(@NotNull @NotNull Plugin plugin) throws IllegalArgumentException, IllegalStateException`
- `@NotNull public @NotNull BukkitTask runTaskLater(@NotNull @NotNull Plugin plugin, long delay) throws IllegalArgumentException, IllegalStateException`
- `@NotNull public @NotNull BukkitTask runTaskLaterAsynchronously(@NotNull @NotNull Plugin plugin, long delay) throws IllegalArgumentException, IllegalStateException`
- `@NotNull public @NotNull BukkitTask runTaskTimer(@NotNull @NotNull Plugin plugin, long delay, long period) throws IllegalArgumentException, IllegalStateException`
- `@NotNull public @NotNull BukkitTask runTaskTimerAsynchronously(@NotNull @NotNull Plugin plugin, long delay, long period) throws IllegalArgumentException, IllegalStateException`
- `public int getTaskId() throws IllegalStateException`
