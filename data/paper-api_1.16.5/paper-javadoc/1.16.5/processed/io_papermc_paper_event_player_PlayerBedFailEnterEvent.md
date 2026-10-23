---
title: "io.papermc.paper.event.player.PlayerBedFailEnterEvent"
package: "io.papermc.paper.event.player"
source: https://jd.papermc.io/paper/1.16.5/io/papermc/paper/event/player/PlayerBedFailEnterEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public PlayerBedFailEnterEvent&#8203;(@NotNull @NotNull Player player, @NotNull @NotNull PlayerBedFailEnterEvent.FailReason failReason, @NotNull @NotNull Block bed, boolean willExplode, @Nullable @Nullable Component message)`
- `@NotNull public @NotNull PlayerBedFailEnterEvent.FailReason getFailReason()`
- `@NotNull public @NotNull Block getBed()`
- `public boolean getWillExplode()`
- `public void setWillExplode&#8203;(boolean willExplode)`
- `@Nullable public @Nullable Component getMessage()`
- `public void setMessage&#8203;(@Nullable @Nullable Component message)`
- `public boolean isCancelled()`
- `public void setCancelled&#8203;(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
