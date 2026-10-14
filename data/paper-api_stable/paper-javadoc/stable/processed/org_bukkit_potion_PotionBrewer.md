---
title: "org.bukkit.potion.PotionBrewer"
package: "org.bukkit.potion"
source: https://jd.papermc.io/paper/26.3/org/bukkit/potion/PotionBrewer.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface PotionBrewer**
`@Deprecated(since="26.3", forRemoval=true) public interface PotionBrewer`
- `@Deprecated(since="26.3", forRemoval=true) default void addPotionMix(@NotNull PotionMix potionMix)`
- `@Deprecated(since="26.3", forRemoval=true) default void removePotionMix(@NotNull NamespacedKey key)`
- `@Deprecated(since="26.3", forRemoval=true) void resetPotionMixes()`
- `@Deprecated(forRemoval=true, since="1.20.5") @NotNull default @NotNull PotionEffect createEffect(@NotNull @NotNull PotionEffectType potion, int duration, int amplifier)`
- `@Deprecated(since="1.6.2", forRemoval=true) @NotNull default @NotNull Collection<PotionEffect> getEffectsFromDamage(int damage)`
- `@NotNull @Deprecated(since="1.20.2", forRemoval=true) @NotNull Collection<PotionEffect> getEffects(@NotNull @NotNull PotionType type, boolean upgraded, boolean extended)`
