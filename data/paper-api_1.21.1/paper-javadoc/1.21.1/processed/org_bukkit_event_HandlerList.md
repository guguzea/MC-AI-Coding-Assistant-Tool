---
title: "org.bukkit.event.HandlerList"
package: "org.bukkit.event"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/event/HandlerList.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `public HandlerList()`
- `public static void bakeAll()`
- `public static void unregisterAll()`
- `public static void unregisterAll(@NotNull @NotNull Plugin plugin)`
- `public static void unregisterAll(@NotNull @NotNull Listener listener)`
- `public void register(@NotNull @NotNull RegisteredListener listener)`
- `public void registerAll(@NotNull @NotNull Collection<RegisteredListener> listeners)`
- `public void unregister(@NotNull @NotNull RegisteredListener listener)`
- `public void unregister(@NotNull @NotNull Plugin plugin)`
- `public void unregister(@NotNull @NotNull Listener listener)`
- `public void bake()`
- `@NotNull public @NotNull RegisteredListener[] getRegisteredListeners()`
- `@NotNull public static @NotNull ArrayList<RegisteredListener> getRegisteredListeners(@NotNull @NotNull Plugin plugin)`
- `@NotNull public static @NotNull ArrayList<HandlerList> getHandlerLists()`
