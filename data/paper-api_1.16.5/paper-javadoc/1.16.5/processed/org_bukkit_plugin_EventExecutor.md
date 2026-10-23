---
title: "org.bukkit.plugin.EventExecutor"
package: "org.bukkit.plugin"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/plugin/EventExecutor.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `static final ConcurrentMap<Method,&#8203;Class<? extends EventExecutor>> eventExecutorMap`
- `void execute&#8203;(@NotNull @NotNull Listener listener, @NotNull @NotNull Event event) throws EventException`
- `@NotNull static @NotNull EventExecutor create&#8203;(@NotNull @NotNull Method m, @NotNull @NotNull Class<? extends Event> eventClass)`
