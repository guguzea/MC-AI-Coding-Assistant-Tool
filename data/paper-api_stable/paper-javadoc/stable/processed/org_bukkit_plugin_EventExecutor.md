---
title: "org.bukkit.plugin.EventExecutor"
package: "org.bukkit.plugin"
source: https://jd.papermc.io/paper/26.3/org/bukkit/plugin/EventExecutor.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface EventExecutor**
`public interface EventExecutor`
- `void execute(@NotNull @NotNull Listener listener, @NotNull @NotNull Event event) throws EventException`
- `@NotNull static @NotNull EventExecutor create(@NotNull @NotNull Method m, @NotNull @NotNull Class<? extends Event> eventClass)`
