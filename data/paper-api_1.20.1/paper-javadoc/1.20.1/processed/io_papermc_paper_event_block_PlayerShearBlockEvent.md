---
title: "io.papermc.paper.event.block.PlayerShearBlockEvent"
package: "io.papermc.paper.event.block"
source: https://jd.papermc.io/paper/1.20.1/io/papermc/paper/event/block/PlayerShearBlockEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public PlayerShearBlockEvent(@NotNull @NotNull Player who, @NotNull @NotNull Block block, @NotNull @NotNull ItemStack item, @NotNull @NotNull EquipmentSlot hand, @NotNull @NotNull List<ItemStack> drops)`
- `@NotNull public @NotNull Block getBlock()`
- `@NotNull public @NotNull ItemStack getItem()`
- `@NotNull public @NotNull EquipmentSlot getHand()`
- `@NotNull public @NotNull List<ItemStack> getDrops()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
