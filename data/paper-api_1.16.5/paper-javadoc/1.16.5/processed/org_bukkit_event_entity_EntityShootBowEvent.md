---
title: "org.bukkit.event.entity.EntityShootBowEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/event/entity/EntityShootBowEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `@Deprecated public EntityShootBowEvent&#8203;(@NotNull @NotNull LivingEntity shooter, @Nullable @Nullable ItemStack bow, @NotNull @NotNull Entity projectile, float force)`
- `@Deprecated public EntityShootBowEvent&#8203;(@NotNull @NotNull LivingEntity shooter, @Nullable @Nullable ItemStack bow, @NotNull @NotNull ItemStack arrowItem, @NotNull @NotNull Entity projectile, float force)`
- `public EntityShootBowEvent&#8203;(@NotNull @NotNull LivingEntity shooter, @Nullable @Nullable ItemStack bow, @Nullable @Nullable ItemStack consumable, @NotNull @NotNull Entity projectile, @NotNull @NotNull EquipmentSlot hand, float force, boolean consumeItem)`
- `@Deprecated public void setConsumeArrow&#8203;(boolean consumeArrow)`
- `@Deprecated public boolean getConsumeArrow()`
- `@NotNull @Deprecated public @NotNull ItemStack getArrowItem()`
- `@NotNull public @NotNull LivingEntity getEntity()`
- `@Nullable public @Nullable ItemStack getBow()`
- `@Nullable public @Nullable ItemStack getConsumable()`
- `@NotNull public @NotNull Entity getProjectile()`
- `public void setProjectile&#8203;(@NotNull @NotNull Entity projectile)`
- `@NotNull public @NotNull EquipmentSlot getHand()`
- `public float getForce()`
- `public void setConsumeItem&#8203;(boolean consumeItem)`
- `public boolean shouldConsumeItem()`
- `public boolean isCancelled()`
- `public void setCancelled&#8203;(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
