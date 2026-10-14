---
title: "io.papermc.paper.threadedregions.scheduler.GlobalRegionScheduler"
package: "io.papermc.paper.threadedregions.scheduler"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/threadedregions/scheduler/GlobalRegionScheduler.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface GlobalRegionScheduler**
`public interface GlobalRegionScheduler`
- `void execute(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Runnable run)`
- `@NotNull @NotNull ScheduledTask run(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Consumer<ScheduledTask> task)`
- `@NotNull @NotNull ScheduledTask runDelayed(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Consumer<ScheduledTask> task, long delayTicks)`
- `@NotNull @NotNull ScheduledTask runAtFixedRate(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Consumer<ScheduledTask> task, long initialDelayTicks, long periodTicks)`
- `void cancelTasks(@NotNull @NotNull Plugin plugin)`
