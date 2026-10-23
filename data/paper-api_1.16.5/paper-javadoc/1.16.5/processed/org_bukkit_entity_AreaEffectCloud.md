---
title: "org.bukkit.entity.AreaEffectCloud"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/entity/AreaEffectCloud.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `int getDuration()`
- `void setDuration&#8203;(int duration)`
- `int getWaitTime()`
- `void setWaitTime&#8203;(int waitTime)`
- `int getReapplicationDelay()`
- `void setReapplicationDelay&#8203;(int delay)`
- `int getDurationOnUse()`
- `void setDurationOnUse&#8203;(int duration)`
- `float getRadius()`
- `void setRadius&#8203;(float radius)`
- `float getRadiusOnUse()`
- `void setRadiusOnUse&#8203;(float radius)`
- `float getRadiusPerTick()`
- `void setRadiusPerTick&#8203;(float radius)`
- `@NotNull @NotNull Particle getParticle()`
- `void setParticle&#8203;(@NotNull @NotNull Particle particle)`
- `<T> void setParticle&#8203;(@NotNull @NotNull Particle particle, @Nullable T data)`
- `void setBasePotionData&#8203;(@NotNull @NotNull PotionData data)`
- `@NotNull @NotNull PotionData getBasePotionData()`
- `boolean hasCustomEffects()`
- `@NotNull @NotNull List<PotionEffect> getCustomEffects()`
- `boolean addCustomEffect&#8203;(@NotNull @NotNull PotionEffect effect, boolean overwrite)`
- `boolean removeCustomEffect&#8203;(@NotNull @NotNull PotionEffectType type)`
- `boolean hasCustomEffect&#8203;(@Nullable @Nullable PotionEffectType type)`
- `void clearCustomEffects()`
- `@NotNull @NotNull Color getColor()`
- `void setColor&#8203;(@NotNull @NotNull Color color)`
- `@Nullable @Nullable ProjectileSource getSource()`
- `void setSource&#8203;(@Nullable @Nullable ProjectileSource source)`
