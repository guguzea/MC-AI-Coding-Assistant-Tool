---
title: "org.bukkit.plugin.RegisteredListener"
package: "org.bukkit.plugin"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.1-R0.1-SNAPSHOT/spigot-api-1.21.1-R0.1-20241022.152140-54.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:32:12.811Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
jarMd5: "9fd276a59330220323c3fdfdcf86d22e"
---

- `public class org.bukkit.plugin.RegisteredListener`
- `public org.bukkit.plugin.RegisteredListener(org.bukkit.event.Listener, org.bukkit.plugin.EventExecutor, org.bukkit.event.EventPriority, org.bukkit.plugin.Plugin, boolean)`
- `public org.bukkit.event.Listener getListener()`
- `public org.bukkit.plugin.Plugin getPlugin()`
- `public org.bukkit.event.EventPriority getPriority()`
- `public void callEvent(org.bukkit.event.Event) throws org.bukkit.event.EventException`
- `public boolean isIgnoringCancelled()`
