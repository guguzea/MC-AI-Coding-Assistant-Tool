---
title: "org.bukkit.event.block.BlockDispenseLootEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/block/BlockDispenseLootEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class BlockDispenseLootEvent**
`public class BlockDispenseLootEvent extends BlockEvent implements Cancellable`
- `@Internal public BlockDispenseLootEvent(@Nullable @Nullable Player player, @NotNull @NotNull Block block, @NotNull @NotNull List<ItemStack> dispensedLoot, @NotNull @NotNull LootTable lootTable)`
- `@NotNull public @NotNull List<ItemStack> getDispensedLoot()`
- `public void setDispensedLoot(@Nullable @Nullable List<ItemStack> dispensedLoot)`
- `@NotNull public @NotNull LootTable getLootTable()`
- `@Nullable public @Nullable Player getPlayer()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
