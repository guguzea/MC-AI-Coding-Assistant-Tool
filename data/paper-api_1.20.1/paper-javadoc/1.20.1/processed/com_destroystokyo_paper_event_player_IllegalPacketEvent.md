---
title: "com.destroystokyo.paper.event.player.IllegalPacketEvent"
package: "com.destroystokyo.paper.event.player"
source: https://jd.papermc.io/paper/1.20.1/com/destroystokyo/paper/event/player/IllegalPacketEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public IllegalPacketEvent(@NotNull @NotNull Player player, @Nullable @Nullable String type, @Nullable @Nullable String kickMessage, @NotNull @NotNull Exception e)`
- `public boolean isShouldKick()`
- `public void setShouldKick(boolean shouldKick)`
- `@Nullable public @Nullable String getKickMessage()`
- `public void setKickMessage(@Nullable @Nullable String kickMessage)`
- `@Nullable public @Nullable String getType()`
- `@Nullable public @Nullable String getExceptionMessage()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
- `public static void process(@NotNull @NotNull Player player, @Nullable @Nullable String type, @Nullable @Nullable String kickMessage, @NotNull @NotNull Exception exception)`
