---
title: "com.destroystokyo.paper.event.player.IllegalPacketEvent"
package: "com.destroystokyo.paper.event.player"
source: https://jd.papermc.io/paper/26.3/com/destroystokyo/paper/event/player/IllegalPacketEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class IllegalPacketEvent**
`@Deprecated(since="1.16.4", forRemoval=true) public class IllegalPacketEvent extends PlayerEvent`
- `@Internal public IllegalPacketEvent(@NotNull @NotNull Player player, @Nullable @Nullable String type, @Nullable @Nullable String kickMessage, @NotNull @NotNull Exception e)`
- `public boolean isShouldKick()`
- `public void setShouldKick(boolean shouldKick)`
- `@Nullable public @Nullable String getKickMessage()`
- `public void setKickMessage(@Nullable @Nullable String kickMessage)`
- `@Nullable public @Nullable String getType()`
- `@Nullable public @Nullable String getExceptionMessage()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
