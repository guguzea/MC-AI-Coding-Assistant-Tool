---
title: "org.bukkit.potion.PotionEffect"
package: "org.bukkit.potion"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/potion/PotionEffect.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PotionEffect**
`public class PotionEffect extends Object implements ConfigurationSerializable`
- `public static final int INFINITE_DURATION`
- `public PotionEffect(@NotNull PotionEffectType type, int duration, int amplifier, boolean ambient, boolean particles, boolean icon)`
- `public PotionEffect(@NotNull PotionEffectType type, int duration, int amplifier, boolean ambient, boolean particles)`
- `public PotionEffect(@NotNull PotionEffectType type, int duration, int amplifier, boolean ambient)`
- `public PotionEffect(@NotNull PotionEffectType type, int duration, int amplifier)`
- `public PotionEffect(@NotNull Map<String,Object> map)`
- `@NotNull public Map<String,Object> serialize()`
- `public boolean apply(@NotNull LivingEntity entity)`
- `public boolean equals(Object obj)`
- `public int getAmplifier()`
- `public int getDuration()`
- `public boolean isInfinite()`
- `public boolean isShorterThan(@NotNull PotionEffect other)`
- `@NotNull public PotionEffectType getType()`
- `public boolean isAmbient()`
- `public boolean hasParticles()`
- `@Deprecated(since="1.13") @Nullable @Contract("-> null") public Color getColor()`
- `public boolean hasIcon()`
- `public int hashCode()`
- `public String toString()`
