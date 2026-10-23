---
title: "org.bukkit.event.player.PlayerInteractEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/event/player/PlayerInteractEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `protected ItemStack item`
- `protected Action action`
- `protected Block blockClicked`
- `protected BlockFace blockFace`
- `public PlayerInteractEvent&#8203;(@NotNull @NotNull Player who, @NotNull @NotNull Action action, @Nullable @Nullable ItemStack item, @Nullable @Nullable Block clickedBlock, @NotNull @NotNull BlockFace clickedFace)`
- `public PlayerInteractEvent&#8203;(@NotNull @NotNull Player who, @NotNull @NotNull Action action, @Nullable @Nullable ItemStack item, @Nullable @Nullable Block clickedBlock, @NotNull @NotNull BlockFace clickedFace, @Nullable @Nullable EquipmentSlot hand)`
- `public PlayerInteractEvent&#8203;(@NotNull @NotNull Player who, @NotNull @NotNull Action action, @Nullable @Nullable ItemStack item, @Nullable @Nullable Block clickedBlock, @NotNull @NotNull BlockFace clickedFace, @Nullable @Nullable EquipmentSlot hand, @Nullable @Nullable Location interactionPoint)`
- `@NotNull public @NotNull Action getAction()`
- `@Deprecated public boolean isCancelled()`
- `public void setCancelled&#8203;(boolean cancel)`
- `@Nullable public @Nullable ItemStack getItem()`
- `@NotNull public @NotNull Material getMaterial()`
- `public boolean hasBlock()`
- `public boolean hasItem()`
- `public boolean isBlockInHand()`
- `@Nullable public @Nullable Block getClickedBlock()`
- `@NotNull public @NotNull BlockFace getBlockFace()`
- `@NotNull public @NotNull Event.Result useInteractedBlock()`
- `public void setUseInteractedBlock&#8203;(@NotNull @NotNull Event.Result useInteractedBlock)`
- `@NotNull public @NotNull Event.Result useItemInHand()`
- `public void setUseItemInHand&#8203;(@NotNull @NotNull Event.Result useItemInHand)`
- `@Nullable public @Nullable EquipmentSlot getHand()`
- `@Nullable public @Nullable Location getInteractionPoint()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
