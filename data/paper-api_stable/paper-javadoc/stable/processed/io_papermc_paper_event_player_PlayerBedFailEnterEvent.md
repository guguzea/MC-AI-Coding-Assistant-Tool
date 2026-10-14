---
title: "io.papermc.paper.event.player.PlayerBedFailEnterEvent"
package: "io.papermc.paper.event.player"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/player/PlayerBedFailEnterEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerBedFailEnterEvent**
`@NullMarked public class PlayerBedFailEnterEvent extends PlayerEvent implements Cancellable`
- `@Internal public PlayerBedFailEnterEvent(Player player, PlayerBedFailEnterEvent.FailReason failReason, Block bed, boolean willExplode, @Nullable Component message, BedEnterAction enterAction)`
- `@Obsolete(since="1.21.11") public PlayerBedFailEnterEvent.FailReason getFailReason()`
- `public BedEnterAction enterAction()`
- `public Block getBed()`
- `public boolean getWillExplode()`
- `public void setWillExplode(boolean willExplode)`
- `public @Nullable Component getMessage()`
- `public void setMessage(@Nullable Component message)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
