---
title: "org.bukkit.event.entity.ArrowBodyCountChangeEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/ArrowBodyCountChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class ArrowBodyCountChangeEvent**
`public class ArrowBodyCountChangeEvent extends EntityEvent implements Cancellable`
- `@Internal public ArrowBodyCountChangeEvent(@NotNull @NotNull LivingEntity entity, int oldAmount, int newAmount, boolean reset)`
- `public boolean isReset()`
- `public int getOldAmount()`
- `public int getNewAmount()`
- `public void setNewAmount(int newAmount)`
- `@NotNull public @NotNull LivingEntity getEntity()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
