---
title: "org.bukkit.event.entity.AreaEffectCloudApplyEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/AreaEffectCloudApplyEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class AreaEffectCloudApplyEvent**
`public class AreaEffectCloudApplyEvent extends EntityEvent implements Cancellable`
- `@Internal public AreaEffectCloudApplyEvent(@NotNull @NotNull AreaEffectCloud entity, @NotNull @NotNull List<LivingEntity> affectedEntities)`
- `@NotNull public @NotNull AreaEffectCloud getEntity()`
- `@NotNull public @NotNull List<LivingEntity> getAffectedEntities()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
