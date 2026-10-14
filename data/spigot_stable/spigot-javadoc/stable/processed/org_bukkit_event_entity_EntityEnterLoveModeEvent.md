---
title: "org.bukkit.event.entity.EntityEnterLoveModeEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/EntityEnterLoveModeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class EntityEnterLoveModeEvent**
`public class EntityEnterLoveModeEvent extends EntityEvent implements Cancellable`
- `public EntityEnterLoveModeEvent(@NotNull Animals animalInLove, @Nullable HumanEntity humanEntity, int ticksInLove)`
- `@NotNull public Animals getEntity()`
- `@Nullable public HumanEntity getHumanEntity()`
- `public int getTicksInLove()`
- `public void setTicksInLove(int ticksInLove)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
