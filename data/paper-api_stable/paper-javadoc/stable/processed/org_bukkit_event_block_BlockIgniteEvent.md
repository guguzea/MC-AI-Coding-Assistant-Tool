---
title: "org.bukkit.event.block.BlockIgniteEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/block/BlockIgniteEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class BlockIgniteEvent**
`public class BlockIgniteEvent extends BlockEvent implements Cancellable`
- `@Internal public BlockIgniteEvent(@NotNull @NotNull Block block, @NotNull @NotNull BlockIgniteEvent.IgniteCause cause, @Nullable @Nullable Entity ignitingEntity)`
- `@Internal public BlockIgniteEvent(@NotNull @NotNull Block block, @NotNull @NotNull BlockIgniteEvent.IgniteCause cause, @NotNull @NotNull Block ignitingBlock)`
- `@Internal public BlockIgniteEvent(@NotNull @NotNull Block block, @NotNull @NotNull BlockIgniteEvent.IgniteCause cause, @Nullable @Nullable Entity ignitingEntity, @Nullable @Nullable Block ignitingBlock)`
- `@NotNull public @NotNull BlockIgniteEvent.IgniteCause getCause()`
- `@Nullable public @Nullable Player getPlayer()`
- `@Nullable public @Nullable Entity getIgnitingEntity()`
- `@Nullable public @Nullable Block getIgnitingBlock()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
