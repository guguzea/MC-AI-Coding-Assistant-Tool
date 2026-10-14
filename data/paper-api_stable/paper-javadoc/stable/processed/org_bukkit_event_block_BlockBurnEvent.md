---
title: "org.bukkit.event.block.BlockBurnEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/block/BlockBurnEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class BlockBurnEvent**
`public class BlockBurnEvent extends BlockEvent implements Cancellable`
- `@Deprecated(since="1.11.2", forRemoval=true) @Internal public BlockBurnEvent(@NotNull @NotNull Block block)`
- `@Internal public BlockBurnEvent(@NotNull @NotNull Block block, @Nullable @Nullable Block ignitingBlock)`
- `@Nullable public @Nullable Block getIgnitingBlock()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
