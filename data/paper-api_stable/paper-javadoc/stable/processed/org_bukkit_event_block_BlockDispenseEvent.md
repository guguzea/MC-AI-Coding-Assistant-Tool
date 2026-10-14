---
title: "org.bukkit.event.block.BlockDispenseEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/block/BlockDispenseEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class BlockDispenseEvent**
`public class BlockDispenseEvent extends BlockEvent implements Cancellable`
- `@Internal public BlockDispenseEvent(@NotNull @NotNull Block block, @NotNull @NotNull ItemStack item, @NotNull @NotNull Vector velocity)`
- `@NotNull public @NotNull ItemStack getItem()`
- `public void setItem(@NotNull @NotNull ItemStack item)`
- `@NotNull public @NotNull Vector getVelocity()`
- `public void setVelocity(@NotNull @NotNull Vector velocity)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
