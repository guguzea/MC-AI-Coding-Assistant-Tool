---
title: "io.papermc.paper.threadedregions.scheduler.RegionScheduler"
package: "io.papermc.paper.threadedregions.scheduler"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/threadedregions/scheduler/RegionScheduler.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface RegionScheduler**
`public interface RegionScheduler`
- `void execute(@NotNull @NotNull Plugin plugin, @NotNull @NotNull World world, int chunkX, int chunkZ, @NotNull @NotNull Runnable run)`
- `default void execute(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Location location, @NotNull @NotNull Runnable run)`
- `@NotNull @NotNull ScheduledTask run(@NotNull @NotNull Plugin plugin, @NotNull @NotNull World world, int chunkX, int chunkZ, @NotNull @NotNull Consumer<ScheduledTask> task)`
- `@NotNull default @NotNull ScheduledTask run(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Location location, @NotNull @NotNull Consumer<ScheduledTask> task)`
- `@NotNull @NotNull ScheduledTask runDelayed(@NotNull @NotNull Plugin plugin, @NotNull @NotNull World world, int chunkX, int chunkZ, @NotNull @NotNull Consumer<ScheduledTask> task, long delayTicks)`
- `@NotNull default @NotNull ScheduledTask runDelayed(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Location location, @NotNull @NotNull Consumer<ScheduledTask> task, long delayTicks)`
- `@NotNull @NotNull ScheduledTask runAtFixedRate(@NotNull @NotNull Plugin plugin, @NotNull @NotNull World world, int chunkX, int chunkZ, @NotNull @NotNull Consumer<ScheduledTask> task, long initialDelayTicks, long periodTicks)`
- `@NotNull default @NotNull ScheduledTask runAtFixedRate(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Location location, @NotNull @NotNull Consumer<ScheduledTask> task, long initialDelayTicks, long periodTicks)`
