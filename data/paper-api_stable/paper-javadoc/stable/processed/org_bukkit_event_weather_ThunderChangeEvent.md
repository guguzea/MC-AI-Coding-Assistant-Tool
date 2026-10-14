---
title: "org.bukkit.event.weather.ThunderChangeEvent"
package: "org.bukkit.event.weather"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/weather/ThunderChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class ThunderChangeEvent**
`public class ThunderChangeEvent extends WeatherEvent implements Cancellable`
- `@Internal public ThunderChangeEvent(@NotNull @NotNull World world, boolean newThunderState, @NotNull @NotNull ThunderChangeEvent.Cause cause)`
- `@Internal @Deprecated(forRemoval=true) public ThunderChangeEvent(@NotNull @NotNull World world, boolean newThunderState)`
- `public boolean toThunderState()`
- `@NotNull public @NotNull ThunderChangeEvent.Cause getCause()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
