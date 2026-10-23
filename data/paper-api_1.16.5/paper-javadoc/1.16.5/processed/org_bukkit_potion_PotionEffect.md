---
title: "org.bukkit.potion.PotionEffect"
package: "org.bukkit.potion"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/potion/PotionEffect.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public PotionEffect&#8203;(@NotNull @NotNull PotionEffectType type, int duration, int amplifier, boolean ambient, boolean particles, boolean icon)`
- `public PotionEffect&#8203;(@NotNull @NotNull PotionEffectType type, int duration, int amplifier, boolean ambient, boolean particles)`
- `public PotionEffect&#8203;(@NotNull @NotNull PotionEffectType type, int duration, int amplifier, boolean ambient)`
- `public PotionEffect&#8203;(@NotNull @NotNull PotionEffectType type, int duration, int amplifier)`
- `public PotionEffect&#8203;(@NotNull @NotNull Map<String,&#8203;Object> map)`
- `@NotNull public @NotNull PotionEffect withType&#8203;(@NotNull @NotNull PotionEffectType type)`
- `@NotNull public @NotNull PotionEffect withDuration&#8203;(int duration)`
- `@NotNull public @NotNull PotionEffect withAmplifier&#8203;(int amplifier)`
- `@NotNull public @NotNull PotionEffect withAmbient&#8203;(boolean ambient)`
- `@NotNull public @NotNull PotionEffect withParticles&#8203;(boolean particles)`
- `@NotNull public @NotNull PotionEffect withIcon&#8203;(boolean icon)`
- `@NotNull public @NotNull Map<String,&#8203;Object> serialize()`
- `public boolean apply&#8203;(@NotNull @NotNull LivingEntity entity)`
- `public boolean equals&#8203;(Object obj)`
- `public int getAmplifier()`
- `public int getDuration()`
- `@NotNull public @NotNull PotionEffectType getType()`
- `public boolean isAmbient()`
- `public boolean hasParticles()`
- `@Deprecated @Nullable @Contract("-> null") public @Nullable Color getColor()`
- `public boolean hasIcon()`
- `public int hashCode()`
- `public String toString()`
