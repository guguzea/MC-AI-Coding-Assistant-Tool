---
title: "io.papermc.paper.event.player.PlayerServerFullCheckEvent"
package: "io.papermc.paper.event.player"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/player/PlayerServerFullCheckEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerServerFullCheckEvent**
`@NullMarked public class PlayerServerFullCheckEvent extends Event`
- `@Internal public PlayerServerFullCheckEvent(PlayerProfile profile, Component kickMessage, boolean shouldKick)`
- `@Contract(pure=true) public Component kickMessage()`
- `public void deny(Component kickMessage)`
- `public PlayerProfile getPlayerProfile()`
- `public void allow(boolean allow)`
- `public boolean isAllowed()`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
