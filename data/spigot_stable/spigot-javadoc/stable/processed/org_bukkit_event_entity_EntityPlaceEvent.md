---
title: "org.bukkit.event.entity.EntityPlaceEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/EntityPlaceEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class EntityPlaceEvent**
`public class EntityPlaceEvent extends EntityEvent implements Cancellable`
- `public EntityPlaceEvent(@NotNull Entity entity, @Nullable Player player, @NotNull Block block, @NotNull BlockFace blockFace, @NotNull EquipmentSlot hand)`
- `@Deprecated(since="1.19.2") public EntityPlaceEvent(@NotNull Entity entity, @Nullable Player player, @NotNull Block block, @NotNull BlockFace blockFace)`
- `@Nullable public Player getPlayer()`
- `@NotNull public Block getBlock()`
- `@NotNull public BlockFace getBlockFace()`
- `@NotNull public EquipmentSlot getHand()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
