---
title: "org.bukkit.event.player.PlayerBedEnterEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerBedEnterEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerBedEnterEvent**
`public class PlayerBedEnterEvent extends PlayerEvent implements Cancellable`
- `@Internal public PlayerBedEnterEvent(@NotNull @NotNull Player player, @NotNull @NotNull Block bed, @NotNull @NotNull PlayerBedEnterEvent.BedEnterResult bedEnterResult, @NotNull @NotNull BedEnterAction enterAction)`
- `@NotNull public @NotNull Block getBed()`
- `@NotNull @Obsolete(since="1.21.11") public @NotNull PlayerBedEnterEvent.BedEnterResult getBedEnterResult()`
- `@NotNull public @NotNull BedEnterAction enterAction()`
- `@NotNull public @NotNull Event.Result useBed()`
- `public void setUseBed(@NotNull @NotNull Event.Result useBed)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
