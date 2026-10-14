---
title: "org.bukkit.event.block.BlockDispenseEvent"
package: "org.bukkit.event.block"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/block/BlockDispenseEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T07:16:14.361Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class BlockDispenseEvent**
`public class BlockDispenseEvent extends BlockEvent implements Cancellable`
- `public BlockDispenseEvent(@NotNull Block block, @NotNull ItemStack dispensed, @NotNull Vector velocity)`
- `@NotNull public ItemStack getItem()`
- `public void setItem(@NotNull ItemStack item)`
- `@NotNull public Vector getVelocity()`
- `public void setVelocity(@NotNull Vector vel)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
