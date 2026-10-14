---
title: "org.bukkit.event.entity.EntityShootBowEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/EntityShootBowEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class EntityShootBowEvent**
`public class EntityShootBowEvent extends EntityEvent implements Cancellable`
- `public EntityShootBowEvent(@NotNull LivingEntity shooter, @Nullable ItemStack bow, @Nullable ItemStack consumable, @NotNull Entity projectile, @NotNull EquipmentSlot hand, float force, boolean consumeItem)`
- `@NotNull public LivingEntity getEntity()`
- `@Nullable public ItemStack getBow()`
- `@Nullable public ItemStack getConsumable()`
- `@NotNull public Entity getProjectile()`
- `public void setProjectile(@NotNull Entity projectile)`
- `@NotNull public EquipmentSlot getHand()`
- `public float getForce()`
- `@Deprecated(since="1.20.5") public void setConsumeItem(boolean consumeItem)`
- `public boolean shouldConsumeItem()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
