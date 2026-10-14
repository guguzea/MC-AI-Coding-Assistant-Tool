---
title: "org.bukkit.event.world.PortalCreateEvent"
package: "org.bukkit.event.world"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/world/PortalCreateEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PortalCreateEvent**
`public class PortalCreateEvent extends WorldEvent implements Cancellable`
- `@Deprecated(since="1.14.1") public PortalCreateEvent(@NotNull List<BlockState> blocks, @NotNull World world, @NotNull PortalCreateEvent.CreateReason reason)`
- `public PortalCreateEvent(@NotNull List<BlockState> blocks, @NotNull World world, @Nullable Entity entity, @NotNull PortalCreateEvent.CreateReason reason)`
- `@NotNull public List<BlockState> getBlocks()`
- `@Nullable public Entity getEntity()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public PortalCreateEvent.CreateReason getReason()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
