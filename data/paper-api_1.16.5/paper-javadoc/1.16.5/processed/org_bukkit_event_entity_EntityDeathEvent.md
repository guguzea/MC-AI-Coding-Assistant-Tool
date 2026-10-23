---
title: "org.bukkit.event.entity.EntityDeathEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/event/entity/EntityDeathEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public EntityDeathEvent&#8203;(@NotNull @NotNull LivingEntity entity, @NotNull @NotNull List<ItemStack> drops)`
- `public EntityDeathEvent&#8203;(@NotNull @NotNull LivingEntity what, @NotNull @NotNull List<ItemStack> drops, int droppedExp)`
- `@NotNull public @NotNull LivingEntity getEntity()`
- `public int getDroppedExp()`
- `public void setDroppedExp&#8203;(int exp)`
- `@NotNull public @NotNull List<ItemStack> getDrops()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
- `public boolean isCancelled()`
- `public void setCancelled&#8203;(boolean cancel)`
- `public double getReviveHealth()`
- `public void setReviveHealth&#8203;(double reviveHealth) throws IllegalArgumentException`
- `public boolean shouldPlayDeathSound()`
- `public void setShouldPlayDeathSound&#8203;(boolean playDeathSound)`
- `@Nullable public Sound getDeathSound()`
- `public void setDeathSound&#8203;(@Nullable Sound sound)`
- `@Nullable public SoundCategory getDeathSoundCategory()`
- `public void setDeathSoundCategory&#8203;(@Nullable SoundCategory soundCategory)`
- `public float getDeathSoundVolume()`
- `public void setDeathSoundVolume&#8203;(float volume)`
- `public float getDeathSoundPitch()`
- `public void setDeathSoundPitch&#8203;(float pitch)`
