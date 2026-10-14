---
title: "org.bukkit.event.block.BlockBurnEvent"
package: "org.bukkit.event.block"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/block/BlockBurnEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T07:16:14.361Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class BlockBurnEvent**
`public class BlockBurnEvent extends BlockEvent implements Cancellable`
- `@Deprecated(since="1.11.2") public BlockBurnEvent(@NotNull Block block)`
- `public BlockBurnEvent(@NotNull Block block, @Nullable Block ignitingBlock)`
- `@Nullable public Block getIgnitingBlock()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
