---
title: "org.bukkit.event.block.BlockCookEvent"
package: "org.bukkit.event.block"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/block/BlockCookEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T07:16:14.361Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class BlockCookEvent**
`public class BlockCookEvent extends BlockEvent implements Cancellable`
- `public BlockCookEvent(@NotNull Block block, @NotNull ItemStack source, @NotNull ItemStack result)`
- `@NotNull public ItemStack getSource()`
- `@NotNull public ItemStack getResult()`
- `public void setResult(@NotNull ItemStack result)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
