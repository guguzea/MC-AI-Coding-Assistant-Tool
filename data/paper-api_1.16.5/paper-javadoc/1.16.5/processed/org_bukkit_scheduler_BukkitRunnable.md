---
title: "org.bukkit.scheduler.BukkitRunnable"
package: "org.bukkit.scheduler"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/scheduler/BukkitRunnable.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public BukkitRunnable()`
- `public boolean isCancelled() throws IllegalStateException`
- `public void cancel() throws IllegalStateException`
- `@NotNull public @NotNull BukkitTask runTask&#8203;(@NotNull @NotNull Plugin plugin) throws IllegalArgumentException, IllegalStateException`
- `@NotNull public @NotNull BukkitTask runTaskAsynchronously&#8203;(@NotNull @NotNull Plugin plugin) throws IllegalArgumentException, IllegalStateException`
- `@NotNull public @NotNull BukkitTask runTaskLater&#8203;(@NotNull @NotNull Plugin plugin, long delay) throws IllegalArgumentException, IllegalStateException`
- `@NotNull public @NotNull BukkitTask runTaskLaterAsynchronously&#8203;(@NotNull @NotNull Plugin plugin, long delay) throws IllegalArgumentException, IllegalStateException`
- `@NotNull public @NotNull BukkitTask runTaskTimer&#8203;(@NotNull @NotNull Plugin plugin, long delay, long period) throws IllegalArgumentException, IllegalStateException`
- `@NotNull public @NotNull BukkitTask runTaskTimerAsynchronously&#8203;(@NotNull @NotNull Plugin plugin, long delay, long period) throws IllegalArgumentException, IllegalStateException`
- `public int getTaskId() throws IllegalStateException`
