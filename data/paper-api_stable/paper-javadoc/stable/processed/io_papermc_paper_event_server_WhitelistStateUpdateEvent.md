---
title: "io.papermc.paper.event.server.WhitelistStateUpdateEvent"
package: "io.papermc.paper.event.server"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/server/WhitelistStateUpdateEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class WhitelistStateUpdateEvent**
`@NullMarked public class WhitelistStateUpdateEvent extends Event implements Cancellable`
- `@Internal public WhitelistStateUpdateEvent(PlayerProfile playerProfile, WhitelistStateUpdateEvent.WhitelistStatus status)`
- `public OfflinePlayer getPlayer()`
- `public PlayerProfile getPlayerProfile()`
- `public WhitelistStateUpdateEvent.WhitelistStatus getStatus()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
