---
title: "org.bukkit.entity.Arrow"
package: "org.bukkit.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/entity/Arrow.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T07:16:14.361Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface Arrow**
`public interface Arrow extends AbstractArrow`
- `@Deprecated(since="1.20.6") void setBasePotionData(@Nullable PotionData data)`
- `@Nullable @Deprecated(since="1.20.6") PotionData getBasePotionData()`
- `void setBasePotionType(@Nullable PotionType type)`
- `@Nullable PotionType getBasePotionType()`
- `@Nullable Color getColor()`
- `void setColor(@Nullable Color color)`
- `boolean hasCustomEffects()`
- `@NotNull List<PotionEffect> getCustomEffects()`
- `boolean addCustomEffect(@NotNull PotionEffect effect, boolean overwrite)`
- `boolean removeCustomEffect(@NotNull PotionEffectType type)`
- `boolean hasCustomEffect(@Nullable PotionEffectType type)`
- `void clearCustomEffects()`
