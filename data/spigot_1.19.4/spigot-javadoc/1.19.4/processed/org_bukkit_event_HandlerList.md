---
title: "org.bukkit.event.HandlerList"
package: "org.bukkit.event"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.19.4-R0.1-SNAPSHOT/spigot-api-1.19.4-R0.1-20230607.155743-88.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:56:49.588Z
asOfVersion: "1.19.4-R0.1-SNAPSHOT"
jarMd5: "5f333efcd2669f68a5c4bd2beb6341e9"
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
