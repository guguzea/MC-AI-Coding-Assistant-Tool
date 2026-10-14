---
title: "org.bukkit.inventory.meta.PotionMeta"
package: "org.bukkit.inventory.meta"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/inventory/meta/PotionMeta.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface PotionMeta**
`public interface PotionMeta extends ItemMeta`
- `@Deprecated(since="1.20.6") void setBasePotionData(@Nullable PotionData data)`
- `@Nullable @Deprecated(since="1.20.6") PotionData getBasePotionData()`
- `void setBasePotionType(@Nullable PotionType type)`
- `@Nullable PotionType getBasePotionType()`
- `boolean hasBasePotionType()`
- `boolean hasCustomEffects()`
- `@NotNull List<PotionEffect> getCustomEffects()`
- `boolean addCustomEffect(@NotNull PotionEffect effect, boolean overwrite)`
- `boolean removeCustomEffect(@NotNull PotionEffectType type)`
- `boolean hasCustomEffect(@NotNull PotionEffectType type)`
- `@Deprecated(since="1.9") boolean setMainEffect(@NotNull PotionEffectType type)`
- `boolean clearCustomEffects()`
- `boolean hasColor()`
- `@Nullable Color getColor()`
- `void setColor(@Nullable Color color)`
- `boolean hasCustomName()`
- `@Nullable String getCustomName()`
- `void setCustomName(@Nullable String name)`
- `boolean hasDurationScale()`
- `@Nullable float getDurationScale()`
- `void setDurationScale(@Nullable Float scale)`
- `PotionMeta clone()`
