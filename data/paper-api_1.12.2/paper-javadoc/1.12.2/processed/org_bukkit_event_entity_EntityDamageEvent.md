---
title: "org.bukkit.event.entity.EntityDamageEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/1.12.2/org/bukkit/event/entity/EntityDamageEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T09:54:19.288Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
---

- `static class EntityDamageEvent.DamageCause`
- `static class EntityDamageEvent.DamageModifier`
- `EntityDamageEvent.DamageCause getCause()`
- `double getDamage()`
- `double getDamage(EntityDamageEvent.DamageModifier type)`
- `double getFinalDamage()`
- `static HandlerList getHandlerList()`
- `HandlerList getHandlers()`
- `double getOriginalDamage(EntityDamageEvent.DamageModifier type)`
- `boolean isApplicable(EntityDamageEvent.DamageModifier type)`
- `boolean isCancelled()`
- `void setCancelled(boolean cancel)`
- `void setDamage(double damage)`
- `void setDamage(EntityDamageEvent.DamageModifier type, double damage)`
