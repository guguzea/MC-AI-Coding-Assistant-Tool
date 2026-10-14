---
title: "org.bukkit.entity.Arrow"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/entity/Arrow.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Arrow**
`public interface Arrow extends AbstractArrow`
- `@Deprecated(since="1.20.6", forRemoval=true) void setBasePotionData(@Nullable @Nullable PotionData data)`
- `@Nullable @Deprecated(since="1.20.6", forRemoval=true) @Nullable PotionData getBasePotionData()`
- `void setBasePotionType(@Nullable @Nullable PotionType type)`
- `@Nullable @Nullable PotionType getBasePotionType()`
- `@Nullable @Nullable Color getColor()`
- `void setColor(@Nullable @Nullable Color color)`
- `boolean hasCustomEffects()`
- `@NotNull @NotNull List<PotionEffect> getCustomEffects()`
- `boolean addCustomEffect(@NotNull @NotNull PotionEffect effect, boolean overwrite)`
- `boolean removeCustomEffect(@NotNull @NotNull PotionEffectType type)`
- `boolean hasCustomEffect(@Nullable @Nullable PotionEffectType type)`
- `void clearCustomEffects()`
