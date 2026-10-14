---
title: "org.bukkit.event.block.BlockShearEntityEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/block/BlockShearEntityEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class BlockShearEntityEvent**
`public class BlockShearEntityEvent extends BlockEvent implements Cancellable`
- `@Internal public BlockShearEntityEvent(@NotNull @NotNull Block dispenser, @NotNull @NotNull Entity sheared, @NotNull @NotNull ItemStack tool, @NotNull @NotNull List<ItemStack> drops)`
- `@NotNull public @NotNull Entity getEntity()`
- `@NotNull public @NotNull ItemStack getTool()`
- `@NotNull public @NotNull @Unmodifiable List<ItemStack> getDrops()`
- `public void setDrops(@NotNull @NotNull List<ItemStack> drops)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
