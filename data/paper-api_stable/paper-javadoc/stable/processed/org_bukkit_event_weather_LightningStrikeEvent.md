---
title: "org.bukkit.event.weather.LightningStrikeEvent"
package: "org.bukkit.event.weather"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/weather/LightningStrikeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class LightningStrikeEvent**
`public class LightningStrikeEvent extends WeatherEvent implements Cancellable`
- `@Internal @Deprecated(since="1.13.1", forRemoval=true) public LightningStrikeEvent(@NotNull @NotNull World world, @NotNull @NotNull LightningStrike bolt)`
- `@Internal public LightningStrikeEvent(@NotNull @NotNull World world, @NotNull @NotNull LightningStrike bolt, @NotNull @NotNull LightningStrikeEvent.Cause cause)`
- `@NotNull public @NotNull LightningStrike getLightning()`
- `@NotNull public @NotNull LightningStrikeEvent.Cause getCause()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
