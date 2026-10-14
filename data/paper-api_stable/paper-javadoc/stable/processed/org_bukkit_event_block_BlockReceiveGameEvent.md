---
title: "org.bukkit.event.block.BlockReceiveGameEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/block/BlockReceiveGameEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class BlockReceiveGameEvent**
`public class BlockReceiveGameEvent extends BlockEvent implements Cancellable`
- `@Internal public BlockReceiveGameEvent(@NotNull @NotNull GameEvent event, @NotNull @NotNull Block block, @Nullable @Nullable Entity entity)`
- `@NotNull public @NotNull GameEvent getEvent()`
- `@Nullable public @Nullable Entity getEntity()`
- `public void setCancelled(boolean cancel)`
- `public boolean isCancelled()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
