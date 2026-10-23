---
title: "org.bukkit.entity.AreaEffectCloud"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/entity/AreaEffectCloud.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `int getDuration()`
- `void setDuration(int duration)`
- `int getWaitTime()`
- `void setWaitTime(int waitTime)`
- `int getReapplicationDelay()`
- `void setReapplicationDelay(int delay)`
- `int getDurationOnUse()`
- `void setDurationOnUse(int duration)`
- `float getRadius()`
- `void setRadius(float radius)`
- `float getRadiusOnUse()`
- `void setRadiusOnUse(float radius)`
- `float getRadiusPerTick()`
- `void setRadiusPerTick(float radius)`
- `@NotNull @NotNull Particle getParticle()`
- `void setParticle(@NotNull @NotNull Particle particle)`
- `<T> void setParticle(@NotNull @NotNull Particle particle, @Nullable T data)`
- `@Deprecated(since="1.20.6", forRemoval=true) void setBasePotionData(@Nullable @Nullable PotionData data)`
- `@Nullable @Deprecated(since="1.20.6", forRemoval=true) @Nullable PotionData getBasePotionData()`
- `void setBasePotionType(@Nullable @Nullable PotionType type)`
- `@Nullable @Nullable PotionType getBasePotionType()`
- `boolean hasCustomEffects()`
- `@NotNull @NotNull List<PotionEffect> getCustomEffects()`
- `boolean addCustomEffect(@NotNull @NotNull PotionEffect effect, boolean overwrite)`
- `boolean removeCustomEffect(@NotNull @NotNull PotionEffectType type)`
- `boolean hasCustomEffect(@Nullable @Nullable PotionEffectType type)`
- `void clearCustomEffects()`
- `@NotNull @NotNull Color getColor()`
- `void setColor(@NotNull @NotNull Color color)`
- `@Nullable @Nullable ProjectileSource getSource()`
- `void setSource(@Nullable @Nullable ProjectileSource source)`
- `@Nullable UUID getOwnerUniqueId()`
- `void setOwnerUniqueId(@Nullable UUID ownerUuid)`
