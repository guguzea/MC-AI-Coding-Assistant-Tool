---
title: "org.bukkit.event.block.BellRingEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/block/BellRingEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class BellRingEvent**
`public class BellRingEvent extends BlockEvent implements Cancellable`
- `@Internal public BellRingEvent(@NotNull @NotNull Block block, @NotNull @NotNull BlockFace direction, @Nullable @Nullable Entity entity)`
- `@NotNull public @NotNull BlockFace getDirection()`
- `@Nullable public @Nullable Entity getEntity()`
- `public void setCancelled(boolean cancel)`
- `public boolean isCancelled()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
