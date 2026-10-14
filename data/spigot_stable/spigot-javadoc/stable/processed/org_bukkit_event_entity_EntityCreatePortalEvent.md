---
title: "org.bukkit.event.entity.EntityCreatePortalEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/EntityCreatePortalEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class EntityCreatePortalEvent**
`@Deprecated(since="1.14.1") public class EntityCreatePortalEvent extends EntityEvent implements Cancellable`
- `public EntityCreatePortalEvent(@NotNull LivingEntity what, @NotNull List<BlockState> blocks, @NotNull PortalType type)`
- `@NotNull public LivingEntity getEntity()`
- `@NotNull public List<BlockState> getBlocks()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public PortalType getPortalType()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
