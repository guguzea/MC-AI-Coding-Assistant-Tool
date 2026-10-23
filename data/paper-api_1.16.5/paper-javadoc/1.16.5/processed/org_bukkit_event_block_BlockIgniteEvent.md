---
title: "org.bukkit.event.block.BlockIgniteEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/event/block/BlockIgniteEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public BlockIgniteEvent&#8203;(@NotNull @NotNull Block theBlock, @NotNull @NotNull BlockIgniteEvent.IgniteCause cause, @Nullable @Nullable Entity ignitingEntity)`
- `public BlockIgniteEvent&#8203;(@NotNull @NotNull Block theBlock, @NotNull @NotNull BlockIgniteEvent.IgniteCause cause, @NotNull @NotNull Block ignitingBlock)`
- `public BlockIgniteEvent&#8203;(@NotNull @NotNull Block theBlock, @NotNull @NotNull BlockIgniteEvent.IgniteCause cause, @Nullable @Nullable Entity ignitingEntity, @Nullable @Nullable Block ignitingBlock)`
- `public boolean isCancelled()`
- `public void setCancelled&#8203;(boolean cancel)`
- `@NotNull public @NotNull BlockIgniteEvent.IgniteCause getCause()`
- `@Nullable public @Nullable Player getPlayer()`
- `@Nullable public @Nullable Entity getIgnitingEntity()`
- `@Nullable public @Nullable Block getIgnitingBlock()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
