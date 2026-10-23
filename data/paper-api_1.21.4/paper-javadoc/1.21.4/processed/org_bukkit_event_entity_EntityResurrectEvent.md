---
title: "org.bukkit.event.entity.EntityResurrectEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/event/entity/EntityResurrectEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@Internal public EntityResurrectEvent(@NotNull @NotNull LivingEntity what, @Nullable @Nullable EquipmentSlot hand)`
- `@Deprecated(since="1.19.2", forRemoval=true) public EntityResurrectEvent(@NotNull @NotNull LivingEntity what)`
- `@NotNull public @NotNull LivingEntity getEntity()`
- `@Nullable public @Nullable EquipmentSlot getHand()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancelled)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
