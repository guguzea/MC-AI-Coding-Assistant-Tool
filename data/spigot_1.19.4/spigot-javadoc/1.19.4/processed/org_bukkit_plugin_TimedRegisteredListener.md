---
title: "org.bukkit.plugin.TimedRegisteredListener"
package: "org.bukkit.plugin"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.19.4-R0.1-SNAPSHOT/spigot-api-1.19.4-R0.1-20230607.155743-88.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:56:49.588Z
asOfVersion: "1.19.4-R0.1-SNAPSHOT"
jarMd5: "5f333efcd2669f68a5c4bd2beb6341e9"
---

- `public class org.bukkit.plugin.TimedRegisteredListener extends org.bukkit.plugin.RegisteredListener`
- `public org.bukkit.plugin.TimedRegisteredListener(org.bukkit.event.Listener, org.bukkit.plugin.EventExecutor, org.bukkit.event.EventPriority, org.bukkit.plugin.Plugin, boolean)`
- `public void callEvent(org.bukkit.event.Event) throws org.bukkit.event.EventException`
- `public void reset()`
- `public int getCount()`
- `public long getTotalTime()`
- `public java.lang.Class<? extends org.bukkit.event.Event> getEventClass()`
- `public boolean hasMultiple()`
