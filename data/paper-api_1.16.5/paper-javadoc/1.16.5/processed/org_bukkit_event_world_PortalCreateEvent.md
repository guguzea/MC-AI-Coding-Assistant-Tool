---
title: "org.bukkit.event.world.PortalCreateEvent"
package: "org.bukkit.event.world"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/event/world/PortalCreateEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `@Deprecated public PortalCreateEvent&#8203;(@NotNull @NotNull List<BlockState> blocks, @NotNull @NotNull World world, @NotNull @NotNull PortalCreateEvent.CreateReason reason)`
- `public PortalCreateEvent&#8203;(@NotNull @NotNull List<BlockState> blocks, @NotNull @NotNull World world, @Nullable @Nullable Entity entity, @NotNull @NotNull PortalCreateEvent.CreateReason reason)`
- `@NotNull public @NotNull List<BlockState> getBlocks()`
- `@Nullable public @Nullable Entity getEntity()`
- `public boolean isCancelled()`
- `public void setCancelled&#8203;(boolean cancel)`
- `@NotNull public @NotNull PortalCreateEvent.CreateReason getReason()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
