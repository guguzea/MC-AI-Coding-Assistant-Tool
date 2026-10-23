---
title: "org.bukkit.plugin.EventExecutor"
package: "org.bukkit.plugin"
source: https://jd.papermc.io/paper/1.12.2/org/bukkit/plugin/EventExecutor.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T09:54:19.288Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
---

- `static ConcurrentMap<Method,Class<? extends EventExecutor>> eventExecutorMap`
- `static EventExecutor create(Method m, Class<? extends Event> eventClass)`
- `void execute(Listener listener, Event event)`
