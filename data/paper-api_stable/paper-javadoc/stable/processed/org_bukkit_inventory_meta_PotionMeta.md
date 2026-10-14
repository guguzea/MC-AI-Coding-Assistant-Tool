---
title: "org.bukkit.inventory.meta.PotionMeta"
package: "org.bukkit.inventory.meta"
source: https://jd.papermc.io/paper/26.3/org/bukkit/inventory/meta/PotionMeta.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface PotionMeta**
`public interface PotionMeta extends ItemMeta`
- `@Deprecated(since="1.20.6", forRemoval=true) void setBasePotionData(@Nullable @Nullable PotionData data)`
- `@Nullable @Deprecated(since="1.20.6", forRemoval=true) @Nullable PotionData getBasePotionData()`
- `void setBasePotionType(@Nullable @Nullable PotionType type)`
- `@Nullable @Nullable PotionType getBasePotionType()`
- `boolean hasBasePotionType()`
- `boolean hasCustomEffects()`
- `@NotNull @NotNull List<PotionEffect> getCustomEffects()`
- `@NotNull @NotNull @Unmodifiable List<PotionEffect> getAllEffects()`
- `boolean addCustomEffect(@NotNull @NotNull PotionEffect effect, boolean overwrite)`
- `boolean removeCustomEffect(@NotNull @NotNull PotionEffectType type)`
- `boolean hasCustomEffect(@NotNull @NotNull PotionEffectType type)`
- `@Deprecated(since="1.9") boolean setMainEffect(@NotNull @NotNull PotionEffectType type)`
- `boolean clearCustomEffects()`
- `boolean hasColor()`
- `@Nullable @Nullable Color getColor()`
- `void setColor(@Nullable @Nullable Color color)`
- `@NotNull @NotNull Color computeEffectiveColor()`
- `@Deprecated(forRemoval=true, since="1.21.4") default boolean hasCustomName()`
- `@Deprecated(forRemoval=true, since="1.21.4") @Nullable default @Nullable String getCustomName()`
- `@Deprecated(forRemoval=true, since="1.21.4") default void setCustomName(@Nullable @Nullable String name)`
- `boolean hasCustomPotionName()`
- `@Nullable @Nullable String getCustomPotionName()`
- `void setCustomPotionName(@Nullable @Nullable String name)`
- `PotionMeta clone()`
