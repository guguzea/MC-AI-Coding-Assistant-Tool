---
title: "org.bukkit.event.entity.EntityCreatePortalEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/EntityCreatePortalEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class EntityCreatePortalEvent**
`@Deprecated(since="1.14.1") public class EntityCreatePortalEvent extends EntityEvent implements Cancellable`
- `@Internal public EntityCreatePortalEvent(@NotNull @NotNull LivingEntity livingEntity, @NotNull @NotNull List<BlockState> blocks, @NotNull @NotNull PortalType type)`
- `@NotNull public @NotNull LivingEntity getEntity()`
- `@NotNull public @NotNull List<BlockState> getBlocks()`
- `@NotNull public @NotNull PortalType getPortalType()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
