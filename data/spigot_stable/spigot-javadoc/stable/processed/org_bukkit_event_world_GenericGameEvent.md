---
title: "org.bukkit.event.world.GenericGameEvent"
package: "org.bukkit.event.world"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/world/GenericGameEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class GenericGameEvent**
`public class GenericGameEvent extends WorldEvent implements Cancellable`
- `public GenericGameEvent(@NotNull GameEvent event, @NotNull Location location, @Nullable Entity entity, int radius, boolean isAsync)`
- `@NotNull public GameEvent getEvent()`
- `@NotNull public Location getLocation()`
- `@Nullable public Entity getEntity()`
- `public int getRadius()`
- `public void setRadius(int radius)`
- `public void setCancelled(boolean cancel)`
- `public boolean isCancelled()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
