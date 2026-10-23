---
title: "org.bukkit.potion.PotionBrewer"
package: "org.bukkit.potion"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/potion/PotionBrewer.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `void addPotionMix(@NotNull PotionMix potionMix)`
- `void removePotionMix(@NotNull NamespacedKey key)`
- `void resetPotionMixes()`
- `@Deprecated(forRemoval=true, since="1.20.5") @NotNull default @NotNull PotionEffect createEffect(@NotNull @NotNull PotionEffectType potion, int duration, int amplifier)`
- `@Deprecated(since="1.6.2", forRemoval=true) @NotNull default @NotNull Collection<PotionEffect> getEffectsFromDamage(int damage)`
- `@NotNull @Deprecated(since="1.20.2", forRemoval=true) @NotNull Collection<PotionEffect> getEffects(@NotNull @NotNull PotionType type, boolean upgraded, boolean extended)`
