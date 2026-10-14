---
title: "org.bukkit.event.block.BlockIgniteEvent"
package: "org.bukkit.event.block"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/block/BlockIgniteEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class BlockIgniteEvent**
`public class BlockIgniteEvent extends BlockEvent implements Cancellable`
- `public BlockIgniteEvent(@NotNull Block theBlock, @NotNull BlockIgniteEvent.IgniteCause cause, @Nullable Entity ignitingEntity)`
- `public BlockIgniteEvent(@NotNull Block theBlock, @NotNull BlockIgniteEvent.IgniteCause cause, @NotNull Block ignitingBlock)`
- `public BlockIgniteEvent(@NotNull Block theBlock, @NotNull BlockIgniteEvent.IgniteCause cause, @Nullable Entity ignitingEntity, @Nullable Block ignitingBlock)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public BlockIgniteEvent.IgniteCause getCause()`
- `@Nullable public Player getPlayer()`
- `@Nullable public Entity getIgnitingEntity()`
- `@Nullable public Block getIgnitingBlock()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
