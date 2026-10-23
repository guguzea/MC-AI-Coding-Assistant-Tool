---
title: "org.bukkit.plugin.TimedRegisteredListener"
package: "org.bukkit.plugin"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public class org.bukkit.plugin.TimedRegisteredListener extends org.bukkit.plugin.RegisteredListener`
- `public org.bukkit.plugin.TimedRegisteredListener(org.bukkit.event.Listener, org.bukkit.plugin.EventExecutor, org.bukkit.event.EventPriority, org.bukkit.plugin.Plugin, boolean)`
- `public void callEvent(org.bukkit.event.Event) throws org.bukkit.event.EventException`
- `public void reset()`
- `public int getCount()`
- `public long getTotalTime()`
- `public java.lang.Class<? extends org.bukkit.event.Event> getEventClass()`
- `public boolean hasMultiple()`
