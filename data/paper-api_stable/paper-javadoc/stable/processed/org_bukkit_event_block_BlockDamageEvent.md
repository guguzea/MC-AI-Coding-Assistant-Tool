---
title: "org.bukkit.event.block.BlockDamageEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/block/BlockDamageEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class BlockDamageEvent**
`public class BlockDamageEvent extends BlockEvent implements Cancellable`
- `@Internal @Deprecated(forRemoval=true) public BlockDamageEvent(@NotNull @NotNull Player player, @NotNull @NotNull Block block, @NotNull @NotNull ItemStack itemInHand, boolean instaBreak)`
- `@Internal public BlockDamageEvent(@NotNull @NotNull Player player, @NotNull @NotNull Block block, @NotNull @NotNull BlockFace blockFace, @NotNull @NotNull ItemStack itemInHand, boolean instaBreak)`
- `@NotNull public @NotNull Player getPlayer()`
- `public boolean getInstaBreak()`
- `public void setInstaBreak(boolean instaBreak)`
- `@NotNull public @NotNull ItemStack getItemInHand()`
- `@NotNull public BlockFace getBlockFace()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
