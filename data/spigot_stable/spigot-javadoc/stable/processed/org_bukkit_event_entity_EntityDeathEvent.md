---
title: "org.bukkit.event.entity.EntityDeathEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/EntityDeathEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class EntityDeathEvent**
`public class EntityDeathEvent extends EntityEvent`
- `public EntityDeathEvent(@NotNull LivingEntity entity, @NotNull DamageSource damageSource, @NotNull List<ItemStack> drops)`
- `public EntityDeathEvent(@NotNull LivingEntity what, @NotNull DamageSource damageSource, @NotNull List<ItemStack> drops, int droppedExp)`
- `@NotNull public LivingEntity getEntity()`
- `@NotNull public DamageSource getDamageSource()`
- `public int getDroppedExp()`
- `public void setDroppedExp(int exp)`
- `@NotNull public List<ItemStack> getDrops()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
