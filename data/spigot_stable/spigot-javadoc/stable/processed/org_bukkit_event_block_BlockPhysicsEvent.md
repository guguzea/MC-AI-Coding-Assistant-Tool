---
title: "org.bukkit.event.block.BlockPhysicsEvent"
package: "org.bukkit.event.block"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/block/BlockPhysicsEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class BlockPhysicsEvent**
`public class BlockPhysicsEvent extends BlockEvent implements Cancellable`
- `public BlockPhysicsEvent(@NotNull Block block, @NotNull BlockData changed)`
- `public BlockPhysicsEvent(@NotNull Block block, @NotNull BlockData changed, @NotNull Block sourceBlock)`
- `@NotNull public Block getSourceBlock()`
- `@NotNull public Material getChangedType()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
