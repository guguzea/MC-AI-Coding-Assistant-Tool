---
title: "org.bukkit.inventory.meta.PotionMeta"
package: "org.bukkit.inventory.meta"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/inventory/meta/PotionMeta.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `void setBasePotionData&#8203;(@NotNull @NotNull PotionData data)`
- `@NotNull @NotNull PotionData getBasePotionData()`
- `boolean hasCustomEffects()`
- `@NotNull @NotNull List<PotionEffect> getCustomEffects()`
- `boolean addCustomEffect&#8203;(@NotNull @NotNull PotionEffect effect, boolean overwrite)`
- `boolean removeCustomEffect&#8203;(@NotNull @NotNull PotionEffectType type)`
- `boolean hasCustomEffect&#8203;(@NotNull @NotNull PotionEffectType type)`
- `@Deprecated boolean setMainEffect&#8203;(@NotNull @NotNull PotionEffectType type)`
- `boolean clearCustomEffects()`
- `boolean hasColor()`
- `@Nullable @Nullable Color getColor()`
- `void setColor&#8203;(@Nullable @Nullable Color color)`
- `PotionMeta clone()`
