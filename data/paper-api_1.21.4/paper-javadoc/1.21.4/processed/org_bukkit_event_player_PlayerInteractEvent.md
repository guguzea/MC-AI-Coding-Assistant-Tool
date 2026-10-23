---
title: "org.bukkit.event.player.PlayerInteractEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/event/player/PlayerInteractEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `protected ItemStack item`
- `protected Action action`
- `protected Block blockClicked`
- `protected BlockFace blockFace`
- `public PlayerInteractEvent(@NotNull @NotNull Player who, @NotNull @NotNull Action action, @Nullable @Nullable ItemStack item, @Nullable @Nullable Block clickedBlock, @NotNull @NotNull BlockFace clickedFace)`
- `public PlayerInteractEvent(@NotNull @NotNull Player who, @NotNull @NotNull Action action, @Nullable @Nullable ItemStack item, @Nullable @Nullable Block clickedBlock, @NotNull @NotNull BlockFace clickedFace, @Nullable @Nullable EquipmentSlot hand)`
- `public PlayerInteractEvent(@NotNull @NotNull Player who, @NotNull @NotNull Action action, @Nullable @Nullable ItemStack item, @Nullable @Nullable Block clickedBlock, @NotNull @NotNull BlockFace clickedFace, @Nullable @Nullable EquipmentSlot hand, @Nullable @Nullable Vector clickedPosition)`
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
- `@NotNull public @NotNull Event.Result useInteractedBlock()`
- `public void setUseInteractedBlock(@NotNull @NotNull Event.Result useInteractedBlock)`
- `@NotNull public @NotNull Event.Result useItemInHand()`
- `public void setUseItemInHand(@NotNull @NotNull Event.Result useItemInHand)`
- `@Nullable public @Nullable EquipmentSlot getHand()`
- `@Nullable @Deprecated public @Nullable Vector getClickedPosition()`
- `@Nullable public @Nullable Location getInteractionPoint()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
