---
title: "org.bukkit.event.player.PlayerMoveEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/event/player/PlayerMoveEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public PlayerMoveEvent&#8203;(@NotNull @NotNull Player player, @NotNull @NotNull Location from, @Nullable @Nullable Location to)`
- `public boolean isCancelled()`
- `public void setCancelled&#8203;(boolean cancel)`
- `@NotNull public @NotNull Location getFrom()`
- `public void setFrom&#8203;(@NotNull @NotNull Location from)`
- `@NotNull public @NotNull Location getTo()`
- `public void setTo&#8203;(@NotNull @NotNull Location to)`
- `public boolean hasChangedPosition()`
- `public boolean hasExplicitlyChangedPosition()`
- `public boolean hasChangedBlock()`
- `public boolean hasExplicitlyChangedBlock()`
- `public boolean hasChangedOrientation()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
