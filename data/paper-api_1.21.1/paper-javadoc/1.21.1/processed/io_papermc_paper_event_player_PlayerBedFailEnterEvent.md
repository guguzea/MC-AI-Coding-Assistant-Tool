---
title: "io.papermc.paper.event.player.PlayerBedFailEnterEvent"
package: "io.papermc.paper.event.player"
source: https://jd.papermc.io/paper/1.21.1/io/papermc/paper/event/player/PlayerBedFailEnterEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@Internal public PlayerBedFailEnterEvent(Player player, PlayerBedFailEnterEvent.FailReason failReason, Block bed, boolean willExplode, @Nullable Component message)`
- `public PlayerBedFailEnterEvent.FailReason getFailReason()`
- `public Block getBed()`
- `public boolean getWillExplode()`
- `public void setWillExplode(boolean willExplode)`
- `public @Nullable Component getMessage()`
- `public void setMessage(@Nullable Component message)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
