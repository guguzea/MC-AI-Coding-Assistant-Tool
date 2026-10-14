---
title: "org.bukkit.event.block.BlockDispenseLootEvent"
package: "org.bukkit.event.block"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/block/BlockDispenseLootEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T07:16:14.361Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class BlockDispenseLootEvent**
`@Experimental public class BlockDispenseLootEvent extends BlockEvent implements Cancellable`
- `public BlockDispenseLootEvent(@Nullable Player player, @NotNull Block theBlock, @NotNull List<ItemStack> dispensedLoot)`
- `@NotNull public List<ItemStack> getDispensedLoot()`
- `public void setDispensedLoot(@Nullable List<ItemStack> dispensedLoot)`
- `@Nullable public Player getPlayer()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancelled)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
