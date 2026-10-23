---
title: "org.bukkit.event.HandlerList"
package: "org.bukkit.event"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.16.5-R0.1-SNAPSHOT/spigot-api-1.16.5-R0.1-20210611.041013-99.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:34:22.101Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
jarMd5: "f6f72446ce3adfc1c820a97d7fa56c8c"
---

- `public class org.bukkit.event.HandlerList`
- `public static void bakeAll()`
- `public static void unregisterAll()`
- `public static void unregisterAll(org.bukkit.plugin.Plugin)`
- `public static void unregisterAll(org.bukkit.event.Listener)`
- `public org.bukkit.event.HandlerList()`
- `public synchronized void register(org.bukkit.plugin.RegisteredListener)`
- `public void registerAll(java.util.Collection<org.bukkit.plugin.RegisteredListener>)`
- `public synchronized void unregister(org.bukkit.plugin.RegisteredListener)`
- `public synchronized void unregister(org.bukkit.plugin.Plugin)`
- `public synchronized void unregister(org.bukkit.event.Listener)`
- `public synchronized void bake()`
- `public org.bukkit.plugin.RegisteredListener[] getRegisteredListeners()`
- `public static java.util.ArrayList<org.bukkit.plugin.RegisteredListener> getRegisteredListeners(org.bukkit.plugin.Plugin)`
- `public static java.util.ArrayList<org.bukkit.event.HandlerList> getHandlerLists()`
