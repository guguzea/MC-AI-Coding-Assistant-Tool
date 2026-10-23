---
title: "org.bukkit.event.player.PlayerBedEnterEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/event/player/PlayerBedEnterEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public PlayerBedEnterEvent(@NotNull @NotNull Player who, @NotNull @NotNull Block bed, @NotNull @NotNull PlayerBedEnterEvent.BedEnterResult bedEnterResult)`
- `@Deprecated public PlayerBedEnterEvent(@NotNull @NotNull Player who, @NotNull @NotNull Block bed)`
- `@NotNull public @NotNull PlayerBedEnterEvent.BedEnterResult getBedEnterResult()`
- `@NotNull public @NotNull Event.Result useBed()`
- `public void setUseBed(@NotNull @NotNull Event.Result useBed)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull Block getBed()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
