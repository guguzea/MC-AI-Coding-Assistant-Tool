---
title: "org.bukkit.event.hanging.HangingPlaceEvent"
package: "org.bukkit.event.hanging"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/event/hanging/HangingPlaceEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `@Deprecated public HangingPlaceEvent(@NotNull @NotNull Hanging hanging, @Nullable @Nullable Player player, @NotNull @NotNull Block block, @NotNull @NotNull BlockFace blockFace, @Nullable @Nullable EquipmentSlot hand)`
- `public HangingPlaceEvent(@NotNull @NotNull Hanging hanging, @Nullable @Nullable Player player, @NotNull @NotNull Block block, @NotNull @NotNull BlockFace blockFace, @Nullable @Nullable EquipmentSlot hand, @Nullable @Nullable ItemStack itemStack)`
- `@Nullable public @Nullable Player getPlayer()`
- `@NotNull public @NotNull Block getBlock()`
- `@NotNull public @NotNull BlockFace getBlockFace()`
- `@Nullable public @Nullable EquipmentSlot getHand()`
- `@Nullable public @Nullable ItemStack getItemStack()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
