---
title: "org.bukkit.event.block.BlockDamageEvent"
package: "org.bukkit.event.block"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/block/BlockDamageEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T07:16:14.361Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class BlockDamageEvent**
`public class BlockDamageEvent extends BlockEvent implements Cancellable`
- `public BlockDamageEvent(@NotNull Player player, @NotNull Block block, @NotNull ItemStack itemInHand, boolean instaBreak)`
- `@NotNull public Player getPlayer()`
- `public boolean getInstaBreak()`
- `public void setInstaBreak(boolean bool)`
- `@NotNull public ItemStack getItemInHand()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
