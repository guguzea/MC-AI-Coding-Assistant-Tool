---
title: "io.papermc.paper.event.player.PlayerBedFailEnterEvent"
package: "io.papermc.paper.event.player"
source: https://jd.papermc.io/paper/1.20.1/io/papermc/paper/event/player/PlayerBedFailEnterEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public PlayerBedFailEnterEvent(@NotNull @NotNull Player player, @NotNull @NotNull PlayerBedFailEnterEvent.FailReason failReason, @NotNull @NotNull Block bed, boolean willExplode, @Nullable @Nullable Component message)`
- `@NotNull public @NotNull PlayerBedFailEnterEvent.FailReason getFailReason()`
- `@NotNull public @NotNull Block getBed()`
- `public boolean getWillExplode()`
- `public void setWillExplode(boolean willExplode)`
- `@Nullable public @Nullable Component getMessage()`
- `public void setMessage(@Nullable @Nullable Component message)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
