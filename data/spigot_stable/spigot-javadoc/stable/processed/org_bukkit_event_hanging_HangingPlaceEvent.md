---
title: "org.bukkit.event.hanging.HangingPlaceEvent"
package: "org.bukkit.event.hanging"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/hanging/HangingPlaceEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class HangingPlaceEvent**
`public class HangingPlaceEvent extends HangingEvent implements Cancellable`
- `@Deprecated(since="1.17.1") public HangingPlaceEvent(@NotNull Hanging hanging, @Nullable Player player, @NotNull Block block, @NotNull BlockFace blockFace, @Nullable EquipmentSlot hand)`
- `public HangingPlaceEvent(@NotNull Hanging hanging, @Nullable Player player, @NotNull Block block, @NotNull BlockFace blockFace, @Nullable EquipmentSlot hand, @Nullable ItemStack itemStack)`
- `@Nullable public Player getPlayer()`
- `@NotNull public Block getBlock()`
- `@NotNull public BlockFace getBlockFace()`
- `@Nullable public EquipmentSlot getHand()`
- `@Nullable public ItemStack getItemStack()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
