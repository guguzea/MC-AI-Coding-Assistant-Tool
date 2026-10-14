---
title: "org.bukkit.event.entity.EntityRegainHealthEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/EntityRegainHealthEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class EntityRegainHealthEvent**
`public class EntityRegainHealthEvent extends EntityEvent implements Cancellable`
- `@Internal public EntityRegainHealthEvent(@NotNull @NotNull Entity entity, double amount, @NotNull @NotNull EntityRegainHealthEvent.RegainReason regainReason)`
- `@Internal public EntityRegainHealthEvent(@NotNull @NotNull Entity entity, double amount, @NotNull @NotNull EntityRegainHealthEvent.RegainReason regainReason, boolean isFastRegen)`
- `public double getAmount()`
- `public void setAmount(double amount)`
- `@NotNull public @NotNull EntityRegainHealthEvent.RegainReason getRegainReason()`
- `public boolean isFastRegen()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
