---
title: "org.bukkit.event.block.BlockShearEntityEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/event/block/BlockShearEntityEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@Internal public BlockShearEntityEvent(@NotNull @NotNull Block dispenser, @NotNull @NotNull Entity sheared, @NotNull @NotNull ItemStack tool, @NotNull List<ItemStack> drops)`
- `@NotNull public @NotNull Entity getEntity()`
- `@NotNull public @NotNull ItemStack getTool()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancelled)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
- `public @NotNull @Unmodifiable List<ItemStack> getDrops()`
- `public void setDrops(@NotNull List<ItemStack> drops)`
