---
title: "org.bukkit.inventory.meta.SuspiciousStewMeta"
package: "org.bukkit.inventory.meta"
source: https://jd.papermc.io/paper/26.3/org/bukkit/inventory/meta/SuspiciousStewMeta.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface SuspiciousStewMeta**
`public interface SuspiciousStewMeta extends ItemMeta`
- `boolean hasCustomEffects()`
- `@NotNull @NotNull List<PotionEffect> getCustomEffects()`
- `@Deprecated boolean addCustomEffect(@NotNull @NotNull PotionEffect effect, boolean overwrite)`
- `boolean addCustomEffect(@NotNull SuspiciousEffectEntry suspiciousEffectEntry, boolean overwrite)`
- `boolean removeCustomEffect(@NotNull @NotNull PotionEffectType type)`
- `boolean hasCustomEffect(@NotNull @NotNull PotionEffectType type)`
- `boolean clearCustomEffects()`
- `SuspiciousStewMeta clone()`
