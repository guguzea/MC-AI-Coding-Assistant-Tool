---
title: "org.bukkit.event.world.PortalCreateEvent"
package: "org.bukkit.event.world"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/world/PortalCreateEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PortalCreateEvent**
`public class PortalCreateEvent extends WorldEvent implements Cancellable`
- `@Internal @Deprecated(since="1.14.1", forRemoval=true) public PortalCreateEvent(@NotNull @NotNull List<BlockState> blocks, @NotNull @NotNull World world, @NotNull @NotNull PortalCreateEvent.CreateReason reason)`
- `@Internal public PortalCreateEvent(@NotNull @NotNull List<BlockState> blocks, @NotNull @NotNull World world, @Nullable @Nullable Entity entity, @NotNull @NotNull PortalCreateEvent.CreateReason reason)`
- `@NotNull public @NotNull List<BlockState> getBlocks()`
- `@Nullable public @Nullable Entity getEntity()`
- `@NotNull public @NotNull PortalCreateEvent.CreateReason getReason()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
