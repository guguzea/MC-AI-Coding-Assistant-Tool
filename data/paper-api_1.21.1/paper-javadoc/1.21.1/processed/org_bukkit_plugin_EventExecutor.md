---
title: "org.bukkit.plugin.EventExecutor"
package: "org.bukkit.plugin"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/plugin/EventExecutor.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `static final ConcurrentMap<Method,Class<? extends EventExecutor>> eventExecutorMap`
- `void execute(@NotNull @NotNull Listener listener, @NotNull @NotNull Event event) throws EventException`
- `@NotNull static @NotNull EventExecutor create(@NotNull @NotNull Method m, @NotNull @NotNull Class<? extends Event> eventClass)`
