---
title: "org.bukkit.event.entity.EntityShootBowEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/EntityShootBowEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class EntityShootBowEvent**
`public class EntityShootBowEvent extends EntityEvent implements Cancellable`
- `@Internal @Deprecated(forRemoval=true) public EntityShootBowEvent(@NotNull @NotNull LivingEntity shooter, @Nullable @Nullable ItemStack bow, @NotNull @NotNull Entity projectile, float force)`
- `@Internal @Deprecated(forRemoval=true) public EntityShootBowEvent(@NotNull @NotNull LivingEntity shooter, @Nullable @Nullable ItemStack bow, @NotNull @NotNull ItemStack arrowItem, @NotNull @NotNull Entity projectile, float force)`
- `@Internal public EntityShootBowEvent(@NotNull @NotNull LivingEntity shooter, @Nullable @Nullable ItemStack bow, @Nullable @Nullable ItemStack consumable, @NotNull @NotNull Entity projectile, @NotNull @NotNull EquipmentSlot hand, float force, boolean consumeItem)`
- `@NotNull public @NotNull LivingEntity getEntity()`
- `@Nullable public @Nullable ItemStack getBow()`
- `@Nullable public @Nullable ItemStack getConsumable()`
- `@NotNull public @NotNull Entity getProjectile()`
- `public void setProjectile(@NotNull @NotNull Entity projectile)`
- `@NotNull public @NotNull EquipmentSlot getHand()`
- `public float getForce()`
- `@Deprecated(since="1.20.5") public void setConsumeItem(boolean consumeItem)`
- `public boolean shouldConsumeItem()`
- `@Nullable @Deprecated public @Nullable ItemStack getArrowItem()`
- `@Deprecated public void setConsumeArrow(boolean consumeArrow)`
- `@Deprecated public boolean getConsumeArrow()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
