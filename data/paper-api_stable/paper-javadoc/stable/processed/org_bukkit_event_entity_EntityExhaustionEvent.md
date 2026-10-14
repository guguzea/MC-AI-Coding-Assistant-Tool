---
title: "org.bukkit.event.entity.EntityExhaustionEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/EntityExhaustionEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class EntityExhaustionEvent**
`public class EntityExhaustionEvent extends EntityEvent implements Cancellable`
- `@Internal public EntityExhaustionEvent(@NotNull @NotNull HumanEntity human, @NotNull @NotNull EntityExhaustionEvent.ExhaustionReason exhaustionReason, float exhaustion)`
- `@NotNull public @NotNull HumanEntity getEntity()`
- `@NotNull public @NotNull EntityExhaustionEvent.ExhaustionReason getExhaustionReason()`
- `public float getExhaustion()`
- `public void setExhaustion(float exhaustion)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
