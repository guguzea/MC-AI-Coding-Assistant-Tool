---
title: "org.bukkit.event.world.GenericGameEvent"
package: "org.bukkit.event.world"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/event/world/GenericGameEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public GenericGameEvent(@NotNull @NotNull GameEvent event, @NotNull @NotNull Location location, @Nullable @Nullable Entity entity, int radius, boolean isAsync)`
- `@NotNull public @NotNull GameEvent getEvent()`
- `@NotNull public @NotNull Location getLocation()`
- `@Nullable public @Nullable Entity getEntity()`
- `public int getRadius()`
- `public void setRadius(int radius)`
- `public void setCancelled(boolean cancel)`
- `public boolean isCancelled()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
