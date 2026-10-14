---
title: "org.bukkit.plugin.TimedRegisteredListener"
package: "org.bukkit.plugin"
source: https://jd.papermc.io/paper/26.3/org/bukkit/plugin/TimedRegisteredListener.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class TimedRegisteredListener**
`@Deprecated(forRemoval=true) public class TimedRegisteredListener extends RegisteredListener`
- `public TimedRegisteredListener(@NotNull @NotNull Listener pluginListener, @NotNull @NotNull EventExecutor eventExecutor, @NotNull @NotNull EventPriority eventPriority, @NotNull @NotNull Plugin registeredPlugin, boolean listenCancelled)`
- `public void callEvent(@NotNull @NotNull Event event) throws EventException`
- `public void reset()`
- `public int getCount()`
- `public long getTotalTime()`
- `@Nullable public @Nullable Class<? extends Event> getEventClass()`
- `public boolean hasMultiple()`
