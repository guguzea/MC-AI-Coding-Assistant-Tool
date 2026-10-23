---
title: "org.bukkit.event.entity.EntityShootBowEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/event/entity/EntityShootBowEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@Deprecated(forRemoval=true) public EntityShootBowEvent(@NotNull @NotNull LivingEntity shooter, @Nullable @Nullable ItemStack bow, @NotNull @NotNull Entity projectile, float force)`
- `@Deprecated(forRemoval=true) public EntityShootBowEvent(@NotNull @NotNull LivingEntity shooter, @Nullable @Nullable ItemStack bow, @NotNull @NotNull ItemStack arrowItem, @NotNull @NotNull Entity projectile, float force)`
- `@Internal public EntityShootBowEvent(@NotNull @NotNull LivingEntity shooter, @Nullable @Nullable ItemStack bow, @Nullable @Nullable ItemStack consumable, @NotNull @NotNull Entity projectile, @NotNull @NotNull EquipmentSlot hand, float force, boolean consumeItem)`
- `@Deprecated public void setConsumeArrow(boolean consumeArrow)`
- `@Deprecated public boolean getConsumeArrow()`
- `@Nullable @Deprecated public @Nullable ItemStack getArrowItem()`
- `@NotNull public @NotNull LivingEntity getEntity()`
- `@Nullable public @Nullable ItemStack getBow()`
- `@Nullable public @Nullable ItemStack getConsumable()`
- `@NotNull public @NotNull Entity getProjectile()`
- `public void setProjectile(@NotNull @NotNull Entity projectile)`
- `@NotNull public @NotNull EquipmentSlot getHand()`
- `public float getForce()`
- `@Deprecated(since="1.20.5") public void setConsumeItem(boolean consumeItem)`
- `public boolean shouldConsumeItem()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
