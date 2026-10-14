---
title: "org.bukkit.event.block.BellRingEvent"
package: "org.bukkit.event.block"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/block/BellRingEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T07:16:14.361Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class BellRingEvent**
`public class BellRingEvent extends BlockEvent implements Cancellable`
- `public BellRingEvent(@NotNull Block theBlock, @NotNull BlockFace direction, @Nullable Entity entity)`
- `@NotNull public BlockFace getDirection()`
- `@Nullable public Entity getEntity()`
- `public void setCancelled(boolean cancelled)`
- `public boolean isCancelled()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
