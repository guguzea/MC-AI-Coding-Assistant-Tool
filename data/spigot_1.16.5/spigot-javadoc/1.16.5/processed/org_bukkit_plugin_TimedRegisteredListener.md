---
title: "org.bukkit.plugin.TimedRegisteredListener"
package: "org.bukkit.plugin"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.16.5-R0.1-SNAPSHOT/spigot-api-1.16.5-R0.1-20210611.041013-99.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:34:22.101Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
jarMd5: "f6f72446ce3adfc1c820a97d7fa56c8c"
---

- `public class org.bukkit.plugin.TimedRegisteredListener extends org.bukkit.plugin.RegisteredListener`
- `public org.bukkit.plugin.TimedRegisteredListener(org.bukkit.event.Listener, org.bukkit.plugin.EventExecutor, org.bukkit.event.EventPriority, org.bukkit.plugin.Plugin, boolean)`
- `public void callEvent(org.bukkit.event.Event) throws org.bukkit.event.EventException`
- `public void reset()`
- `public int getCount()`
- `public long getTotalTime()`
- `public java.lang.Class<? extends org.bukkit.event.Event> getEventClass()`
- `public boolean hasMultiple()`
