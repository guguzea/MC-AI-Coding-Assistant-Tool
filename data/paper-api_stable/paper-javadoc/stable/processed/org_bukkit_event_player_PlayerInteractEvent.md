---
title: "org.bukkit.event.player.PlayerInteractEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerInteractEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerInteractEvent**
`public class PlayerInteractEvent extends PlayerEvent implements Cancellable`
- `@Internal public PlayerInteractEvent(@NotNull @NotNull Player player, @NotNull @NotNull Action action, @Nullable @Nullable ItemStack item, @Nullable @Nullable Block clickedBlock, @NotNull @NotNull BlockFace clickedFace)`
- `@Internal public PlayerInteractEvent(@NotNull @NotNull Player player, @NotNull @NotNull Action action, @Nullable @Nullable ItemStack item, @Nullable @Nullable Block clickedBlock, @NotNull @NotNull BlockFace clickedFace, @Nullable @Nullable EquipmentSlot hand)`
- `@Internal public PlayerInteractEvent(@NotNull @NotNull Player player, @NotNull @NotNull Action action, @Nullable @Nullable ItemStack item, @Nullable @Nullable Block clickedBlock, @NotNull @NotNull BlockFace clickedFace, @Nullable @Nullable EquipmentSlot hand, @Nullable @Nullable Vector clickedPosition)`
- `@NotNull public @NotNull Action getAction()`
- `@Deprecated(since="1.14") public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@Nullable public @Nullable ItemStack getItem()`
- `@NotNull public @NotNull Material getMaterial()`
- `public boolean hasBlock()`
- `public boolean hasItem()`
- `public boolean isBlockInHand()`
- `@Nullable public @Nullable Block getClickedBlock()`
- `@NotNull public @NotNull BlockFace getBlockFace()`
- `@Nullable public @Nullable EquipmentSlot getHand()`
- `@Nullable @Deprecated public @Nullable Vector getClickedPosition()`
- `@Nullable public @Nullable Location getInteractionPoint()`
- `@NotNull public @NotNull Event.Result useInteractedBlock()`
- `public void setUseInteractedBlock(@NotNull @NotNull Event.Result useInteractedBlock)`
- `@NotNull public @NotNull Event.Result useItemInHand()`
- `public void setUseItemInHand(@NotNull @NotNull Event.Result useItemInHand)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
