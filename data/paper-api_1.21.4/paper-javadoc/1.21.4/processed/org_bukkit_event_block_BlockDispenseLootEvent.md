---
title: "org.bukkit.event.block.BlockDispenseLootEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/event/block/BlockDispenseLootEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `public BlockDispenseLootEvent(@Nullable @Nullable Player player, @NotNull @NotNull Block theBlock, @NotNull @NotNull List<ItemStack> dispensedLoot)`
- `@NotNull public @NotNull List<ItemStack> getDispensedLoot()`
- `public void setDispensedLoot(@Nullable @Nullable List<ItemStack> dispensedLoot)`
- `@Nullable public @Nullable Player getPlayer()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancelled)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
