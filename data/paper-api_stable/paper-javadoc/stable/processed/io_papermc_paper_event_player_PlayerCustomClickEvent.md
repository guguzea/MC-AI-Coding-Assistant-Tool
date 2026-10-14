---
title: "io.papermc.paper.event.player.PlayerCustomClickEvent"
package: "io.papermc.paper.event.player"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/player/PlayerCustomClickEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerCustomClickEvent**
`@NonExtendable @NullMarked public abstract class PlayerCustomClickEvent extends Event`
- `@Internal protected PlayerCustomClickEvent(Key identifier, PlayerCommonConnection commonConnection)`
- `public final Key getIdentifier()`
- `public abstract @Nullable BinaryTagHolder getTag()`
- `public abstract @Nullable DialogResponseView getDialogResponseView()`
- `public final PlayerCommonConnection getCommonConnection()`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
