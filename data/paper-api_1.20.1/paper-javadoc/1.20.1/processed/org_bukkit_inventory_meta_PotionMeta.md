---
title: "org.bukkit.inventory.meta.PotionMeta"
package: "org.bukkit.inventory.meta"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/inventory/meta/PotionMeta.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `void setBasePotionData(@NotNull @NotNull PotionData data)`
- `@NotNull @NotNull PotionData getBasePotionData()`
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
