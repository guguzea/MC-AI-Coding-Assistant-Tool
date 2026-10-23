---
title: "io.papermc.paper.threadedregions.scheduler.AsyncScheduler"
package: "io.papermc.paper.threadedregions.scheduler"
source: https://jd.papermc.io/paper/1.20.1/io/papermc/paper/threadedregions/scheduler/AsyncScheduler.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `@NotNull @NotNull ScheduledTask runNow(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Consumer<ScheduledTask> task)`
- `@NotNull @NotNull ScheduledTask runDelayed(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Consumer<ScheduledTask> task, long delay, @NotNull @NotNull TimeUnit unit)`
- `@NotNull @NotNull ScheduledTask runAtFixedRate(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Consumer<ScheduledTask> task, long initialDelay, long period, @NotNull @NotNull TimeUnit unit)`
- `void cancelTasks(@NotNull @NotNull Plugin plugin)`
