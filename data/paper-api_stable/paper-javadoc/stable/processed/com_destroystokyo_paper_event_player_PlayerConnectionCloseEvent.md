---
title: "com.destroystokyo.paper.event.player.PlayerConnectionCloseEvent"
package: "com.destroystokyo.paper.event.player"
source: https://jd.papermc.io/paper/26.3/com/destroystokyo/paper/event/player/PlayerConnectionCloseEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerConnectionCloseEvent**
`@NullMarked public class PlayerConnectionCloseEvent extends Event`
- `@Internal public PlayerConnectionCloseEvent(UUID playerUniqueId, String playerName, InetAddress ipAddress, boolean async)`
- `public UUID getPlayerUniqueId()`
- `public String getPlayerName()`
- `public InetAddress getIpAddress()`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
