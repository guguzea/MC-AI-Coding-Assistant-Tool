---
title: "org.bukkit.event.weather.WeatherChangeEvent"
package: "org.bukkit.event.weather"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/weather/WeatherChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class WeatherChangeEvent**
`public class WeatherChangeEvent extends WeatherEvent implements Cancellable`
- `@Internal public WeatherChangeEvent(@NotNull @NotNull World world, boolean newWeatherState, @NotNull @NotNull WeatherChangeEvent.Cause cause)`
- `@Internal @Deprecated(forRemoval=true) public WeatherChangeEvent(@NotNull @NotNull World world, boolean newWeatherState)`
- `public boolean toWeatherState()`
- `@NotNull public @NotNull WeatherChangeEvent.Cause getCause()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
