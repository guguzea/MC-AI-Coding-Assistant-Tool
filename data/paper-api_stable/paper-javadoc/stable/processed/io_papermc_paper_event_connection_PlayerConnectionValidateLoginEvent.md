---
title: "io.papermc.paper.event.connection.PlayerConnectionValidateLoginEvent"
package: "io.papermc.paper.event.connection"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/connection/PlayerConnectionValidateLoginEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerConnectionValidateLoginEvent**
`public class PlayerConnectionValidateLoginEvent extends Event`
- `@Internal public PlayerConnectionValidateLoginEvent(PlayerConnection connection, @Nullable Component kickMessage)`
- `public PlayerConnection getConnection()`
- `public void allow()`
- `public void kickMessage(Component message)`
- `public @Nullable Component getKickMessage()`
- `public boolean isAllowed()`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
