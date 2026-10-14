---
title: "org.bukkit.entity.AreaEffectCloud"
package: "org.bukkit.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/entity/AreaEffectCloud.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T07:16:14.361Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface AreaEffectCloud**
`public interface AreaEffectCloud extends Entity`
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
- `@NotNull Particle getParticle()`
- `void setParticle(@NotNull Particle particle)`
- `<T> void setParticle(@NotNull Particle particle, @Nullable T data)`
- `@Deprecated(since="1.20.6") void setBasePotionData(@Nullable PotionData data)`
- `@Nullable @Deprecated(since="1.20.6") PotionData getBasePotionData()`
- `void setBasePotionType(@Nullable PotionType type)`
- `@Nullable PotionType getBasePotionType()`
- `boolean hasCustomEffects()`
- `@NotNull List<PotionEffect> getCustomEffects()`
- `boolean addCustomEffect(@NotNull PotionEffect effect, boolean overwrite)`
- `boolean removeCustomEffect(@NotNull PotionEffectType type)`
- `boolean hasCustomEffect(@Nullable PotionEffectType type)`
- `void clearCustomEffects()`
- `@NotNull Color getColor()`
- `void setColor(@NotNull Color color)`
- `@Nullable ProjectileSource getSource()`
- `void setSource(@Nullable ProjectileSource source)`
