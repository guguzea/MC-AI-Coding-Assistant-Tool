---
title: "org.bukkit.event.player.PlayerInteractEvent"
package: "org.bukkit.event.player"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/player/PlayerInteractEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PlayerInteractEvent**
`public class PlayerInteractEvent extends PlayerEvent implements Cancellable`
- `protected ItemStack item`
- `protected Action action`
- `protected Block blockClicked`
- `protected BlockFace blockFace`
- `public PlayerInteractEvent(@NotNull Player who, @NotNull Action action, @Nullable ItemStack item, @Nullable Block clickedBlock, @NotNull BlockFace clickedFace)`
- `public PlayerInteractEvent(@NotNull Player who, @NotNull Action action, @Nullable ItemStack item, @Nullable Block clickedBlock, @NotNull BlockFace clickedFace, @Nullable EquipmentSlot hand)`
- `public PlayerInteractEvent(@NotNull Player who, @NotNull Action action, @Nullable ItemStack item, @Nullable Block clickedBlock, @NotNull BlockFace clickedFace, @Nullable EquipmentSlot hand, @Nullable Vector clickedPosition)`
- `@NotNull public Action getAction()`
- `@Deprecated(since="1.14") public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@Nullable public ItemStack getItem()`
- `@NotNull public Material getMaterial()`
- `public boolean hasBlock()`
- `public boolean hasItem()`
- `public boolean isBlockInHand()`
- `@Nullable public Block getClickedBlock()`
- `@NotNull public BlockFace getBlockFace()`
- `@NotNull public Event.Result useInteractedBlock()`
- `public void setUseInteractedBlock(@NotNull Event.Result useInteractedBlock)`
- `@NotNull public Event.Result useItemInHand()`
- `public void setUseItemInHand(@NotNull Event.Result useItemInHand)`
- `@Nullable public EquipmentSlot getHand()`
- `@Nullable public Vector getClickedPosition()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
