---
title: "org.bukkit.event.entity.EntityRegainHealthEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/event/entity/EntityRegainHealthEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public EntityRegainHealthEvent&#8203;(@NotNull @NotNull Entity entity, double amount, @NotNull @NotNull EntityRegainHealthEvent.RegainReason regainReason)`
- `public EntityRegainHealthEvent&#8203;(@NotNull @NotNull Entity entity, double amount, @NotNull @NotNull EntityRegainHealthEvent.RegainReason regainReason, boolean isFastRegen)`
- `public boolean isFastRegen()`
- `public double getAmount()`
- `public void setAmount&#8203;(double amount)`
- `public boolean isCancelled()`
- `public void setCancelled&#8203;(boolean cancel)`
- `@NotNull public @NotNull EntityRegainHealthEvent.RegainReason getRegainReason()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
