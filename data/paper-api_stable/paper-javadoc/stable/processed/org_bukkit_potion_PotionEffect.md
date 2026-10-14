---
title: "org.bukkit.potion.PotionEffect"
package: "org.bukkit.potion"
source: https://jd.papermc.io/paper/26.3/org/bukkit/potion/PotionEffect.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PotionEffect**
`public class PotionEffect extends Object implements ConfigurationSerializable`
- `public static final int INFINITE_DURATION`
- `public PotionEffect(@NotNull @NotNull PotionEffectType type, int duration, int amplifier, boolean ambient, boolean particles, boolean icon)`
- `public PotionEffect(@NotNull @NotNull PotionEffectType type, int duration, int amplifier, boolean ambient, boolean particles)`
- `public PotionEffect(@NotNull @NotNull PotionEffectType type, int duration, int amplifier, boolean ambient)`
- `public PotionEffect(@NotNull @NotNull PotionEffectType type, int duration, int amplifier)`
- `public PotionEffect(@NotNull @NotNull Map<String,Object> map)`
- `@NotNull public @NotNull PotionEffect withType(@NotNull @NotNull PotionEffectType type)`
- `@NotNull public @NotNull PotionEffect withDuration(int duration)`
- `@NotNull public @NotNull PotionEffect withAmplifier(int amplifier)`
- `@NotNull public @NotNull PotionEffect withAmbient(boolean ambient)`
- `@NotNull public @NotNull PotionEffect withParticles(boolean particles)`
- `@NotNull public @NotNull PotionEffect withIcon(boolean icon)`
- `@Nullable public @Nullable PotionEffect getHiddenPotionEffect()`
- `@NotNull public @NotNull Map<String,Object> serialize()`
- `public boolean apply(@NotNull @NotNull LivingEntity entity)`
- `public boolean equals(Object obj)`
- `public int getAmplifier()`
- `public int getDuration()`
- `public boolean isInfinite()`
- `public boolean isShorterThan(@NotNull @NotNull PotionEffect other)`
- `@NotNull public @NotNull PotionEffectType getType()`
- `public boolean isAmbient()`
- `public boolean hasParticles()`
- `@Deprecated(since="1.13") @Nullable @Contract("-> null") public @Nullable Color getColor()`
- `public boolean hasIcon()`
- `public int hashCode()`
- `public String toString()`
