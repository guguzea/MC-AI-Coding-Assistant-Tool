---
title: "io.papermc.paper.threadedregions.scheduler.ScheduledTask"
package: "io.papermc.paper.threadedregions.scheduler"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/threadedregions/scheduler/ScheduledTask.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface ScheduledTask**
`public interface ScheduledTask`
- `@NotNull @NotNull Plugin getOwningPlugin()`
- `boolean isRepeatingTask()`
- `@NotNull @NotNull ScheduledTask.CancelledState cancel()`
- `@NotNull @NotNull ScheduledTask.ExecutionState getExecutionState()`
- `default boolean isCancelled()`
