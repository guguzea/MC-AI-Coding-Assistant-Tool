---
title: "org.bukkit.event.weather.WeatherChangeEvent"
package: "org.bukkit.event.weather"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/event/weather/WeatherChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@Internal public WeatherChangeEvent(@NotNull @NotNull World world, boolean to, @NotNull @NotNull WeatherChangeEvent.Cause cause)`
- `@Deprecated(forRemoval=true) public WeatherChangeEvent(@NotNull @NotNull World world, boolean to)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public boolean toWeatherState()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
- `@NotNull public @NotNull WeatherChangeEvent.Cause getCause()`
