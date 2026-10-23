---
title: "org.bukkit.event.entity.EntityExhaustionEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/event/entity/EntityExhaustionEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `public EntityExhaustionEvent(@NotNull @NotNull HumanEntity who, @NotNull @NotNull EntityExhaustionEvent.ExhaustionReason exhaustionReason, float exhaustion)`
- `@NotNull public @NotNull EntityExhaustionEvent.ExhaustionReason getExhaustionReason()`
- `public float getExhaustion()`
- `public void setExhaustion(float exhaustion)`
- `@NotNull public @NotNull HumanEntity getEntity()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
