---
title: "org.bukkit.potion.PotionBrewer"
package: "org.bukkit.potion"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/potion/PotionBrewer.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface PotionBrewer**
`public interface PotionBrewer`
- `@NotNull PotionEffect createEffect(@NotNull PotionEffectType potion, int duration, int amplifier)`
- `@Deprecated(since="1.6.2") @NotNull Collection<PotionEffect> getEffectsFromDamage(int damage)`
- `@NotNull @Deprecated(since="1.20.2") Collection<PotionEffect> getEffects(@NotNull PotionType type, boolean upgraded, boolean extended)`
