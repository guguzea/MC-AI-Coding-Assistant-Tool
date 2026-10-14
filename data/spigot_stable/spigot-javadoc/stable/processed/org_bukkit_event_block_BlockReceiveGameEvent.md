---
title: "org.bukkit.event.block.BlockReceiveGameEvent"
package: "org.bukkit.event.block"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/block/BlockReceiveGameEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class BlockReceiveGameEvent**
`public class BlockReceiveGameEvent extends BlockEvent implements Cancellable`
- `public BlockReceiveGameEvent(@NotNull GameEvent event, @NotNull Block block, @Nullable Entity entity)`
- `@NotNull public GameEvent getEvent()`
- `@Nullable public Entity getEntity()`
- `public void setCancelled(boolean cancel)`
- `public boolean isCancelled()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
