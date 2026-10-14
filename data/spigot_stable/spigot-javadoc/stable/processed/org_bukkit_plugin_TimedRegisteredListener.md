---
title: "org.bukkit.plugin.TimedRegisteredListener"
package: "org.bukkit.plugin"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/plugin/TimedRegisteredListener.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class TimedRegisteredListener**
`public class TimedRegisteredListener extends RegisteredListener`
- `public TimedRegisteredListener(@NotNull Listener pluginListener, @NotNull EventExecutor eventExecutor, @NotNull EventPriority eventPriority, @NotNull Plugin registeredPlugin, boolean listenCancelled)`
- `public void callEvent(@NotNull Event event) throws EventException`
- `public void reset()`
- `public int getCount()`
- `public long getTotalTime()`
- `@Nullable public Class<? extends Event> getEventClass()`
- `public boolean hasMultiple()`
