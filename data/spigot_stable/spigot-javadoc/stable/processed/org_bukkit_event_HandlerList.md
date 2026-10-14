---
title: "org.bukkit.event.HandlerList"
package: "org.bukkit.event"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/HandlerList.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class HandlerList**
`public class HandlerList extends Object`
- `public HandlerList()`
- `public static void bakeAll()`
- `public static void unregisterAll()`
- `public static void unregisterAll(@NotNull Plugin plugin)`
- `public static void unregisterAll(@NotNull Listener listener)`
- `public void register(@NotNull RegisteredListener listener)`
- `public void registerAll(@NotNull Collection<RegisteredListener> listeners)`
- `public void unregister(@NotNull RegisteredListener listener)`
- `public void unregister(@NotNull Plugin plugin)`
- `public void unregister(@NotNull Listener listener)`
- `public void bake()`
- `@NotNull public RegisteredListener[] getRegisteredListeners()`
- `@NotNull public static ArrayList<RegisteredListener> getRegisteredListeners(@NotNull Plugin plugin)`
- `@NotNull public static ArrayList<HandlerList> getHandlerLists()`
