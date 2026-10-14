---
title: "org.bukkit.event.entity.EntityExhaustionEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/EntityExhaustionEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class EntityExhaustionEvent**
`public class EntityExhaustionEvent extends EntityEvent implements Cancellable`
- `public EntityExhaustionEvent(@NotNull HumanEntity who, @NotNull EntityExhaustionEvent.ExhaustionReason exhaustionReason, float exhaustion)`
- `@NotNull public EntityExhaustionEvent.ExhaustionReason getExhaustionReason()`
- `public float getExhaustion()`
- `public void setExhaustion(float exhaustion)`
- `@NotNull public HumanEntity getEntity()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
