---
title: "io.papermc.paper.threadedregions.scheduler.EntityScheduler"
package: "io.papermc.paper.threadedregions.scheduler"
source: https://jd.papermc.io/paper/1.21.4/io/papermc/paper/threadedregions/scheduler/EntityScheduler.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `boolean execute(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Runnable run, @Nullable @Nullable Runnable retired, long delay)`
- `@Nullable @Nullable ScheduledTask run(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Consumer<ScheduledTask> task, @Nullable @Nullable Runnable retired)`
- `@Nullable @Nullable ScheduledTask runDelayed(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Consumer<ScheduledTask> task, @Nullable @Nullable Runnable retired, long delayTicks)`
- `@Nullable @Nullable ScheduledTask runAtFixedRate(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Consumer<ScheduledTask> task, @Nullable @Nullable Runnable retired, long initialDelayTicks, long periodTicks)`
