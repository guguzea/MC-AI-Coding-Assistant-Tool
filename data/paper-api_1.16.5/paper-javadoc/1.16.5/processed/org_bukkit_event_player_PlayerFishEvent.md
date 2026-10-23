---
title: "org.bukkit.event.player.PlayerFishEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/event/player/PlayerFishEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public PlayerFishEvent&#8203;(@NotNull @NotNull Player player, @Nullable @Nullable Entity entity, @NotNull @NotNull FishHook hookEntity, @NotNull @NotNull PlayerFishEvent.State state)`
- `@Nullable public @Nullable Entity getCaught()`
- `@NotNull public @NotNull FishHook getHook()`
- `public boolean isCancelled()`
- `public void setCancelled&#8203;(boolean cancel)`
- `public int getExpToDrop()`
- `public void setExpToDrop&#8203;(int amount)`
- `@NotNull public @NotNull PlayerFishEvent.State getState()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
