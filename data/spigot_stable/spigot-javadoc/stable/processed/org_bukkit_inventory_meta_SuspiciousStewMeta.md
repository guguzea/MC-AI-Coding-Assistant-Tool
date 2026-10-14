---
title: "org.bukkit.inventory.meta.SuspiciousStewMeta"
package: "org.bukkit.inventory.meta"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/inventory/meta/SuspiciousStewMeta.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface SuspiciousStewMeta**
`public interface SuspiciousStewMeta extends ItemMeta`
- `boolean hasCustomEffects()`
- `@NotNull List<PotionEffect> getCustomEffects()`
- `boolean addCustomEffect(@NotNull PotionEffect effect, boolean overwrite)`
- `boolean removeCustomEffect(@NotNull PotionEffectType type)`
- `boolean hasCustomEffect(@NotNull PotionEffectType type)`
- `boolean clearCustomEffects()`
- `SuspiciousStewMeta clone()`
