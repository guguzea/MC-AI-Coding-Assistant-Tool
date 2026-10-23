---
title: "org.bukkit.potion.PotionBrewer"
package: "org.bukkit.potion"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/potion/PotionBrewer.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `void addPotionMix(@NotNull PotionMix potionMix)`
- `void removePotionMix(@NotNull NamespacedKey key)`
- `void resetPotionMixes()`
- `@Deprecated(forRemoval=true, since="1.20.5") @NotNull default @NotNull PotionEffect createEffect(@NotNull @NotNull PotionEffectType potion, int duration, int amplifier)`
- `@Deprecated(forRemoval=true, since="1.20.5") @NotNull default @NotNull Collection<PotionEffect> getEffectsFromDamage(int damage)`
- `@NotNull @Deprecated(forRemoval=true, since="1.20.5") @NotNull Collection<PotionEffect> getEffects(@NotNull @NotNull PotionType type, boolean upgraded, boolean extended)`
