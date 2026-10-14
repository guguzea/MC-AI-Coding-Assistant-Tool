---
title: "io.papermc.paper.event.player.PlayerNameEntityEvent"
package: "io.papermc.paper.event.player"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/player/PlayerNameEntityEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerNameEntityEvent**
`@NullMarked public class PlayerNameEntityEvent extends PlayerEvent implements Cancellable`
- `@Internal public PlayerNameEntityEvent(Player player, LivingEntity entity, Component name, boolean persistent)`
- `public @Nullable Component getName()`
- `public void setName(@Nullable Component name)`
- `public LivingEntity getEntity()`
- `public void setEntity(LivingEntity entity)`
- `public boolean isPersistent()`
- `public void setPersistent(boolean persistent)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
