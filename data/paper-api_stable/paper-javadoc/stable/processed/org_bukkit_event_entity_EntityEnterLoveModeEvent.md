---
title: "org.bukkit.event.entity.EntityEnterLoveModeEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/EntityEnterLoveModeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class EntityEnterLoveModeEvent**
`public class EntityEnterLoveModeEvent extends EntityEvent implements Cancellable`
- `@Internal public EntityEnterLoveModeEvent(@NotNull @NotNull Animals animalInLove, @Nullable @Nullable HumanEntity humanEntity, int ticksInLove)`
- `@NotNull public @NotNull Animals getEntity()`
- `@Nullable public @Nullable HumanEntity getHumanEntity()`
- `public int getTicksInLove()`
- `public void setTicksInLove(int ticksInLove)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
