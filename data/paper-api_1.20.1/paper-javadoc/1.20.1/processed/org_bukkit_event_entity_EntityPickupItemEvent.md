---
title: "org.bukkit.event.entity.EntityPickupItemEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/event/entity/EntityPickupItemEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public EntityPickupItemEvent(@NotNull @NotNull LivingEntity entity, @NotNull @NotNull Item item, int remaining)`
- `@NotNull public @NotNull LivingEntity getEntity()`
- `@NotNull public @NotNull Item getItem()`
- `public int getRemaining()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
