---
title: "com.destroystokyo.paper.event.player.IllegalPacketEvent"
package: "com.destroystokyo.paper.event.player"
source: https://jd.papermc.io/paper/1.16.5/com/destroystokyo/paper/event/player/IllegalPacketEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public IllegalPacketEvent&#8203;(@NotNull @NotNull Player player, @Nullable @Nullable String type, @Nullable @Nullable String kickMessage, @NotNull @NotNull Exception e)`
- `public boolean isShouldKick()`
- `public void setShouldKick&#8203;(boolean shouldKick)`
- `@Nullable public @Nullable String getKickMessage()`
- `public void setKickMessage&#8203;(@Nullable @Nullable String kickMessage)`
- `@Nullable public @Nullable String getType()`
- `@Nullable public @Nullable String getExceptionMessage()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
- `public static void process&#8203;(@NotNull @NotNull Player player, @Nullable @Nullable String type, @Nullable @Nullable String kickMessage, @NotNull @NotNull Exception exception)`
