---
title: "org.bukkit.event.entity.EntityDeathEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/event/entity/EntityDeathEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public EntityDeathEvent(@NotNull @NotNull LivingEntity entity, @NotNull @NotNull List<ItemStack> drops)`
- `public EntityDeathEvent(@NotNull @NotNull LivingEntity what, @NotNull @NotNull List<ItemStack> drops, int droppedExp)`
- `@NotNull public @NotNull LivingEntity getEntity()`
- `public int getDroppedExp()`
- `public void setDroppedExp(int exp)`
- `@NotNull public @NotNull List<ItemStack> getDrops()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
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
