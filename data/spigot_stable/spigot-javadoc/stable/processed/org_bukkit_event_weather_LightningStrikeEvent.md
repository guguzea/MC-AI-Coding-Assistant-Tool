---
title: "org.bukkit.event.weather.LightningStrikeEvent"
package: "org.bukkit.event.weather"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/weather/LightningStrikeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class LightningStrikeEvent**
`public class LightningStrikeEvent extends WeatherEvent implements Cancellable`
- `@Deprecated(since="1.13.1") public LightningStrikeEvent(@NotNull World world, @NotNull LightningStrike bolt)`
- `public LightningStrikeEvent(@NotNull World world, @NotNull LightningStrike bolt, @NotNull LightningStrikeEvent.Cause cause)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public LightningStrike getLightning()`
- `@NotNull public LightningStrikeEvent.Cause getCause()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
