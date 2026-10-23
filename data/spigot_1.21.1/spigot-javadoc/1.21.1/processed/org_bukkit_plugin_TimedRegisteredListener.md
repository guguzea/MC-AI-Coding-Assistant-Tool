---
title: "org.bukkit.plugin.TimedRegisteredListener"
package: "org.bukkit.plugin"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.1-R0.1-SNAPSHOT/spigot-api-1.21.1-R0.1-20241022.152140-54.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:32:12.811Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
jarMd5: "9fd276a59330220323c3fdfdcf86d22e"
---

- `public class org.bukkit.plugin.TimedRegisteredListener extends org.bukkit.plugin.RegisteredListener`
- `public org.bukkit.plugin.TimedRegisteredListener(org.bukkit.event.Listener, org.bukkit.plugin.EventExecutor, org.bukkit.event.EventPriority, org.bukkit.plugin.Plugin, boolean)`
- `public void callEvent(org.bukkit.event.Event) throws org.bukkit.event.EventException`
- `public void reset()`
- `public int getCount()`
- `public long getTotalTime()`
- `public java.lang.Class<? extends org.bukkit.event.Event> getEventClass()`
- `public boolean hasMultiple()`
