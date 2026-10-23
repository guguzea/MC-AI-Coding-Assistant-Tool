---
title: "org.bukkit.event.entity.PlayerLeashEntityEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/event/entity/PlayerLeashEntityEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public PlayerLeashEntityEvent(@NotNull @NotNull Entity what, @NotNull @NotNull Entity leashHolder, @NotNull @NotNull Player leasher, @NotNull @NotNull EquipmentSlot hand)`
- `@Deprecated public PlayerLeashEntityEvent(@NotNull @NotNull Entity what, @NotNull @NotNull Entity leashHolder, @NotNull @NotNull Player leasher)`
- `@NotNull public @NotNull Entity getLeashHolder()`
- `@NotNull public @NotNull Entity getEntity()`
- `@NotNull public final @NotNull Player getPlayer()`
- `@NotNull public @NotNull EquipmentSlot getHand()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
