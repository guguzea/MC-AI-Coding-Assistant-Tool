---
title: "org.bukkit.event.entity.EntityRegainHealthEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/EntityRegainHealthEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class EntityRegainHealthEvent**
`public class EntityRegainHealthEvent extends EntityEvent implements Cancellable`
- `public EntityRegainHealthEvent(@NotNull Entity entity, double amount, @NotNull EntityRegainHealthEvent.RegainReason regainReason)`
- `public double getAmount()`
- `public void setAmount(double amount)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public EntityRegainHealthEvent.RegainReason getRegainReason()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
