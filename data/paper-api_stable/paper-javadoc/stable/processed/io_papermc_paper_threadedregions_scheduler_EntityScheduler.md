---
title: "io.papermc.paper.threadedregions.scheduler.EntityScheduler"
package: "io.papermc.paper.threadedregions.scheduler"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/threadedregions/scheduler/EntityScheduler.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface EntityScheduler**
`public interface EntityScheduler`
- `boolean execute(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Runnable run, @Nullable @Nullable Runnable retired, long delay)`
- `@Nullable @Nullable ScheduledTask run(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Consumer<ScheduledTask> task, @Nullable @Nullable Runnable retired)`
- `@Nullable @Nullable ScheduledTask runDelayed(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Consumer<ScheduledTask> task, @Nullable @Nullable Runnable retired, long delayTicks)`
- `@Nullable @Nullable ScheduledTask runAtFixedRate(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Consumer<ScheduledTask> task, @Nullable @Nullable Runnable retired, long initialDelayTicks, long periodTicks)`
