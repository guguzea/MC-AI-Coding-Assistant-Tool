---
title: "org.bukkit.event.HandlerList"
package: "org.bukkit.event"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/event/HandlerList.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public HandlerList()`
- `public static void bakeAll()`
- `public static void unregisterAll()`
- `public static void unregisterAll&#8203;(@NotNull @NotNull Plugin plugin)`
- `public static void unregisterAll&#8203;(@NotNull @NotNull Listener listener)`
- `public void register&#8203;(@NotNull @NotNull RegisteredListener listener)`
- `public void registerAll&#8203;(@NotNull @NotNull Collection<RegisteredListener> listeners)`
- `public void unregister&#8203;(@NotNull @NotNull RegisteredListener listener)`
- `public void unregister&#8203;(@NotNull @NotNull Plugin plugin)`
- `public void unregister&#8203;(@NotNull @NotNull Listener listener)`
- `public void bake()`
- `@NotNull public @NotNull RegisteredListener[] getRegisteredListeners()`
- `@NotNull public static @NotNull ArrayList<RegisteredListener> getRegisteredListeners&#8203;(@NotNull @NotNull Plugin plugin)`
- `@NotNull public static @NotNull ArrayList<HandlerList> getHandlerLists()`
