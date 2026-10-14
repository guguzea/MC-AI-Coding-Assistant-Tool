---
title: "org.bukkit.event.player.PlayerBedEnterEvent"
package: "org.bukkit.event.player"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/player/PlayerBedEnterEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PlayerBedEnterEvent**
`public class PlayerBedEnterEvent extends PlayerEvent implements Cancellable`
- `public PlayerBedEnterEvent(@NotNull Player who, @NotNull Block bed, @NotNull PlayerBedEnterEvent.BedEnterResult bedEnterResult)`
- `@Deprecated(since="1.13.2") public PlayerBedEnterEvent(@NotNull Player who, @NotNull Block bed)`
- `@NotNull public PlayerBedEnterEvent.BedEnterResult getBedEnterResult()`
- `@NotNull public Event.Result useBed()`
- `public void setUseBed(@NotNull Event.Result useBed)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public Block getBed()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
