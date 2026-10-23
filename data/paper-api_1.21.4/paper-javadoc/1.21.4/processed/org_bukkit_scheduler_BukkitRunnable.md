---
title: "org.bukkit.scheduler.BukkitRunnable"
package: "org.bukkit.scheduler"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/scheduler/BukkitRunnable.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

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
