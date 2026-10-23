---
title: "org.bukkit.entity.MushroomCow"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/entity/MushroomCow.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `boolean hasEffectsForNextStew()`
- `@NotNull @NotNull List<PotionEffect> getEffectsForNextStew()`
- `@Deprecated(forRemoval=true, since="1.20.2") boolean addEffectToNextStew(@NotNull @NotNull PotionEffect effect, boolean overwrite)`
- `boolean addEffectToNextStew(@NotNull SuspiciousEffectEntry suspiciousEffectEntry, boolean overwrite)`
- `boolean removeEffectFromNextStew(@NotNull @NotNull PotionEffectType type)`
- `boolean hasEffectForNextStew(@NotNull @NotNull PotionEffectType type)`
- `void clearEffectsForNextStew()`
- `@NotNull @NotNull MushroomCow.Variant getVariant()`
- `void setVariant(@NotNull @NotNull MushroomCow.Variant variant)`
- `@Deprecated(forRemoval=true, since="1.20.2") @Contract("-> fail") default int getStewEffectDuration()`
- `@Deprecated(forRemoval=true, since="1.20.2") @Contract("_ -> fail") default void setStewEffectDuration(int duration)`
- `@Deprecated(forRemoval=true, since="1.20.2") @Contract("-> fail") default PotionEffectType getStewEffectType()`
- `@Deprecated(forRemoval=true, since="1.20.2") @Contract("_ -> fail") default void setStewEffect(@Nullable PotionEffectType type)`
- `@NotNull @Unmodifiable List<SuspiciousEffectEntry> getStewEffects()`
- `void setStewEffects(@NotNull List<SuspiciousEffectEntry> effects)`
