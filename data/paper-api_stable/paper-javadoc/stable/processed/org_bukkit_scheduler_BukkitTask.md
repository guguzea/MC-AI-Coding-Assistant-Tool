---
title: "org.bukkit.scheduler.BukkitTask"
package: "org.bukkit.scheduler"
source: https://jd.papermc.io/paper/26.3/org/bukkit/scheduler/BukkitTask.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface BukkitTask**
`public interface BukkitTask`
- `int getTaskId()`
- `@NotNull @NotNull Plugin getOwner()`
- `boolean isSync()`
- `boolean isCancelled()`
- `void cancel()`
