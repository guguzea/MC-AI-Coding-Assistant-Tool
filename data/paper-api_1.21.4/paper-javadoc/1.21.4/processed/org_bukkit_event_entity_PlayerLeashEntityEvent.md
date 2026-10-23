---
title: "org.bukkit.event.entity.PlayerLeashEntityEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/event/entity/PlayerLeashEntityEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@Internal public PlayerLeashEntityEvent(@NotNull @NotNull Entity what, @NotNull @NotNull Entity leashHolder, @NotNull @NotNull Player leasher, @NotNull @NotNull EquipmentSlot hand)`
- `@Deprecated(since="1.19.2", forRemoval=true) public PlayerLeashEntityEvent(@NotNull @NotNull Entity what, @NotNull @NotNull Entity leashHolder, @NotNull @NotNull Player leasher)`
- `@NotNull public @NotNull Entity getLeashHolder()`
- `@NotNull public @NotNull Entity getEntity()`
- `@NotNull public final @NotNull Player getPlayer()`
- `@NotNull public @NotNull EquipmentSlot getHand()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
