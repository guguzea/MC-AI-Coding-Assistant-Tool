---
title: "org.bukkit.event.entity.EntityDeathEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/EntityDeathEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class EntityDeathEvent**
`public class EntityDeathEvent extends EntityEvent implements Cancellable`
- `@Internal public EntityDeathEvent(@NotNull @NotNull LivingEntity livingEntity, @NotNull @NotNull DamageSource damageSource, @NotNull @NotNull List<ItemStack> drops)`
- `@Internal public EntityDeathEvent(@NotNull @NotNull LivingEntity livingEntity, @NotNull @NotNull DamageSource damageSource, @NotNull @NotNull List<ItemStack> drops, int droppedExp)`
- `@NotNull public @NotNull LivingEntity getEntity()`
- `@NotNull public @NotNull DamageSource getDamageSource()`
- `public int getDroppedExp()`
- `public void setDroppedExp(int exp)`
- `@NotNull public @NotNull List<ItemStack> getDrops()`
- `public double getReviveHealth()`
- `public void setReviveHealth(double reviveHealth) throws IllegalArgumentException`
- `public boolean shouldPlayDeathSound()`
- `public void setShouldPlayDeathSound(boolean playDeathSound)`
- `@Nullable public Sound getDeathSound()`
- `public void setDeathSound(@Nullable Sound sound)`
- `@Nullable public SoundCategory getDeathSoundCategory()`
- `public void setDeathSoundCategory(@Nullable SoundCategory soundCategory)`
- `public float getDeathSoundVolume()`
- `public void setDeathSoundVolume(float volume)`
- `public float getDeathSoundPitch()`
- `public void setDeathSoundPitch(float pitch)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
