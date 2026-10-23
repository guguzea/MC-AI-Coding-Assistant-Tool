---
title: "org.bukkit.inventory.meta.PotionMeta"
package: "org.bukkit.inventory.meta"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/inventory/meta/PotionMeta.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@Deprecated void setBasePotionData(@Nullable @Nullable PotionData data)`
- `@Nullable @Deprecated @Nullable PotionData getBasePotionData()`
- `void setBasePotionType(@Nullable @Nullable PotionType type)`
- `@Nullable @Nullable PotionType getBasePotionType()`
- `boolean hasBasePotionType()`
- `boolean hasCustomEffects()`
- `@NotNull @NotNull List<PotionEffect> getCustomEffects()`
- `boolean addCustomEffect(@NotNull @NotNull PotionEffect effect, boolean overwrite)`
- `boolean removeCustomEffect(@NotNull @NotNull PotionEffectType type)`
- `boolean hasCustomEffect(@NotNull @NotNull PotionEffectType type)`
- `@Deprecated boolean setMainEffect(@NotNull @NotNull PotionEffectType type)`
- `boolean clearCustomEffects()`
- `boolean hasColor()`
- `@Nullable @Nullable Color getColor()`
- `void setColor(@Nullable @Nullable Color color)`
- `PotionMeta clone()`
