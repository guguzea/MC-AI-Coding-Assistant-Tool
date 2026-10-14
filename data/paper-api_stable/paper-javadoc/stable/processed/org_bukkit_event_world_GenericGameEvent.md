---
title: "org.bukkit.event.world.GenericGameEvent"
package: "org.bukkit.event.world"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/world/GenericGameEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class GenericGameEvent**
`public class GenericGameEvent extends WorldEvent implements Cancellable`
- `@Internal public GenericGameEvent(@NotNull @NotNull GameEvent event, @NotNull @NotNull Location location, @Nullable @Nullable Entity entity, int radius, boolean isAsync)`
- `@NotNull public @NotNull GameEvent getEvent()`
- `@NotNull public @NotNull Location getLocation()`
- `@Nullable public @Nullable Entity getEntity()`
- `public int getRadius()`
- `public void setRadius(int radius)`
- `public void setCancelled(boolean cancel)`
- `public boolean isCancelled()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
