---
title: "org.bukkit.entity.MushroomCow"
package: "org.bukkit.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/entity/MushroomCow.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface MushroomCow**
`public interface MushroomCow extends AbstractCow`
- `boolean hasEffectsForNextStew()`
- `@NotNull List<PotionEffect> getEffectsForNextStew()`
- `boolean addEffectToNextStew(@NotNull PotionEffect effect, boolean overwrite)`
- `boolean removeEffectFromNextStew(@NotNull PotionEffectType type)`
- `boolean hasEffectForNextStew(@NotNull PotionEffectType type)`
- `void clearEffectsForNextStew()`
- `@NotNull MushroomCow.Variant getVariant()`
- `void setVariant(@NotNull MushroomCow.Variant variant)`
