---
title: "org.bukkit.plugin.TimedRegisteredListener"
package: "org.bukkit.plugin"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/plugin/TimedRegisteredListener.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `public TimedRegisteredListener(@NotNull @NotNull Listener pluginListener, @NotNull @NotNull EventExecutor eventExecutor, @NotNull @NotNull EventPriority eventPriority, @NotNull @NotNull Plugin registeredPlugin, boolean listenCancelled)`
- `public void callEvent(@NotNull @NotNull Event event) throws EventException`
- `public void reset()`
- `public int getCount()`
- `public long getTotalTime()`
- `@Nullable public @Nullable Class<? extends Event> getEventClass()`
- `public boolean hasMultiple()`
