---
title: "org.bukkit.event.entity.EntityPlaceEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/event/entity/EntityPlaceEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `public EntityPlaceEvent(@NotNull @NotNull Entity entity, @Nullable @Nullable Player player, @NotNull @NotNull Block block, @NotNull @NotNull BlockFace blockFace, @NotNull @NotNull EquipmentSlot hand)`
- `@Deprecated public EntityPlaceEvent(@NotNull @NotNull Entity entity, @Nullable @Nullable Player player, @NotNull @NotNull Block block, @NotNull @NotNull BlockFace blockFace)`
- `@Nullable public @Nullable Player getPlayer()`
- `@NotNull public @NotNull Block getBlock()`
- `@NotNull public @NotNull BlockFace getBlockFace()`
- `@NotNull public @NotNull EquipmentSlot getHand()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
